import { useState, useMemo } from 'react'
import { FileSearch, Trash2, Upload, Download, BarChart3 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/tool/CopyButton'

type ExtractMode = 'regex' | 'fixed' | 'range'

interface ExtractResult {
  extracted: string[]
  afterDelete: string[]
  stats: {
    totalMatches: number
    totalChars: number
    afterDeleteChars: number
    deletedChars: number
  }
}

export function TextExtractor() {
  const [inputText, setInputText] = useState('')
  const [extractMode, setExtractMode] = useState<ExtractMode>('regex')
  const [extractPattern, setExtractPattern] = useState('')
  const [deletePattern, setDeletePattern] = useState('')
  const [deleteMode, setDeleteMode] = useState<'fixed' | 'regex'>('fixed')
  const [rangeStart, setRangeStart] = useState(1)
  const [rangeEnd, setRangeEnd] = useState(10)
  const [rangeType, setRangeType] = useState<'line' | 'char'>('line')
  const [result, setResult] = useState<ExtractResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [separator, setSeparator] = useState('\n')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const allTexts: string[] = []
    let processed = 0

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        allTexts.push(`=== ${file.name} ===\n${content}`)
        processed++
        if (processed === files.length) {
          setInputText(allTexts.join('\n\n'))
        }
      }
      reader.readAsText(file)
    })
  }

  const performExtraction = useMemo(() => {
    return (): ExtractResult | null => {
      if (!inputText.trim()) return null

      let extracted: string[] = []

      try {
        switch (extractMode) {
          case 'regex': {
            if (!extractPattern.trim()) return null
            const regex = new RegExp(extractPattern, 'g')
            const matches = inputText.match(regex) || []
            extracted = matches
            break
          }
          case 'fixed': {
            if (!extractPattern.trim()) return null
            const parts = inputText.split(extractPattern)
            extracted = parts.filter(p => p !== '')
            break
          }
          case 'range': {
            if (rangeType === 'line') {
              const lines = inputText.split('\n')
              const start = Math.max(0, rangeStart - 1)
              const end = Math.min(lines.length, rangeEnd)
              extracted = lines.slice(start, end)
            } else {
              const start = Math.max(0, rangeStart - 1)
              const end = Math.min(inputText.length, rangeEnd)
              extracted = [inputText.slice(start, end)]
            }
            break
          }
        }

        const afterDelete = extracted.map((item) => {
          if (!deletePattern.trim()) return item
          if (deleteMode === 'fixed') {
            return item.split(deletePattern).join('')
          } else {
            try {
              const regex = new RegExp(deletePattern, 'g')
              return item.replace(regex, '')
            } catch {
              return item
            }
          }
        })

        const totalChars = extracted.reduce((sum, s) => sum + s.length, 0)
        const afterDeleteChars = afterDelete.reduce((sum, s) => sum + s.length, 0)

        return {
          extracted,
          afterDelete,
          stats: {
            totalMatches: extracted.length,
            totalChars,
            afterDeleteChars,
            deletedChars: totalChars - afterDeleteChars,
          },
        }
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : '提取失败')
      }
    }
  }, [inputText, extractMode, extractPattern, deletePattern, deleteMode, rangeStart, rangeEnd, rangeType])

  const handleExtract = () => {
    setError(null)
    try {
      const res = performExtraction()
      if (!res) {
        setError('请输入文本和提取规则')
        return
      }
      setResult(res)
    } catch (e) {
      setError(e instanceof Error ? e.message : '提取失败')
    }
  }

  const handleClear = () => {
    setInputText('')
    setResult(null)
    setError(null)
    setExtractPattern('')
    setDeletePattern('')
  }

  const handleExport = () => {
    if (!result) return
    const content = result.afterDelete.join(separator)
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted-result.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">文本提取器</h1>
        <p className="text-slate-600 dark:text-slate-400">
          从文本中提取特定内容，并删除不需要的字符
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">输入文本</h2>
            <div className="flex gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".txt,.md,.json,.csv,.log,.xml,.html,.css,.js,.ts"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" size="sm" asChild>
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    上传文件
                  </span>
                </Button>
              </label>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-48 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm resize-none"
            placeholder="粘贴文本或上传文件..."
          />
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            字符数: {inputText.length} | 行数: {inputText.split('\n').length}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">提取规则</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">提取模式</label>
              <div className="flex gap-2">
                {[
                  { value: 'regex', label: '正则表达式' },
                  { value: 'fixed', label: '固定字符串' },
                  { value: 'range', label: '范围提取' },
                ].map((mode) => (
                  <Button
                    key={mode.value}
                    variant={extractMode === mode.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setExtractMode(mode.value as ExtractMode)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
            </div>

            {extractMode === 'regex' && (
              <div>
                <label className="block text-sm font-medium mb-2">正则表达式</label>
                <input
                  type="text"
                  value={extractPattern}
                  onChange={(e) => setExtractPattern(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                  placeholder="例如: \d+ 匹配数字"
                />
              </div>
            )}

            {extractMode === 'fixed' && (
              <div>
                <label className="block text-sm font-medium mb-2">分隔字符串</label>
                <input
                  type="text"
                  value={extractPattern}
                  onChange={(e) => setExtractPattern(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                  placeholder="输入分隔符，如逗号、空格等"
                />
              </div>
            )}

            {extractMode === 'range' && (
              <div>
                <label className="block text-sm font-medium mb-2">范围设置</label>
                <div className="flex gap-2 items-center">
                  <select
                    value={rangeType}
                    onChange={(e) => setRangeType(e.target.value as 'line' | 'char')}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  >
                    <option value="line">按行</option>
                    <option value="char">按字符</option>
                  </select>
                  <span className="text-sm text-slate-500">从</span>
                  <input
                    type="number"
                    min={1}
                    value={rangeStart}
                    onChange={(e) => setRangeStart(parseInt(e.target.value) || 1)}
                    className="w-20 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                  <span className="text-sm text-slate-500">到</span>
                  <input
                    type="number"
                    min={rangeStart}
                    value={rangeEnd}
                    onChange={(e) => setRangeEnd(parseInt(e.target.value) || rangeStart)}
                    className="w-20 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  />
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <label className="block text-sm font-medium mb-2">删除字符（从提取结果中）</label>
              <div className="flex gap-2 mb-2">
                <Button
                  variant={deleteMode === 'fixed' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDeleteMode('fixed')}
                >
                  固定字符
                </Button>
                <Button
                  variant={deleteMode === 'regex' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDeleteMode('regex')}
                >
                  正则表达式
                </Button>
              </div>
              <input
                type="text"
                value={deletePattern}
                onChange={(e) => setDeletePattern(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                placeholder={deleteMode === 'regex' ? '例如: [0-9] 删除所有数字' : '输入要删除的字符'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">结果分隔符</label>
              <select
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
              >
                <option value="\n">换行符</option>
                <option value=",">逗号</option>
                <option value=" ">空格</option>
                <option value="|">竖线</option>
                <option value=";">分号</option>
              </select>
            </div>

            <Button onClick={handleExtract} className="w-full">
              <FileSearch className="h-4 w-4 mr-2" />
              开始提取
            </Button>
          </div>
        </Card>
      </div>

      {error && (
        <div className="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                统计信息
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20">
                <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                  {result.stats.totalMatches}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">匹配数量</div>
              </div>
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {result.stats.totalChars}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">提取字符数</div>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {result.stats.deletedChars}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">删除字符数</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {result.stats.afterDeleteChars}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">最终字符数</div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">提取结果（原始）</h2>
                <CopyButton text={result.extracted.join(separator === '\\n' ? '\n' : separator)} />
              </div>
              <div className="max-h-64 overflow-y-auto p-3 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm whitespace-pre-wrap">
                {result.extracted.length > 0 ? (
                  result.extracted.map((item, index) => (
                    <div key={index} className="py-1 border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <span className="text-slate-400 dark:text-slate-500 mr-2">{index + 1}.</span>
                      {item || <span className="text-slate-400 italic">(空)</span>}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400">无匹配结果</span>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">最终结果（删除后）</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-1" />
                    导出
                  </Button>
                  <CopyButton text={result.afterDelete.join(separator === '\\n' ? '\n' : separator)} />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 font-mono text-sm whitespace-pre-wrap">
                {result.afterDelete.length > 0 ? (
                  result.afterDelete.map((item, index) => (
                    <div key={index} className="py-1 border-b border-emerald-200 dark:border-emerald-800 last:border-0">
                      <span className="text-emerald-400 dark:text-emerald-500 mr-2">{index + 1}.</span>
                      {item || <span className="text-slate-400 italic">(空)</span>}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400">无结果</span>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
