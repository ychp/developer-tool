import { useState, useMemo } from 'react'
import { Scissors, Copy, Check, FileText, Hash, Split, AlignLeft, Sparkles, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getEncoding } from 'js-tiktoken'

type ChunkStrategy = 'tokens' | 'chars' | 'paragraphs' | 'sentences'

interface Chunk {
  id: string
  index: number
  content: string
  tokenCount: number
  charCount: number
}

interface ChunkConfig {
  strategy: ChunkStrategy
  maxTokens: number
  maxChars: number
  overlapTokens: number
  overlapChars: number
  separator: string
  preserveFormatting: boolean
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const strategyOptions = [
  { value: 'tokens' as const, label: '按 Token 数量', icon: Hash, description: '按指定 token 数量分块' },
  { value: 'chars' as const, label: '按字符数量', icon: Split, description: '按指定字符数量分块' },
  { value: 'paragraphs' as const, label: '按段落分割', icon: AlignLeft, description: '按段落/换行符分块' },
  { value: 'sentences' as const, label: '按句子分割', icon: FileText, description: '按句子标点分块' },
]

const sampleTexts = [
  {
    name: '技术文章',
    content: `人工智能（Artificial Intelligence，简称AI）是计算机科学的一个重要分支，它致力于研究、开发用于模拟、延伸和扩展人的智能的理论、方法、技术及应用系统。

机器学习是人工智能的一个子集，它使计算机能够从数据中学习并改进。常见的机器学习算法包括监督学习、无监督学习和强化学习。

深度学习是机器学习的一个分支，它使用多层神经网络来学习数据的表示。深度学习在图像识别、自然语言处理等领域取得了显著成果。

自然语言处理（NLP）是人工智能的另一个重要领域，它专注于计算机与人类语言之间的交互。包括文本分析、机器翻译、情感分析等任务。`
  },
  {
    name: '产品描述',
    content: `iPhone 15 Pro Max 采用航空级钛金属设计，是苹果有史以来最轻的 Pro 机型。搭载强大的 A17 Pro 芯片，带来极致性能体验。

全新 4800 万像素主摄系统，支持 5 倍光学变焦，让您轻松捕捉远距离细节。超视网膜 XDR 显示屏提供出色的视觉体验。

USB-C 接口设计，充电和数据传输更加便捷。钛金属边框与亚光质感玻璃背板完美融合，展现卓越工艺。`
  },
  {
    name: '新闻摘要',
    content: `今日，科技巨头发布了一款革命性的人工智能助手。该助手具备多模态理解能力，可以同时处理文本、图像和音频输入。

分析师认为，这款产品将彻底改变人机交互方式。预计在未来几年内，类似技术将广泛应用于教育、医疗、金融等多个领域。

业内专家表示，人工智能技术的快速发展，既带来了机遇，也提出了新的挑战。如何在推动技术创新的同时，确保数据隐私和算法公平性，成为亟待解决的问题。`
  }
]

export function RagTextChunker() {
  const [inputText, setInputText] = useState('')
  const [config, setConfig] = useState<ChunkConfig>({
    strategy: 'tokens',
    maxTokens: 500,
    maxChars: 1000,
    overlapTokens: 50,
    overlapChars: 100,
    separator: '\n\n',
    preserveFormatting: true
  })
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const encoding = getEncoding('cl100k_base')

  const countTokens = (text: string): number => {
    return encoding.encode(text).length
  }

  const splitBySentences = (text: string): string[] => {
    const sentenceRegex = /([。！？.!?]+)\s*/g
    const sentences: string[] = []
    let lastIndex = 0
    let match

    while ((match = sentenceRegex.exec(text)) !== null) {
      const sentence = text.slice(lastIndex, match.index + match[1].length).trim()
      if (sentence) {
        sentences.push(sentence)
      }
      lastIndex = match.index + match[1].length
    }

    const remaining = text.slice(lastIndex).trim()
    if (remaining) {
      sentences.push(remaining)
    }

    return sentences.filter(s => s.length > 0)
  }

  const splitByParagraphs = (text: string, separator: string): string[] => {
    return text.split(separator).map(p => p.trim()).filter(p => p.length > 0)
  }

  const createChunksWithOverlap = (
    items: string[],
    maxSize: number,
    overlapSize: number,
    countFn: (item: string) => number
  ): string[] => {
    const chunks: string[] = []
    let currentChunk = ''
    let currentSize = 0
    let startIndex = 0

    for (let i = startIndex; i < items.length; i++) {
      const itemSize = countFn(items[i])

      if (currentSize + itemSize > maxSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim())

        const overlapItems: string[] = []
        let currentOverlapSize = 0
        for (let j = i - 1; j >= startIndex && currentOverlapSize < overlapSize; j--) {
          overlapItems.unshift(items[j])
          currentOverlapSize += countFn(items[j])
        }

        currentChunk = overlapItems.join(config.strategy === 'paragraphs' ? config.separator : ' ')
        currentSize = overlapItems.reduce((sum, item) => sum + countFn(item), 0)
        startIndex = i - overlapItems.length
      }

      if (currentChunk.length > 0) {
        currentChunk += (config.strategy === 'paragraphs' ? config.separator : ' ')
      }
      currentChunk += items[i]
      currentSize += itemSize
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim())
    }

    return chunks
  }

  const createChunksByChars = (text: string, maxChars: number, overlapChars: number): string[] => {
    const chunks: string[] = []
    let start = 0

    while (start < text.length) {
      const end = Math.min(start + maxChars, text.length)
      const chunk = text.slice(start, end)
      chunks.push(chunk)

      if (end >= text.length) break

      start = end - overlapChars
    }

    return chunks
  }

  const chunks = useMemo((): Chunk[] => {
    if (!inputText.trim()) return []

    let rawChunks: string[] = []

    switch (config.strategy) {
      case 'tokens': {
        const tokens = encoding.encode(inputText)
        const chunkSize = config.maxTokens
        const overlap = config.overlapTokens

        const tokenChunks: number[][] = []
        let start = 0

        while (start < tokens.length) {
          const end = Math.min(start + chunkSize, tokens.length)
          tokenChunks.push(tokens.slice(start, end))

          if (end >= tokens.length) break
          start = end - overlap
        }

        rawChunks = tokenChunks.map(chunk => encoding.decode(chunk))
        break
      }

      case 'chars': {
        rawChunks = createChunksByChars(inputText, config.maxChars, config.overlapChars)
        break
      }

      case 'sentences': {
        const sentences = splitBySentences(inputText)
        rawChunks = createChunksWithOverlap(
          sentences,
          config.maxTokens,
          config.overlapTokens,
          countTokens
        )
        break
      }

      case 'paragraphs': {
        const paragraphs = splitByParagraphs(inputText, config.separator)
        rawChunks = createChunksWithOverlap(
          paragraphs,
          config.maxTokens,
          config.overlapTokens,
          countTokens
        )
        break
      }
    }

    return rawChunks.map((content, index) => ({
      id: generateId(),
      index: index + 1,
      content,
      tokenCount: countTokens(content),
      charCount: content.length
    }))
  }, [inputText, config])

  const copyChunk = (content: string, index: number) => {
    navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAllChunks = () => {
    const allChunks = chunks.map((chunk) => 
      `========== Chunk ${chunk.index} ==========\n${chunk.content}\n`
    ).join('\n')
    navigator.clipboard.writeText(allChunks)
  }

  const downloadChunks = () => {
    const allChunks = chunks.map((chunk) => 
      `========== Chunk ${chunk.index} ==========\n${chunk.content}\n`
    ).join('\n')

    const blob = new Blob([allChunks], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chunks.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const applySample = (content: string) => {
    setInputText(content)
  }

  const updateConfig = (key: keyof ChunkConfig, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const totalTokens = chunks.reduce((sum, chunk) => sum + chunk.tokenCount, 0)
  const avgTokens = chunks.length > 0 ? Math.round(totalTokens / chunks.length) : 0
  const maxChunkTokens = chunks.length > 0 ? Math.max(...chunks.map(c => c.tokenCount)) : 0

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RAG 文本分块器</h1>
        <p className="text-slate-600 dark:text-slate-400">
          智能分割文本为适合 RAG 应用的文本块
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-500" />
              输入文本
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                示例文本
              </label>
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((sample) => (
                  <button
                    key={sample.name}
                    onClick={() => applySample(sample.content)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="在此输入需要分块的文本内容..."
              rows={12}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
            />

            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>字符数：{inputText.length}</span>
              <span>Token 数：{countTokens(inputText)}</span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Scissors className="w-5 h-5 text-sky-500" />
                分块结果
                {chunks.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">
                    ({chunks.length} 个块)
                  </span>
                )}
              </h2>
              {chunks.length > 0 && (
                <div className="flex gap-2">
                  <Button onClick={downloadChunks} size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    下载
                  </Button>
                  <Button onClick={copyAllChunks} size="sm" variant="outline">
                    <Copy className="w-4 h-4 mr-1" />
                    复制全部
                  </Button>
                </div>
              )}
            </div>

            {chunks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">输入文本开始分块</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          块 #{chunk.index}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {chunk.tokenCount} tokens · {chunk.charCount} 字符
                        </span>
                      </div>
                      <Button
                        onClick={() => copyChunk(chunk.content, chunk.index)}
                        size="sm"
                        variant="ghost"
                      >
                        {copiedIndex === chunk.index ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            复制
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-words font-mono bg-white dark:bg-slate-950 p-2 rounded">
                      {chunk.content}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">分块策略</h2>
            
            <div className="space-y-3">
              {strategyOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => updateConfig('strategy', option.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      config.strategy === option.value
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
            <h2 className="text-lg font-semibold mb-4">分块参数</h2>

            <div className="space-y-4">
              {(config.strategy === 'tokens' || config.strategy === 'sentences' || config.strategy === 'paragraphs') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      最大 Token 数
                    </label>
                    <input
                      type="number"
                      value={config.maxTokens}
                      onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value) || 500)}
                      min={100}
                      max={8000}
                      step={50}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      重叠 Token 数
                    </label>
                    <input
                      type="number"
                      value={config.overlapTokens}
                      onChange={(e) => updateConfig('overlapTokens', parseInt(e.target.value) || 50)}
                      min={0}
                      max={1000}
                      step={10}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    />
                  </div>
                </>
              )}

              {config.strategy === 'chars' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      最大字符数
                    </label>
                    <input
                      type="number"
                      value={config.maxChars}
                      onChange={(e) => updateConfig('maxChars', parseInt(e.target.value) || 1000)}
                      min={100}
                      max={10000}
                      step={100}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      重叠字符数
                    </label>
                    <input
                      type="number"
                      value={config.overlapChars}
                      onChange={(e) => updateConfig('overlapChars', parseInt(e.target.value) || 100)}
                      min={0}
                      max={1000}
                      step={50}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                    />
                  </div>
                </>
              )}

              {config.strategy === 'paragraphs' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    段落分隔符
                  </label>
                  <select
                    value={config.separator}
                    onChange={(e) => updateConfig('separator', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  >
                    <option value="\n\n">双换行（\\n\\n）</option>
                    <option value="\n">单换行（\\n）</option>
                    <option value="。\n">句号+换行</option>
                  </select>
                </div>
              )}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={config.preserveFormatting}
                  onChange={(e) => updateConfig('preserveFormatting', e.target.checked)}
                  className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                />
                <span className="text-slate-600 dark:text-slate-400">保留原始格式</span>
              </label>
            </div>
          </Card>

          {chunks.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">统计信息</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">分块数量</span>
                  <span className="font-medium">{chunks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">总 Token 数</span>
                  <span className="font-medium">{totalTokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">平均 Token/块</span>
                  <span className="font-medium">{avgTokens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">最大 Token/块</span>
                  <span className="font-medium">{maxChunkTokens}</span>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用提示</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>建议：</strong>重叠可以保持上下文连贯性，但会增加总 Token 消耗。
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>按 Token 分块最精确</li>
                <li>按段落分块保持语义完整</li>
                <li>重叠建议 10%-20%</li>
                <li>适用于向量数据库存储</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
