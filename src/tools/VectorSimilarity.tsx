import { useState, useMemo } from 'react'
import { Calculator, Copy, Check, RotateCcw, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type SimilarityMethod = 'cosine' | 'euclidean' | 'dot' | 'manhattan'

interface VectorResult {
  method: SimilarityMethod
  name: string
  value: number
  description: string
  formula: string
}

const parseVector = (input: string): number[] | null => {
  try {
    const cleaned = input.trim()
    if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
      const parsed = JSON.parse(cleaned)
      if (Array.isArray(parsed) && parsed.every(n => typeof n === 'number')) {
        return parsed
      }
    }
    const parts = cleaned.split(/[\s,]+/).filter(Boolean)
    const numbers = parts.map(p => parseFloat(p))
    if (numbers.every(n => !isNaN(n))) {
      return numbers
    }
    return null
  } catch {
    return null
  }
}

const cosineSimilarity = (a: number[], b: number[]): number => {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB)
  return denominator === 0 ? 0 : dotProduct / denominator
}

const euclideanDistance = (a: number[], b: number[]): number => {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2)
  }
  return Math.sqrt(sum)
}

const dotProduct = (a: number[], b: number[]): number => {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i]
  }
  return sum
}

const manhattanDistance = (a: number[], b: number[]): number => {
  let sum = 0
  for (let i = 0; i < a.length; i++) {
    sum += Math.abs(a[i] - b[i])
  }
  return sum
}

export function VectorSimilarity() {
  const [vectorA, setVectorA] = useState('[0.1, 0.2, 0.3, 0.4]')
  const [vectorB, setVectorB] = useState('[0.2, 0.3, 0.4, 0.5]')
  const [copied, setCopied] = useState(false)

  const parsedA = useMemo(() => parseVector(vectorA), [vectorA])
  const parsedB = useMemo(() => parseVector(vectorB), [vectorB])

  const results = useMemo((): VectorResult[] | null => {
    if (!parsedA || !parsedB) return null
    if (parsedA.length !== parsedB.length) return null
    
    return [
      {
        method: 'cosine',
        name: '余弦相似度',
        value: cosineSimilarity(parsedA, parsedB),
        description: '衡量两个向量方向的相似性，范围 [-1, 1]，1 表示完全相同方向',
        formula: 'cos(θ) = (A·B) / (||A|| × ||B||)'
      },
      {
        method: 'euclidean',
        name: '欧氏距离',
        value: euclideanDistance(parsedA, parsedB),
        description: '两点之间的直线距离，值越小越相似',
        formula: 'd = √Σ(Ai - Bi)²'
      },
      {
        method: 'dot',
        name: '点积',
        value: dotProduct(parsedA, parsedB),
        description: '向量对应位置元素乘积之和，反映方向和长度的综合关系',
        formula: 'A·B = Σ(Ai × Bi)'
      },
      {
        method: 'manhattan',
        name: '曼哈顿距离',
        value: manhattanDistance(parsedA, parsedB),
        description: '各维度差值绝对值之和，适合高维稀疏数据',
        formula: 'd = Σ|Ai - Bi|'
      }
    ]
  }, [parsedA, parsedB])

  const error = useMemo(() => {
    if (!parsedA) return '向量 A 格式无效'
    if (!parsedB) return '向量 B 格式无效'
    if (parsedA.length !== parsedB.length) return `向量维度不匹配：A(${parsedA.length}) vs B(${parsedB.length})`
    return null
  }, [parsedA, parsedB])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetVectors = () => {
    setVectorA('[0.1, 0.2, 0.3, 0.4]')
    setVectorB('[0.2, 0.3, 0.4, 0.5]')
  }

  const getScoreColor = (method: SimilarityMethod, value: number): string => {
    if (method === 'cosine') {
      if (value >= 0.8) return 'text-green-500'
      if (value >= 0.5) return 'text-yellow-500'
      return 'text-red-500'
    }
    if (method === 'euclidean' || method === 'manhattan') {
      if (value <= 0.5) return 'text-green-500'
      if (value <= 1.0) return 'text-yellow-500'
      return 'text-red-500'
    }
    return 'text-sky-500'
  }

  const getScoreBar = (method: SimilarityMethod, value: number): number => {
    if (method === 'cosine') {
      return Math.max(0, Math.min(100, (value + 1) * 50))
    }
    if (method === 'euclidean' || method === 'manhattan') {
      return Math.max(0, Math.min(100, 100 - value * 20))
    }
    return Math.min(100, Math.abs(value) * 10)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">向量相似度计算</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          计算两个向量之间的相似度和距离，支持多种算法
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-500" />
              向量输入
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  向量 A
                </label>
                <textarea
                  value={vectorA}
                  onChange={(e) => setVectorA(e.target.value)}
                  placeholder="[1, 2, 3] 或 1, 2, 3 或 1 2 3"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm resize-none"
                />
                {parsedA && (
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    维度: {parsedA.length} | 范围: [{Math.min(...parsedA).toFixed(4)}, {Math.max(...parsedA).toFixed(4)}]
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  向量 B
                </label>
                <textarea
                  value={vectorB}
                  onChange={(e) => setVectorB(e.target.value)}
                  placeholder="[1, 2, 3] 或 1, 2, 3 或 1 2 3"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm resize-none"
                />
                {parsedB && (
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    维度: {parsedB.length} | 范围: [{Math.min(...parsedB).toFixed(4)}, {Math.max(...parsedB).toFixed(4)}]
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={resetVectors} variant="outline" className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-1" />
                  重置
                </Button>
                <Button
                  onClick={() => {
                    setVectorA('')
                    setVectorB('')
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  清空
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-sky-500" />
              算法说明
            </h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800">
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">余弦相似度</div>
                <div className="text-xs">范围 [-1, 1]，1 表示方向完全相同，-1 表示方向相反。适合文本相似度、推荐系统。</div>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800">
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">欧氏距离</div>
                <div className="text-xs">两点间直线距离，值越小越相似。适合图像处理、聚类分析。</div>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800">
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">点积</div>
                <div className="text-xs">反映方向和长度的综合关系。适合神经网络、注意力机制。</div>
              </div>
              <div className="p-3 rounded bg-slate-50 dark:bg-slate-800">
                <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">曼哈顿距离</div>
                <div className="text-xs">各维度差值绝对值之和。适合高维稀疏数据、网格路径。</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">计算结果</h2>
              {results && (
                <Button
                  onClick={() => copyToClipboard(JSON.stringify(results.map(r => ({
                    method: r.method,
                    name: r.name,
                    value: r.value
                  })), null, 2))}
                  size="sm"
                  variant="outline"
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              )}
            </div>

            {!results ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                请输入两个有效向量
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.method}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{result.name}</span>
                      <span className={`text-xl font-bold ${getScoreColor(result.method, result.value)}`}>
                        {result.value.toFixed(6)}
                      </span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-300"
                        style={{ width: `${getScoreBar(result.method, result.value)}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono">{result.formula}</span>
                    </div>
                    
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {result.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {parsedA && parsedB && !error && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">向量可视化</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    向量 A（前 10 维）
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {parsedA.slice(0, 10).map((v, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 rounded bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-mono"
                      >
                        {v.toFixed(3)}
                      </div>
                    ))}
                    {parsedA.length > 10 && (
                      <div className="px-2 py-1 text-slate-500 dark:text-slate-400 text-xs">
                        +{parsedA.length - 10} more
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    向量 B（前 10 维）
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {parsedB.slice(0, 10).map((v, i) => (
                      <div
                        key={i}
                        className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono"
                      >
                        {v.toFixed(3)}
                      </div>
                    ))}
                    {parsedB.length > 10 && (
                      <div className="px-2 py-1 text-slate-500 dark:text-slate-400 text-xs">
                        +{parsedB.length - 10} more
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">向量 A 模长：</span>
                      <span className="font-mono ml-1">
                        {Math.sqrt(parsedA.reduce((sum, v) => sum + v * v, 0)).toFixed(6)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">向量 B 模长：</span>
                      <span className="font-mono ml-1">
                        {Math.sqrt(parsedB.reduce((sum, v) => sum + v * v, 0)).toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
