import { useState, useMemo } from 'react'
import { Image, Calculator, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ModelPricing {
  name: string
  calculate: (width: number, height: number) => number
  description: string
}

const calculateGPT4V = (width: number, height: number): number => {
  const maxSize = 2048
  const tileSize = 512
  const baseTokens = 65
  const tileTokens = 85

  let scaledWidth = width
  let scaledHeight = height

  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height)
    scaledWidth = Math.floor(width * ratio)
    scaledHeight = Math.floor(height * ratio)
  }

  const tilesX = Math.ceil(scaledWidth / tileSize)
  const tilesY = Math.ceil(scaledHeight / tileSize)
  const totalTiles = tilesX * tilesY

  return baseTokens + totalTiles * tileTokens
}

const calculateClaude3 = (width: number, height: number): number => {
  const baseTokens = 85
  const tileSize = 512
  const tileTokens = 85

  const tilesX = Math.ceil(width / tileSize)
  const tilesY = Math.ceil(height / tileSize)
  const totalTiles = tilesX * tilesY

  if (totalTiles === 1) {
    return baseTokens
  }

  return baseTokens + (totalTiles - 1) * tileTokens
}

const calculateGPT4oHD = (width: number, height: number): number => {
  const baseTokens = 65
  const tileSize = 768
  const tileTokens = 170

  let scaledWidth = width
  let scaledHeight = height

  const maxDimension = Math.max(width, height)
  if (maxDimension > 2048) {
    const scale = 2048 / maxDimension
    scaledWidth = Math.floor(width * scale)
    scaledHeight = Math.floor(height * scale)
  }

  const minDimension = Math.min(scaledWidth, scaledHeight)
  if (minDimension > 768) {
    const scale = 768 / minDimension
    scaledWidth = Math.floor(scaledWidth * scale)
    scaledHeight = Math.floor(scaledHeight * scale)
  }

  const tilesX = Math.ceil(scaledWidth / tileSize)
  const tilesY = Math.ceil(scaledHeight / tileSize)
  const totalTiles = tilesX * tilesY

  return baseTokens + totalTiles * tileTokens
}

const commonSizes = [
  { name: '512x512', width: 512, height: 512 },
  { name: '1024x1024', width: 1024, height: 1024 },
  { name: '1920x1080', width: 1920, height: 1080, label: '1080p' },
  { name: '2560x1440', width: 2560, height: 1440, label: '1440p' },
  { name: '3840x2160', width: 3840, height: 2160, label: '4K' },
  { name: '7680x4320', width: 7680, height: 4320, label: '8K' },
]

const modelPricing: ModelPricing[] = [
  {
    name: 'GPT-4V',
    calculate: calculateGPT4V,
    description: 'OpenAI GPT-4 Vision 模型'
  },
  {
    name: 'GPT-4o HD',
    calculate: calculateGPT4oHD,
    description: 'OpenAI GPT-4o HD 模型（高分辨率）'
  },
  {
    name: 'Claude 3',
    calculate: calculateClaude3,
    description: 'Anthropic Claude 3 系列模型'
  },
]

export function ImageSizeCalculator() {
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [copied, setCopied] = useState(false)

  const widthNum = parseInt(width) || 0
  const heightNum = parseInt(height) || 0

  const results = useMemo(() => {
    if (!widthNum || !heightNum) {
      return []
    }

    return modelPricing.map(model => ({
      ...model,
      tokens: model.calculate(widthNum, heightNum)
    }))
  }, [widthNum, heightNum])

  const copyToClipboard = () => {
    if (results.length === 0) return

    const text = results.map(r => `${r.name}: ${r.tokens.toLocaleString()} tokens`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectSize = (w: number, h: number) => {
    setWidth(w.toString())
    setHeight(h.toString())
  }

  const totalPixels = widthNum * heightNum
  const aspectRatio = heightNum > 0 ? (widthNum / heightNum).toFixed(2) : '0'
  const megapixels = totalPixels / 1000000

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">图像尺寸计算器</h1>
        <p className="text-slate-600 dark:text-slate-400">
          计算不同 AI 模型的图像 Token 消耗
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-sky-500" />
              图像尺寸
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  宽度 (像素)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="1024"
                  min={1}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  高度 (像素)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="1024"
                  min={1}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                常用尺寸
              </label>
              <div className="flex flex-wrap gap-2">
                {commonSizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => selectSize(size.width, size.height)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {size.label || size.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {widthNum > 0 && heightNum > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-sky-500" />
                  Token 计算
                </h2>
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>

              <div className="space-y-3">
                {results.map((result) => (
                  <div
                    key={result.name}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {result.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {result.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                          {result.tokens.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          tokens
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {widthNum > 0 && heightNum > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">图像信息</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">尺寸</span>
                  <span className="font-medium">{widthNum} × {heightNum}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">宽高比</span>
                  <span className="font-medium">{aspectRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">总像素</span>
                  <span className="font-medium">{totalPixels.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">百万像素</span>
                  <span className="font-medium">{megapixels.toFixed(2)} MP</span>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">计费说明</h2>
            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">GPT-4V</h3>
                <p className="text-xs">
                  图像缩放至 2048×2048，切成 512×512 块<br />
                  基础 65 tokens + 85 tokens/块
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">GPT-4o HD</h3>
                <p className="text-xs">
                  高精度模式，切成 768×768 块<br />
                  基础 65 tokens + 170 tokens/块
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Claude 3</h3>
                <p className="text-xs">
                  按 512×512 块计算<br />
                  单块 85 tokens，每增加一块 +85 tokens
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">优化建议</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>使用正方形图像更节省 tokens！
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>1024×1024 是较好的平衡选择</li>
                <li>避免使用超大分辨率</li>
                <li>Claude 3 对单图更友好</li>
                <li>长宽比越大，token 消耗越多</li>
              </ul>
            </div>
          </Card>

          {results.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">价格估算</h2>
              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <div>价格仅供参考，以官方为准：</div>
                <div className="pt-2 space-y-1">
                  <div>• GPT-4V: ~$0.01/1K tokens (输入)</div>
                  <div>• GPT-4o HD: ~$0.01/1K tokens (输入)</div>
                  <div>• Claude 3: ~$0.003/1K tokens (输入)</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
