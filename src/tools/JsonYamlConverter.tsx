import { useState, useEffect } from 'react'
import { ArrowRightLeft, FileJson, FileCode, Copy, Check, Trash2, Download, Upload, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import yaml from 'js-yaml'

type ConversionDirection = 'json-to-yaml' | 'yaml-to-json'

export function JsonYamlConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [direction, setDirection] = useState<ConversionDirection>('json-to-yaml')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indentSpaces, setIndentSpaces] = useState(2)

  const convert = () => {
    if (!input.trim()) {
      setOutput('')
      setError('')
      return
    }

    setError('')

    try {
      if (direction === 'json-to-yaml') {
        const parsed = JSON.parse(input)
        const yamlString = yaml.dump(parsed, {
          indent: indentSpaces,
          lineWidth: -1,
          noRefs: true,
        })
        setOutput(yamlString)
      } else {
        const parsed = yaml.load(input)
        if (parsed === undefined || parsed === null) {
          throw new Error('YAML 内容为空或无效')
        }
        const jsonString = JSON.stringify(parsed, null, 2)
        setOutput(jsonString)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '转换失败'
      setError(errorMessage)
      setOutput('')
    }
  }

  useEffect(() => {
    convert()
  }, [input, direction, indentSpaces])

  const swapDirection = () => {
    const newDirection = direction === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml'
    setDirection(newDirection)
    if (output && !error) {
      setInput(output)
    }
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  const loadSample = () => {
    const sampleJson = {
      name: '示例项目',
      version: '1.0.0',
      description: '这是一个示例配置文件',
      author: {
        name: '张三',
        email: 'zhangsan@example.com'
      },
      features: ['功能1', '功能2', '功能3'],
      settings: {
        debug: true,
        maxConnections: 100,
        timeout: 30
      }
    }
    setInput(JSON.stringify(sampleJson, null, 2))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setInput(content)
    }
    reader.readAsText(file)
  }

  const downloadOutput = () => {
    const extension = direction === 'json-to-yaml' ? 'yaml' : 'json'
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `converted.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<FileJson className="h-8 w-8" />}
        title="JSON/YAML 转换器"
        description="JSON 和 YAML 格式互转，支持格式化和验证"
      />

      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-sky-500" />
              转换设置
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">缩进空格:</span>
                <select
                  value={indentSpaces}
                  onChange={(e) => setIndentSpaces(Number(e.target.value))}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm"
                >
                  <option value={2}>2</option>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                </select>
              </label>
              <Button variant="outline" size="sm" onClick={loadSample}>
                示例
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 转换方向 */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={direction === 'json-to-yaml' ? 'default' : 'outline'}
              onClick={() => setDirection('json-to-yaml')}
              className="flex items-center gap-2"
            >
              <FileJson className="h-4 w-4" />
              JSON → YAML
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={swapDirection}
              className="rounded-full p-2"
              title="交换方向"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={direction === 'yaml-to-json' ? 'default' : 'outline'}
              onClick={() => setDirection('yaml-to-json')}
              className="flex items-center gap-2"
            >
              <FileCode className="h-4 w-4" />
              YAML → JSON
            </Button>
          </div>

          {/* 文件上传 */}
          <div className="flex items-center justify-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="file"
                accept=".json,.yaml,.yml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-1" />
                  上传文件
                </span>
              </Button>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadOutput}
              disabled={!output}
            >
              <Download className="h-4 w-4 mr-1" />
              下载结果
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAll}
              disabled={!input}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              清空
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 转换区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {direction === 'json-to-yaml' ? 'JSON 输入' : 'YAML 输入'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={direction === 'json-to-yaml' ? '在此输入 JSON 内容...' : '在此输入 YAML 内容...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-y"
            />
            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>字符数: {input.length.toLocaleString()}</span>
              <span>行数: {input.split('\n').length}</span>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span className="text-slate-600 dark:text-slate-400">
                {direction === 'json-to-yaml' ? 'YAML 输出' : 'JSON 输出'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOutput}
                disabled={!output}
              >
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? '已复制' : '复制'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="h-[400px] flex items-center justify-center bg-red-50 dark:bg-red-950/30 rounded-lg">
                <div className="text-center space-y-3">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                  <div className="text-red-600 dark:text-red-400 font-medium">转换失败</div>
                  <div className="text-sm text-red-500 dark:text-red-500 max-w-xs mx-auto">
                    {error}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder={direction === 'json-to-yaml' ? 'YAML 转换结果将显示在这里...' : 'JSON 转换结果将显示在这里...'}
                  value={output}
                  readOnly
                  className="min-h-[400px] font-mono text-sm resize-y bg-slate-50 dark:bg-slate-900"
                />
                <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>字符数: {output.length.toLocaleString()}</span>
                  <span>行数: {output.split('\n').length}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>• <strong>JSON → YAML</strong>：将 JSON 格式转换为 YAML 格式，支持缩进设置</p>
          <p>• <strong>YAML → JSON</strong>：将 YAML 格式转换为 JSON 格式，自动格式化</p>
          <p>• <strong>实时转换</strong>：输入时自动转换，无需手动点击</p>
          <p>• <strong>错误提示</strong>：格式错误时显示详细错误信息</p>
          <p>• <strong>文件操作</strong>：支持上传文件和下载转换结果</p>
          <p>• <strong>交换方向</strong>：点击中间的交换按钮可快速切换转换方向</p>
        </CardContent>
      </Card>
    </div>
  )
}
