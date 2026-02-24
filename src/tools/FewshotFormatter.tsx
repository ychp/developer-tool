import { useState, useMemo } from 'react'
import { Copy, Check, Plus, Trash2, Download, Sparkles, Layers, FileText, Braces, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type OutputFormat = 'json' | 'markdown' | 'markdown-code' | 'plain'

interface Example {
  id: string
  input: string
  output: string
  description?: string
}

const formatOptions = [
  { value: 'json' as const, label: 'JSON 格式', icon: Braces, description: '标准 JSON 数组格式' },
  { value: 'markdown' as const, label: 'Markdown 列表', icon: FileText, description: 'Markdown 列表格式' },
  { value: 'markdown-code' as const, label: 'Markdown 代码块', icon: Layers, description: 'Markdown 代码块格式' },
  { value: 'plain' as const, label: '纯文本', icon: MessageSquare, description: '简单文本格式' },
]

const generateId = () => Math.random().toString(36).substr(2, 9)

const sampleExamples: Example[] = [
  {
    id: '1',
    input: '苹果是什么颜色？',
    output: '苹果通常是红色、绿色或黄色的。',
    description: '基础示例'
  },
  {
    id: '2',
    input: '香蕉是什么味道？',
    output: '香蕉是甜的，口感软糯。',
    description: '简单描述'
  }
]

export function FewshotFormatter() {
  const [examples, setExamples] = useState<Example[]>([
    { id: generateId(), input: '', output: '', description: '' }
  ])
  const [format, setFormat] = useState<OutputFormat>('json')
  const [copied, setCopied] = useState(false)
  const [task, setTask] = useState('')
  const [instruction, setInstruction] = useState('')

  const addExample = () => {
    setExamples(prev => [...prev, { id: generateId(), input: '', output: '', description: '' }])
  }

  const removeExample = (id: string) => {
    if (examples.length <= 1) return
    setExamples(prev => prev.filter(e => e.id !== id))
  }

  const updateExample = (id: string, field: keyof Example, value: string) => {
    setExamples(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const loadSample = () => {
    setExamples(sampleExamples)
    setTask('水果知识问答')
    setInstruction('请根据以下示例回答问题：')
  }

  const clearAll = () => {
    setExamples([{ id: generateId(), input: '', output: '', description: '' }])
    setTask('')
    setInstruction('')
  }

  const formattedOutput = useMemo(() => {
    const validExamples = examples.filter(e => e.input.trim() || e.output.trim())

    if (format === 'json') {
      return JSON.stringify({
        task: task || undefined,
        instruction: instruction || undefined,
        examples: validExamples.map(({ id, description, ...rest }) => ({
          ...rest,
          ...(description && { description })
        }))
      }, null, 2)
    }

    if (format === 'markdown') {
      let output = ''
      if (task) output += `## ${task}\n\n`
      if (instruction) output += `${instruction}\n\n`

      output += '### 示例\n\n'

      validExamples.forEach((example, index) => {
        output += `#### 示例 ${index + 1}\n`
        if (example.description) output += `*${example.description}*\n\n`
        output += `**输入：**\n${example.input}\n\n`
        output += `**输出：**\n${example.output}\n\n`
      })

      return output.trim()
    }

    if (format === 'markdown-code') {
      let output = ''
      if (task) output += `# ${task}\n\n`
      if (instruction) output += `${instruction}\n\n`

      output += '## Few-shot Examples\n\n'

      validExamples.forEach((example, index) => {
        output += `### Example ${index + 1}\n`
        if (example.description) output += `<!-- ${example.description} -->\n`
        output += `Input:\n${example.input}\n\n`
        output += `Output:\n${example.output}\n\n`
      })

      return output.trim()
    }

    if (format === 'plain') {
      let output = ''
      if (task) output += `任务：${task}\n\n`
      if (instruction) output += `${instruction}\n\n`

      output += '示例：\n\n'

      validExamples.forEach((example, index) => {
        output += `${index + 1}. 输入：${example.input}\n`
        output += `   输出：${example.output}\n`
        if (example.description) output += `   (${example.description})\n`
        output += '\n'
      })

      return output.trim()
    }

    return ''
  }, [examples, format, task, instruction])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadOutput = () => {
    const extensions = {
      json: 'json',
      markdown: 'md',
      'markdown-code': 'md',
      plain: 'txt'
    }

    const blob = new Blob([formattedOutput], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fewshot-examples.${extensions[format]}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const validCount = examples.filter(e => e.input.trim() && e.output.trim()).length

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Few-shot 格式化</h1>
        <p className="text-slate-600 dark:text-slate-400">
          创建和管理 AI Few-shot 学习示例
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">任务配置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  任务名称
                </label>
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="如：情感分类、文本摘要、问答系统"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  指令说明
                </label>
                <textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="给 AI 的指令，如：请根据以下示例判断文本的情感倾向"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">示例列表</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {validCount} / {examples.length} 个有效示例
                </span>
                <Button onClick={addExample} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  添加示例
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={example.id}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      示例 #{index + 1}
                    </span>
                    {examples.length > 1 && (
                      <Button
                        onClick={() => removeExample(example.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={example.description}
                        onChange={(e) => updateExample(example.id, 'description', e.target.value)}
                        placeholder="描述（可选）"
                        className="w-full px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        输入 (Input)
                      </label>
                      <textarea
                        value={example.input}
                        onChange={(e) => updateExample(example.id, 'input', e.target.value)}
                        placeholder="示例输入..."
                        rows={2}
                        className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        输出 (Output)
                      </label>
                      <textarea
                        value={example.output}
                        onChange={(e) => updateExample(example.id, 'output', e.target.value)}
                        placeholder="示例输出..."
                        rows={2}
                        className="w-full px-3 py-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <Button onClick={loadSample} size="sm" variant="outline">
                加载示例
              </Button>
              <Button onClick={clearAll} size="sm" variant="outline">
                清空全部
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">输出格式</h2>
            <div className="space-y-2">
              {formatOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => setFormat(option.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      format === option.value
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-sky-500" />
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">
                      {option.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" />
                格式化结果
              </h2>
            </div>

            <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono max-h-80 overflow-y-auto mb-3">
              {formattedOutput || (
                <div className="text-center py-8 text-slate-500">
                  添加示例后查看结果
                </div>
              )}
            </pre>

            <div className="flex gap-2">
              <Button
                onClick={copyToClipboard}
                size="sm"
                variant="outline"
                className="flex-1"
                disabled={!formattedOutput}
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? '已复制' : '复制'}
              </Button>
              <Button
                onClick={downloadOutput}
                size="sm"
                variant="outline"
                disabled={!formattedOutput}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">统计信息</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">总示例数</span>
                <span className="font-medium">{examples.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">有效示例</span>
                <span className="font-medium">{validCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">总字符数</span>
                <span className="font-medium">{formattedOutput.length}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用提示</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>建议：</strong>提供 3-10 个高质量示例效果最佳！
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>示例应覆盖典型场景</li>
                <li>输入输出要清晰对应</li>
                <li>描述可帮助理解示例</li>
                <li>JSON 格式适合程序调用</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
