import { useState, useMemo } from 'react'
import { DollarSign, Info, Plus, Trash2, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ModelPricing {
  name: string
  provider: string
  inputPrice: number
  outputPrice: number
}

const models: Record<string, ModelPricing> = {
  'gpt-4-turbo': { name: 'GPT-4 Turbo', provider: 'OpenAI', inputPrice: 0.01, outputPrice: 0.03 },
  'gpt-4o': { name: 'GPT-4O', provider: 'OpenAI', inputPrice: 0.005, outputPrice: 0.015 },
  'gpt-4o-mini': { name: 'GPT-4O Mini', provider: 'OpenAI', inputPrice: 0.00015, outputPrice: 0.0006 },
  'gpt-3.5-turbo': { name: 'GPT-3.5 Turbo', provider: 'OpenAI', inputPrice: 0.0005, outputPrice: 0.0015 },
  'claude-3-opus': { name: 'Claude 3 Opus', provider: 'Anthropic', inputPrice: 0.015, outputPrice: 0.075 },
  'claude-3-5-sonnet': { name: 'Claude 3.5 Sonnet', provider: 'Anthropic', inputPrice: 0.003, outputPrice: 0.015 },
  'claude-3-haiku': { name: 'Claude 3 Haiku', provider: 'Anthropic', inputPrice: 0.00025, outputPrice: 0.00125 },
  'gemini-pro': { name: 'Gemini Pro', provider: 'Google', inputPrice: 0.00025, outputPrice: 0.0005 },
  'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', provider: 'Google', inputPrice: 0.000075, outputPrice: 0.00015 },
  'deepseek-v3': { name: 'DeepSeek V3', provider: 'DeepSeek', inputPrice: 0.00014, outputPrice: 0.00028 },
  'qwen-plus': { name: '通义千问 Plus', provider: '阿里云', inputPrice: 0.0004, outputPrice: 0.0002 },
  'qwen-turbo': { name: '通义千问 Turbo', provider: '阿里云', inputPrice: 0.0008, outputPrice: 0.0004 },
  'qwen-max': { name: '通义千问 Max', provider: '阿里云', inputPrice: 0.0012, outputPrice: 0.0006 },
  'ernie-4': { name: '文心一言 ERNIE 4.0', provider: '百度', inputPrice: 0.012, outputPrice: 0.012 },
  'glm-4': { name: '智谱 GLM-4', provider: '智谱AI', inputPrice: 0.01, outputPrice: 0.05 },
}

const USD_TO_CNY = 7.2

type SortField = 'name' | 'inputCost' | 'outputCost' | 'totalCost'
type SortOrder = 'asc' | 'desc'

export function AIPriceCalculator() {
  const [inputTokens, setInputTokens] = useState('')
  const [outputTokens, setOutputTokens] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt-4-turbo', 'gpt-4o', 'claude-3-5-sonnet'])
  const [currency, setCurrency] = useState<'USD' | 'CNY'>('USD')
  const [sortField, setSortField] = useState<SortField>('totalCost')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const calculateCost = (modelKey: string) => {
    const model = models[modelKey]
    const input = parseInt(inputTokens) || 0
    const output = parseInt(outputTokens) || 0
    
    let inputCost = input * model.inputPrice
    let outputCost = output * model.outputPrice
    
    if (currency === 'CNY') {
      inputCost *= USD_TO_CNY
      outputCost *= USD_TO_CNY
    }
    
    return {
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost
    }
  }

  const comparisonData = useMemo(() => {
    const data = selectedModels.map(key => {
      const model = models[key]
      const costs = calculateCost(key)
      return {
        key,
        name: model.name,
        provider: model.provider,
        inputPrice: model.inputPrice,
        outputPrice: model.outputPrice,
        ...costs
      }
    })

    return data.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''
      
      switch (sortField) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'inputCost':
          aVal = a.inputCost
          bVal = b.inputCost
          break
        case 'outputCost':
          aVal = a.outputCost
          bVal = b.outputCost
          break
        case 'totalCost':
          aVal = a.totalCost
          bVal = b.totalCost
          break
      }
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal)
      }
      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
  }, [selectedModels, inputTokens, outputTokens, currency, sortField, sortOrder])

  const addModel = (modelKey: string) => {
    if (!selectedModels.includes(modelKey)) {
      setSelectedModels([...selectedModels, modelKey])
    }
  }

  const removeModel = (modelKey: string) => {
    setSelectedModels(selectedModels.filter(m => m !== modelKey))
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const formatCost = (cost: number) => {
    if (cost < 0.000001) return cost.toExponential(2)
    if (cost < 0.01) return cost.toFixed(6)
    if (cost < 1) return cost.toFixed(4)
    return cost.toFixed(2)
  }

  const getMinTotalCost = () => {
    if (comparisonData.length === 0) return 0
    return Math.min(...comparisonData.map(d => d.totalCost))
  }

  const currencySymbol = currency === 'CNY' ? '¥' : '$'

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI 价格计算器</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          计算并对比不同 AI 模型的 API 调用成本
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-sky-500" />
            基础设置
          </h2>

          <div className="space-y-4">
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
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      currency === curr
                        ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {curr === 'USD' ? '$ 美元' : '¥ 人民币'}
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
                  const ratio = 2
                  setOutputTokens(Math.round(input * ratio).toString())
                }}
                disabled={!inputTokens}
                className="flex-1"
              >
                估算输出 (2x)
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-sky-500" />
            选择对比模型
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {Object.entries(models).map(([key, model]) => (
              <button
                key={key}
                onClick={() => {
                  if (selectedModels.includes(key)) {
                    removeModel(key)
                  } else {
                    addModel(key)
                  }
                }}
                className={`px-3 py-2 rounded-lg border text-left text-sm transition-colors ${
                  selectedModels.includes(key)
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <div className="font-medium truncate">{model.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{model.provider}</div>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedModels(Object.keys(models))}
              variant="outline"
              size="sm"
            >
              全选
            </Button>
            <Button
              onClick={() => setSelectedModels(['gpt-4-turbo', 'gpt-4o', 'claude-3-5-sonnet'])}
              variant="outline"
              size="sm"
            >
              重置默认
            </Button>
            <Button
              onClick={() => setSelectedModels([])}
              variant="outline"
              size="sm"
            >
              清空选择
            </Button>
          </div>
        </Card>
      </div>

      {selectedModels.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-sky-500" />
            成本对比结果
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
              ({currencySymbol} / 1K tokens)
            </span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th 
                    className="px-4 py-3 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => toggleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      模型
                      {sortField === 'name' && (
                        <span className="text-sky-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-slate-500 dark:text-slate-400">厂商</th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => toggleSort('inputCost')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      输入成本
                      {sortField === 'inputCost' && (
                        <span className="text-sky-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => toggleSort('outputCost')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      输出成本
                      {sortField === 'outputCost' && (
                        <span className="text-sky-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-right cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
                    onClick={() => toggleSort('totalCost')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      总成本
                      {sortField === 'totalCost' && (
                        <span className="text-sky-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((data) => {
                  const isMin = data.totalCost === getMinTotalCost() && data.totalCost > 0
                  return (
                    <tr 
                      key={data.key}
                      className={`border-b border-slate-100 dark:border-slate-800 ${
                        isMin ? 'bg-green-50 dark:bg-green-900/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{data.name}</div>
                        {isMin && (
                          <span className="text-xs text-green-600 dark:text-green-400">最低价</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{data.provider}</td>
                      <td className="px-4 py-3 text-right font-mono">
                        {currencySymbol}{formatCost(data.inputCost)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {currencySymbol}{formatCost(data.outputCost)}
                      </td>
                      <td className={`px-4 py-3 text-right font-mono font-semibold ${isMin ? 'text-green-600 dark:text-green-400' : ''}`}>
                        {currencySymbol}{formatCost(data.totalCost)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => removeModel(data.key)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="移除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {comparisonData.length > 1 && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">最低成本</div>
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    {currencySymbol}{formatCost(getMinTotalCost())}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">最高成本</div>
                  <div className="font-semibold text-red-600 dark:text-red-400">
                    {currencySymbol}{formatCost(Math.max(...comparisonData.map(d => d.totalCost)))}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">平均成本</div>
                  <div className="font-semibold">
                    {currencySymbol}{formatCost(comparisonData.reduce((sum, d) => sum + d.totalCost, 0) / comparisonData.length)}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">对比模型数</div>
                  <div className="font-semibold">{comparisonData.length}</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-start gap-2 text-sm text-sky-700 dark:text-sky-300">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">价格说明</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600 dark:text-slate-400">
              <li>价格为参考，可能因时间变化，建议查询官方 API 文档获取最新价格</li>
              <li>汇率参考：1 USD ≈ 7.2 CNY</li>
              <li>不同平台和地区的价格可能不同</li>
              <li>点击表头可按该列排序</li>
              <li>绿色高亮显示最低成本的模型</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
