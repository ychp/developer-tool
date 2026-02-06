import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Code2, Copy, Check, Trash2, FileJson, Undo, Redo, FlaskConical } from 'lucide-react'
import { JsonTree } from '@/components/shared/JsonTree'
import { useUndoRedo } from '@/hooks/useUndoRedo'

type JsonNode = string | number | boolean | null | { [key: string]: JsonNode } | JsonNode[]

export function JsonFormatter() {
  const { value: input, setValue: setInput, undo, redo, canUndo, canRedo, reset } = useUndoRedo()
  const [parsedData, setParsedData] = useState<JsonNode | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  const formatJson = (compress = false) => {
    setError('')
    if (!input.trim()) {
      setParsedData(null)
      return
    }

    try {
      const parsed = JSON.parse(input) as JsonNode
      setParsedData(parsed)
      const space = compress ? 0 : indent
      const formatted = JSON.stringify(parsed, null, space)
      setInput(formatted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON')
      setParsedData(null)
    }
  }

  const minify = () => formatJson(true)

  const copyToClipboard = async () => {
    if (input) {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clear = () => {
    reset('')
    setParsedData(null)
    setError('')
  }

  const loadTestData = () => {
    const testData = {
      "name": "开发者工具箱",
      "version": "1.0.0",
      "description": "一个现代化的在线开发者工具箱",
      "features": [
        "JSON 格式化",
        "XML 格式化",
        "Base64 编解码",
        "URL 编解码",
        "正则测试",
        "文本对比"
      ],
      "settings": {
        "theme": "light",
        "language": "zh-CN",
        "autoSave": true,
        "maxHistory": 50
      },
      "author": {
        "name": "ychp",
        "email": "example@email.com",
        "github": "https://github.com/ychp"
      },
      "tags": ["工具", "开发者", "Web", "React", "TypeScript"]
    }
    setInput(JSON.stringify(testData, null, 0))
    setParsedData(testData)
    setError('')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Code2 className="h-8 w-8" />
          JSON 格式化
        </h1>
        <p className="text-muted-foreground">
          格式化、压缩和验证 JSON 数据
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>JSON 编辑器</CardTitle>
            <CardDescription>
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                '输入或粘贴 JSON 数据，点击格式化后结果将覆盖此处'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 items-center justify-end pb-2 border-b">
              <span className="text-xs text-muted-foreground">
                快捷键: Ctrl+Z 撤销 / Ctrl+Shift+Z 或 Ctrl+Y 重做
              </span>
              <Button onClick={undo} disabled={!canUndo} variant="outline" size="sm">
                <Undo className="h-4 w-4 mr-1" />
                撤销
              </Button>
              <Button onClick={redo} disabled={!canRedo} variant="outline" size="sm">
                <Redo className="h-4 w-4 mr-1" />
                重做
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"name": "value"}'
              className="min-h-[500px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={() => formatJson()} className="flex-1">
                格式化
              </Button>
              <Button onClick={minify} variant="outline" className="flex-1">
                压缩
              </Button>
              <Button onClick={loadTestData} variant="secondary" size="sm">
                <FlaskConical className="h-4 w-4 mr-1" />
                测试
              </Button>
              <Button onClick={clear} variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">缩进空格:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="rounded border border-input bg-background px-2 py-1 text-sm"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
              </select>
            </div>
            <Button
              onClick={copyToClipboard}
              disabled={!input}
              className="w-full"
              variant={copied ? "outline" : "default"}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制 JSON
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              对象视图
            </CardTitle>
            <CardDescription>
              {parsedData && !error ? (
                <span>点击节点可展开或收起</span>
              ) : (
                <span className="text-muted-foreground">格式化后将在此显示树状结构</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-input p-4 min-h-[500px] max-h-[600px] overflow-auto">
              {parsedData && !error ? (
                <JsonTree data={parsedData} />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[450px] text-muted-foreground">
                  <div className="text-center">
                    <FileJson className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>暂无数据</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
