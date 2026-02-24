import { useState, useMemo } from 'react'
import { FileText, Copy, Check, Wand2, Sparkles, Code, List, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type OutputFormat = 'plain' | 'structured' | 'clean' | 'code-block'

interface ConversionOptions {
  preserveHeadings: boolean
  preserveLists: boolean
  preserveCodeBlocks: boolean
  preserveLinks: boolean
  removeEmptyLines: boolean
  outputFormat: OutputFormat
}

const sampleMarkdown = `# API 使用指南

## 简介
这是一个强大的 API 工具，可以帮助您快速完成开发任务。

## 主要功能

- 数据处理
- 文件转换
- 批量操作

## 代码示例

\`\`\`javascript
const data = await fetchData()
console.log(data)
\`\`\`

## 注意事项

1. 请确保 API 密钥安全
2. 不要频繁调用接口
3. 参考官方文档

[查看文档](https://example.com)
`

const outputFormats = [
  { value: 'plain' as const, label: '纯文本', icon: Type, description: '转换为纯文本，移除所有格式' },
  { value: 'structured' as const, label: '结构化', icon: List, description: '保留层级结构，便于理解' },
  { value: 'clean' as const, label: '清理格式', icon: Wand2, description: '保留语义但简化格式' },
  { value: 'code-block' as const, label: '代码块', icon: Code, description: '包裹在代码块中，适合 AI' },
]

export function MarkdownToPrompt() {
  const [input, setInput] = useState(sampleMarkdown)
  const [options, setOptions] = useState<ConversionOptions>({
    preserveHeadings: true,
    preserveLists: true,
    preserveCodeBlocks: true,
    preserveLinks: false,
    removeEmptyLines: true,
    outputFormat: 'structured'
  })
  const [copied, setCopied] = useState(false)

  const convertMarkdown = (markdown: string, opts: ConversionOptions): string => {
    let result = markdown

    if (opts.outputFormat === 'plain') {
      result = result
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/`{1,3}[^`]*`{1,3}/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\s*[-*+]\s+/gm, '• ')
        .replace(/^\s*\d+\.\s+/gm, '')
        .replace(/\n{3,}/g, '\n\n')
    } else if (opts.outputFormat === 'structured') {
      result = result
        .replace(/^#{6}\s+(.+)$/gm, '###### $1')
        .replace(/^#{5}\s+(.+)$/gm, '##### $1')
        .replace(/^#{4}\s+(.+)$/gm, '#### $1')
        .replace(/^#{3}\s+(.+)$/gm, '### $1')
        .replace(/^#{2}\s+(.+)$/gm, '## $1')
        .replace(/^#{1}\s+(.+)$/gm, '# $1')
        .replace(/`{3}(\w+)?\n([\s\S]+?)\n`{3}/g, (_match, _lang, code) => {
          if (!opts.preserveCodeBlocks) return code.trim()
          return `【代码块】\n${code.trim()}\n【代码块结束】`
        })
        .replace(/`([^`]+)`/g, '「$1」')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, opts.preserveLinks ? '$1（链接）' : '$1')
    } else if (opts.outputFormat === 'clean') {
      result = result
        .replace(/^#{1,6}\s+(.+)$/gm, (_match, title) => {
          return opts.preserveHeadings ? `▸ ${title}\n` : `${title}\n`
        })
        .replace(/^\s*[-*+]\s+/gm, opts.preserveLists ? '○ ' : '')
        .replace(/^\s*\d+\.\s+/gm, opts.preserveLists ? '' : '')
        .replace(/`{3}(\w+)?\n([\s\S]+?)\n`{3}/g, (_match, _lang, code) => {
          if (!opts.preserveCodeBlocks) return code.trim()
          return `「代码：${code.trim()}」`
        })
        .replace(/`([^`]+)`/g, '「$1」')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, opts.preserveLinks ? '$1' : '$1')
        .replace(/\n{3,}/g, '\n\n')
    } else if (opts.outputFormat === 'code-block') {
      let content = result
      content = content
        .replace(/^#{1,6}\s+/gm, opts.preserveHeadings ? '# ' : '')
        .replace(/`{3}(\w+)?/g, opts.preserveCodeBlocks ? '```' : '')
        .replace(/`([^`]+)`/g, opts.preserveCodeBlocks ? '`$1`' : '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, opts.preserveLinks ? '$1 (链接)' : '$1')
        .replace(/^\s*[-*+]\s+/gm, opts.preserveLists ? '- ' : '')
      result = '```\n' + content + '\n```'
    }

    if (opts.removeEmptyLines) {
      result = result.replace(/\n{3,}/g, '\n\n')
    }

    return result.trim()
  }

  const output = useMemo(() => {
    if (!input.trim()) return ''
    return convertMarkdown(input, options)
  }, [input, options])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateOption = <K extends keyof ConversionOptions>(key: K, value: ConversionOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'for-ai':
        setOptions({
          preserveHeadings: true,
          preserveLists: true,
          preserveCodeBlocks: true,
          preserveLinks: false,
          removeEmptyLines: true,
          outputFormat: 'structured'
        })
        break
      case 'clean-text':
        setOptions({
          preserveHeadings: false,
          preserveLists: false,
          preserveCodeBlocks: false,
          preserveLinks: false,
          removeEmptyLines: true,
          outputFormat: 'plain'
        })
        break
      case 'keep-format':
        setOptions({
          preserveHeadings: true,
          preserveLists: true,
          preserveCodeBlocks: true,
          preserveLinks: true,
          removeEmptyLines: false,
          outputFormat: 'clean'
        })
        break
    }
  }

  const stats = useMemo(() => {
    const inputTokens = input.length
    const outputTokens = output.length
    const reduction = inputTokens > 0 ? Math.round((1 - outputTokens / inputTokens) * 100) : 0
    return { inputTokens, outputTokens, reduction }
  }, [input, output])

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Markdown → Prompt 转换</h1>
        <p className="text-slate-600 dark:text-slate-400">
          将 Markdown 文档转换为适合 AI 理解的 Prompt 格式
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-500" />
              输入 Markdown
            </h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此粘贴 Markdown 内容..."
              rows={16}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-mono resize-none"
            />
            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>字符数：{input.length}</span>
              <button
                onClick={() => setInput('')}
                className="text-red-500 hover:text-red-600"
              >
                清空
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-sky-500" />
                转换结果
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  disabled={!output}
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
            </div>

            {!output ? (
              <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">输入 Markdown 开始转换</p>
              </div>
            ) : (
              <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto font-mono max-h-96 overflow-y-auto whitespace-pre-wrap">
                {output}
              </pre>
            )}

            {output && (
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>字符数：{output.length}</span>
                {stats.reduction > 0 && (
                  <span className="text-green-600 dark:text-green-400">
                    减少 {stats.reduction}%
                  </span>
                )}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">快捷预设</h2>
            <div className="space-y-2">
              <button
                onClick={() => applyPreset('for-ai')}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">AI 优化</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  保留结构，移除链接
                </div>
              </button>
              <button
                onClick={() => applyPreset('clean-text')}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">纯文本</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  移除所有格式
                </div>
              </button>
              <button
                onClick={() => applyPreset('keep-format')}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="font-medium text-slate-900 dark:text-slate-100">保留格式</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  保留链接和格式
                </div>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">输出格式</h2>
            <div className="space-y-2">
              {outputFormats.map((format) => {
                const Icon = format.icon
                return (
                  <button
                    key={format.value}
                    onClick={() => updateOption('outputFormat', format.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      options.outputFormat === format.value
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-sky-500" />
                      <span className="text-sm font-medium">{format.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 ml-6">
                      {format.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">转换选项</h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">保留标题</span>
                <input
                  type="checkbox"
                  checked={options.preserveHeadings}
                  onChange={(e) => updateOption('preserveHeadings', e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">保留列表</span>
                <input
                  type="checkbox"
                  checked={options.preserveLists}
                  onChange={(e) => updateOption('preserveLists', e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">保留代码块</span>
                <input
                  type="checkbox"
                  checked={options.preserveCodeBlocks}
                  onChange={(e) => updateOption('preserveCodeBlocks', e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">保留链接</span>
                <input
                  type="checkbox"
                  checked={options.preserveLinks}
                  onChange={(e) => updateOption('preserveLinks', e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">移除空行</span>
                <input
                  type="checkbox"
                  checked={options.removeEmptyLines}
                  onChange={(e) => updateOption('removeEmptyLines', e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
              </label>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用提示</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>使用"结构化"格式最适合 AI 理解文档内容！
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>代码块格式适合直接发给 AI</li>
                <li>保留标题能帮助 AI 理解层级</li>
                <li>移除链接可减少无关信息</li>
                <li>纯文本适合摘要任务</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
