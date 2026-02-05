import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Code2, Copy, Check, Trash2 } from 'lucide-react'

export function XmlFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  const formatXml = (compress = false) => {
    setError('')
    if (!input.trim()) {
      setOutput('')
      return
    }

    try {
      let formatted = input.trim()
      const spaces = ' '.repeat(indent)

      if (compress) {
        formatted = formatted
          .replace(/\s+</g, '<')
          .replace(/>\s+/g, '>')
      } else {
        formatted = formatted
          .replace(/>\s*</g, '>\n<')
          .replace(/</g, '\n<')
          .replace(/^(\n)+/, '')
        
        const lines = formatted.split('\n')
        let indentLevel = 0
        const result: string[] = []
        
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          
          if (trimmed.match(/^\<\/\w/)) {
            indentLevel = Math.max(0, indentLevel - 1)
          }
          
          result.push(spaces.repeat(indentLevel) + trimmed)
          
          if (trimmed.match(/^\<\w[^>]*[^\/]\>.*$/) && !trimmed.match(/\<\/\w/)) {
            indentLevel++
          }
        }
        
        formatted = result.join('\n')
      }

      setOutput(formatted)
    } catch {
      setError('格式化失败：请检查 XML 语法')
      setOutput('')
    }
  }

  const minify = () => formatXml(true)

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Code2 className="h-8 w-8" />
          XML 格式化
        </h1>
        <p className="text-muted-foreground">
          格式化、压缩和美化 XML 数据
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>输入</CardTitle>
            <CardDescription>粘贴你的 XML 数据</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="<root><item>value</item></root>"
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={() => formatXml()} className="flex-1">
                格式化
              </Button>
              <Button onClick={minify} variant="outline" className="flex-1">
                压缩
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>输出</CardTitle>
            <CardDescription>
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                '格式化后的结果'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`min-h-[300px] rounded-lg border p-4 font-mono text-sm overflow-auto ${
                error ? 'border-destructive' : 'border-input'
              }`}
            >
              <pre className="whitespace-pre-wrap break-all">{output}</pre>
            </div>
            <Button
              onClick={copyToClipboard}
              disabled={!output}
              className="w-full"
              variant={copied ? 'outline' : 'default'}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制结果
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
