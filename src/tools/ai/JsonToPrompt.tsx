import { useState, useMemo } from 'react'
import { Copy, Check, FileJson, FileText, AlertCircle, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type OutputFormat = 'markdown' | 'plain' | 'structured' | 'list'

interface ConversionOptions {
  format: OutputFormat
  includeContext: boolean
  contextText: string
  indent: number
  showTypes: boolean
}

export function JsonToPrompt() {
  const [jsonInput, setJsonInput] = useState(`{
  "name": "张三",
  "age": 28,
  "email": "zhangsan@example.com",
  "skills": ["JavaScript", "TypeScript", "React"],
  "experience": {
    "company": "ABC科技",
    "position": "前端工程师",
    "years": 3
  }
}`)
  const [copied, setCopied] = useState(false)
  const [options, setOptions] = useState<ConversionOptions>({
    format: 'markdown',
    includeContext: true,
    contextText: '请根据以下 JSON 数据回答问题：',
    indent: 2,
    showTypes: false
  })

  const formatValue = (value: unknown, indent: number, showTypes: boolean): string => {
    const spaces = ' '.repeat(indent)
    
    if (value === null) {
      return showTypes ? `null (null)` : 'null'
    }
    
    if (typeof value === 'string') {
      return showTypes ? `"${value}" (string)` : value
    }
    
    if (typeof value === 'number') {
      return showTypes ? `${value} (number)` : `${value}`
    }
    
    if (typeof value === 'boolean') {
      return showTypes ? `${value ? '是' : '否'} (boolean)` : (value ? '是' : '否')
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return '（空数组）'
      return value.map((item, index) => {
        const prefix = `${spaces}- `
        if (typeof item === 'object' && item !== null) {
          return `${prefix}第${index + 1}项:\n${formatObject(item as Record<string, unknown>, indent + 2, showTypes)}`
        }
        return `${prefix}${formatValue(item, 0, showTypes)}`
      }).join('\n')
    }
    
    if (typeof value === 'object') {
      return formatObject(value as Record<string, unknown>, indent, showTypes)
    }
    
    return String(value)
  }

  const formatObject = (obj: Record<string, unknown>, indent: number, showTypes: boolean): string => {
    const spaces = ' '.repeat(indent)
    return Object.entries(obj)
      .map(([key, value]) => {
        const formattedValue = formatValue(value, indent + 2, showTypes)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${spaces}- ${key}:\n${formattedValue}`
        }
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
          return `${spaces}- ${key}:\n${formattedValue}`
        }
        return `${spaces}- ${key}: ${formattedValue}`
      })
      .join('\n')
  }

  const convertToMarkdown = (data: Record<string, unknown>, opts: ConversionOptions): string => {
    let result = ''
    
    if (opts.includeContext && opts.contextText) {
      result += `${opts.contextText}\n\n`
    }
    
    result += '```json\n'
    result += JSON.stringify(data, null, opts.indent)
    result += '\n```\n\n'
    
    result += '**数据内容：**\n\n'
    result += formatObject(data, 0, opts.showTypes)
    
    return result
  }

  const convertToPlain = (data: Record<string, unknown>, opts: ConversionOptions): string => {
    let result = ''
    
    if (opts.includeContext && opts.contextText) {
      result += `${opts.contextText}\n\n`
    }
    
    result += formatObject(data, 0, opts.showTypes)
    
    return result
  }

  const convertToStructured = (data: Record<string, unknown>, opts: ConversionOptions): string => {
    let result = ''
    
    if (opts.includeContext && opts.contextText) {
      result += `${opts.contextText}\n\n`
    }
    
    result += '【数据结构】\n\n'
    
    const formatStructure = (obj: Record<string, unknown>, prefix: string): string => {
      return Object.entries(obj)
        .map(([key, value]) => {
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return `${prefix}📁 ${key}\n${formatStructure(value as Record<string, unknown>, prefix + '  ')}`
          }
          if (Array.isArray(value)) {
            return `${prefix}📋 ${key}: [${value.length}项]`
          }
          const type = typeof value
          const icon = type === 'string' ? '📝' : type === 'number' ? '🔢' : type === 'boolean' ? '✅' : '❓'
          return `${prefix}${icon} ${key}: ${formatValue(value, 0, false)}`
        })
        .join('\n')
    }
    
    result += formatStructure(data, '')
    result += '\n\n【详细数据】\n\n'
    result += formatObject(data, 0, opts.showTypes)
    
    return result
  }

  const convertToList = (data: Record<string, unknown>, opts: ConversionOptions): string => {
    let result = ''
    
    if (opts.includeContext && opts.contextText) {
      result += `${opts.contextText}\n\n`
    }
    
    const flattenObject = (obj: Record<string, unknown>, prefix: string = ''): string[] => {
      const lines: string[] = []
      
      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          lines.push(...flattenObject(value as Record<string, unknown>, fullKey))
        } else if (Array.isArray(value)) {
          lines.push(`${fullKey}: [${value.map(v => 
            typeof v === 'object' ? JSON.stringify(v) : String(v)
          ).join(', ')}]`)
        } else {
          lines.push(`${fullKey}: ${formatValue(value, 0, false)}`)
        }
      })
      
      return lines
    }
    
    result += flattenObject(data).join('\n')
    
    return result
  }

  const { output, error } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { output: '', error: '' }
    }
    
    try {
      const data = JSON.parse(jsonInput)
      
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        return { output: '', error: '请输入一个有效的 JSON 对象' }
      }
      
      let result = ''
      switch (options.format) {
        case 'markdown':
          result = convertToMarkdown(data, options)
          break
        case 'plain':
          result = convertToPlain(data, options)
          break
        case 'structured':
          result = convertToStructured(data, options)
          break
        case 'list':
          result = convertToList(data, options)
          break
      }
      
      return { output: result, error: '' }
    } catch {
      return { output: '', error: 'JSON 格式错误，请检查输入' }
    }
  }, [jsonInput, options])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatLabels: Record<OutputFormat, { name: string; desc: string }> = {
    markdown: { name: 'Markdown', desc: '带代码块和格式化' },
    plain: { name: '纯文本', desc: '简洁的文本格式' },
    structured: { name: '结构化', desc: '带图标和层级' },
    list: { name: '扁平列表', desc: '点分隔的键值对' }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">JSON → Prompt 转换</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          将 JSON 数据转换为结构化 Prompt，方便与 AI 对话
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-sky-500" />
              JSON 输入
            </h2>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="粘贴 JSON 数据..."
              rows={12}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm resize-none"
            />
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => setJsonInput('')}
                variant="outline"
                className="flex-1"
              >
                清空
              </Button>
              <Button
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonInput)
                    setJsonInput(JSON.stringify(parsed, null, 2))
                  } catch {
                    // 格式化失败时忽略
                  }
                }}
                variant="outline"
                className="flex-1"
              >
                格式化
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-sky-500" />
              转换选项
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  输出格式
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(formatLabels) as OutputFormat[]).map((format) => (
                    <button
                      key={format}
                      onClick={() => setOptions(prev => ({ ...prev, format }))}
                      className={`px-3 py-2 rounded-lg border text-left transition-colors ${
                        options.format === format
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="font-medium text-sm">{formatLabels[format].name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{formatLabels[format].desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={options.includeContext}
                    onChange={(e) => setOptions(prev => ({ ...prev, includeContext: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">添加上下文说明</span>
                </label>
              </div>

              {options.includeContext && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    上下文文本
                  </label>
                  <input
                    type="text"
                    value={options.contextText}
                    onChange={(e) => setOptions(prev => ({ ...prev, contextText: e.target.value }))}
                    placeholder="请根据以下 JSON 数据回答问题："
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={options.showTypes}
                    onChange={(e) => setOptions(prev => ({ ...prev, showTypes: e.target.checked }))}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">显示数据类型</span>
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                Prompt 输出
              </h2>
              <Button
                onClick={() => copyToClipboard(output)}
                size="sm"
                variant="outline"
                disabled={!output || !!error}
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? '已复制' : '复制'}
              </Button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="转换结果将显示在这里..."
              rows={20}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none text-sm resize-none"
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用说明</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>将 JSON 数据转换为结构化 Prompt，方便与 AI 模型对话！
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">输出格式说明</h3>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li><strong>Markdown</strong>：带代码块，适合技术文档</li>
                  <li><strong>纯文本</strong>：简洁格式，适合直接对话</li>
                  <li><strong>结构化</strong>：带图标和层级，清晰易读</li>
                  <li><strong>扁平列表</strong>：点分隔键值对，适合数据提取</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">使用场景</h3>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>将 API 响应数据转为 Prompt</li>
                  <li>将配置文件转为可读文本</li>
                  <li>将数据库记录转为对话内容</li>
                  <li>将复杂 JSON 转为 AI 可理解的格式</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
