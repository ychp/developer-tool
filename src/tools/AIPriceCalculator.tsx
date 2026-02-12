import { useState } from 'react'
import { DollarSign, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ModelPricing {
  name: string
  inputPrice: number
  outputPrice: number
}

const models: Record<string, ModelPricing> = {
  'gpt-4-turbo': { name: 'GPT-4 Turbo', inputPrice: 0.01, outputPrice: 0.03 },
  'gpt-4o': { name: 'GPT-4O', inputPrice: 0.005, outputPrice: 0.015 },
  'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', inputPrice: 0.0005, outputPrice: 0.0015 },
  'gpt-3.5': { name: 'GPT-3.5', inputPrice: 0.0005, outputPrice: 0.0015 },
  'gpt-4o-mini': { name: 'GPT-4O Mini', inputPrice: 0.00015, outputPrice: 0.0006 },
  'claude-3-opus': { name: 'Claude 3 Opus', inputPrice: 0.015, outputPrice: 0.075 },
  'claude-3-5-sonnet': { name: 'Claude 3.5 Sonnet', inputPrice: 0.003, outputPrice: 0.015 },
  'claude-3-haiku': { name: 'Claude 3 Haiku', inputPrice: 0.00025, outputPrice: 0.00125 },
  'gemini-pro': { name: 'Gemini Pro', inputPrice: 0.00025, outputPrice: 0.0005 },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', inputPrice: 0.000075, outputPrice: 0.00015 },
  'deepseek-v3': { name: 'DeepSeek V3', inputPrice: 0.00014, outputPrice: 0.00028 },
  'qwen-plus': { name: '通义千问 Plus', inputPrice: 0.0004, outputPrice: 0.0002 },
  'qwen-turbo': { name: '通义千问 Turbo', inputPrice: 0.0008, outputPrice: 0.0004 },
  'qwen-max': { name: '通义千问 Max', inputPrice: 0.0012, outputPrice: 0.0006 },
  'baichuan-4': { name: '文心一言 ERNIE 4.0', inputPrice: 0.012, outputPrice: 0.012 },
  'glm-4': { name: '智谱 GLM-4', inputPrice: 0.01, outputPrice: 0.05 },
  'yandex-gpt': { name: 'YandexGPT', inputPrice: 0.004, outputPrice: 0.008 },
}

export function AIPriceCalculator() {
  const [inputTokens, setInputTokens] = useState('')
  const [outputTokens, setOutputTokens] = useState('')
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo')
  const [currency, setCurrency] = useState<'USD' | 'CNY'>('USD')

  const calculateCost = () => {
    const model = models[selectedModel]
    const inputCost = (parseInt(inputTokens) || 0) * model.inputPrice
    const outputCost = (parseInt(outputTokens) || 0) * model.outputPrice
    return {
      inputCost: inputCost.toFixed(6),
      outputCost: outputCost.toFixed(6),
      totalCost: (inputCost + outputCost).toFixed(6)
    }
  }

  const cost = calculateCost()

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI 价格计算器</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          计算使用不同 AI 模型的 API 调用成本
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-sky-500" />
            输入信息
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                选择模型
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {Object.entries(models).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.name} (${model.inputPrice}/${model.outputPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                货币单位
              </label>
              <div className="flex gap-2">
                {(['USD', 'CNY'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`px-4 py-2 rounded-lg border ${
                      currency === curr
                        ? 'border-sky-500 bg-sky-50 text-white'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
                    } hover:opacity-80 transition-opacity`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                输入 Token 数量
              </label>
              <input
                type="number"
                value={inputTokens}
                onChange={(e) => setInputTokens(e.target.value)}
                placeholder="例如: 1000"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                输出 Token 数量
              </label>
              <input
                type="number"
                value={outputTokens}
                onChange={(e) => setOutputTokens(e.target.value)}
                placeholder="例如: 2000"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  setInputTokens('')
                  setOutputTokens('')
                }}
                variant="outline"
                className="flex-1"
              >
                清空
              </Button>
              <Button
                onClick={() => {
                  const input = parseInt(inputTokens) || 0
                  const ratio = input > 0 ? (parseInt(outputTokens) || 0) / input : 1
                  setOutputTokens(Math.round(input * ratio).toString())
                }}
                disabled={!inputTokens}
              >
                估算输出
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-500" />
            费用明细
          </h2>

          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="font-medium text-slate-900 dark:text-slate-100">模型</div>
                <div className="font-medium text-slate-900 dark:text-slate-100">输入价格</div>
                <div className="font-medium text-slate-900 dark:text-slate-100">输出价格</div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4 py-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="text-center py-2">
                    <div className="font-semibold text-sky-600 dark:text-sky-400">{models[selectedModel].name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {models[selectedModel].inputPrice} / {models[selectedModel].outputPrice}
                    </div>
                  </div>
                  <div className="text-center py-2 bg-slate-50 dark:bg-slate-800">
                    {cost.inputCost}
                  </div>
                  <div className="text-center py-2 bg-slate-50 dark:bg-slate-800">
                    {cost.outputCost}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <div className="text-center py-2">
                    <div className="font-semibold text-sky-600 dark:text-sky-400">
                      {currency === 'CNY' ? '¥' : '$'}
                    </div>
                  </div>
                  <div className="text-center py-2 bg-slate-50 dark:bg-slate-800">
                    {cost.inputCost}
                  </div>
                  <div className="text-center py-2 bg-slate-50 dark:bg-slate-800">
                    {cost.outputCost}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                  <div className="text-center py-2 font-semibold">
                    总计
                  </div>
                  <div className="col-span-2 text-center py-2 bg-sky-500 text-white font-bold">
                    {cost.totalCost}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900 rounded-lg">
              <div className="flex items-start gap-2 text-sm text-sky-700 dark:text-sky-300">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">价格说明</p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-400">
                    <li>价格为参考，可能因时间变化</li>
                    <li>1 USD ≈ 7.2 CNY</li>
                    <li>不同平台和地区的价格可能不同</li>
                    <li>建议查询官方 API 文档获取最新价格</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
