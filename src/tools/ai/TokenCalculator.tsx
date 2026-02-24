import { useState, useMemo, useEffect } from 'react'
import { Calculator, Trash2, Info, ChevronDown, ChevronUp, Variable, Sparkles, Eye, EyeOff, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { getEncoding } from 'js-tiktoken'

interface TokenInfo {
  tokenCount: number
  charCount: number
  avgTokensPerChar: number
}

interface TokenWithRange {
  token: number
  text: string
  startIndex: number
  endIndex: number
}

interface Model {
  id: string
  name: string
  provider: string
  encoding: 'cl100k_base' | 'o200k_base' | 'p50k_base' | 'r50k_base' | 'p50k_edit'
  description?: string
}

const MODELS: Model[] = [
  // OpenAI
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', encoding: 'o200k_base', description: '最新旗舰模型' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', encoding: 'o200k_base', description: '高性价比' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', encoding: 'cl100k_base', description: '高性能' },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', encoding: 'cl100k_base', description: '经典版本' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', encoding: 'cl100k_base', description: '经济实用' },
  { id: 'o1', name: 'o1', provider: 'OpenAI', encoding: 'o200k_base', description: '推理模型' },
  { id: 'o3', name: 'o3', provider: 'OpenAI', encoding: 'o200k_base', description: '最新推理' },
  // Anthropic
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', encoding: 'cl100k_base', description: '最强性能' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', encoding: 'cl100k_base', description: '平衡之选' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic', encoding: 'cl100k_base', description: '快速响应' },
  // Google
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', encoding: 'cl100k_base', description: 'Google主力' },
  { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'Google', encoding: 'cl100k_base', description: '顶级性能' },
  // Meta
  { id: 'llama-3.1', name: 'Llama 3.1', provider: 'Meta', encoding: 'cl100k_base', description: '开源领先' },
  { id: 'llama-3', name: 'Llama 3', provider: 'Meta', encoding: 'cl100k_base', description: '开源模型' },
  // 国内模型
  { id: 'qwen-max', name: '通义千问 Max', provider: '阿里云', encoding: 'cl100k_base', description: '阿里最强' },
  { id: 'qwen-plus', name: '通义千问 Plus', provider: '阿里云', encoding: 'cl100k_base', description: '平衡性能' },
  { id: 'qwen-turbo', name: '通义千问 Turbo', provider: '阿里云', encoding: 'cl100k_base', description: '快速经济' },
  { id: 'ernie-bot', name: '文心一言', provider: '百度', encoding: 'cl100k_base', description: '百度主力' },
  { id: 'glm-4', name: 'GLM-4', provider: '智谱AI', encoding: 'cl100k_base', description: '智谱旗舰' },
  { id: 'moonshot-v1', name: 'Kimi', provider: '月之暗面', encoding: 'cl100k_base', description: '长文本专家' },
  { id: 'deepseek-chat', name: 'DeepSeek Chat', provider: 'DeepSeek', encoding: 'cl100k_base', description: '深度求索' },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek', encoding: 'cl100k_base', description: '代码专家' },
  { id: 'yi-large', name: 'Yi Large', provider: '零一万物', encoding: 'cl100k_base', description: '李开复团队' },
  { id: 'doubao-pro', name: '豆包 Pro', provider: '字节跳动', encoding: 'cl100k_base', description: '字节主力' },
]

const PROVIDERS = Array.from(new Set(MODELS.map(m => m.provider)))

const COLORS = [
  'bg-blue-200 dark:bg-blue-900/40',
  'bg-green-200 dark:bg-green-900/40',
  'bg-yellow-200 dark:bg-yellow-900/40',
  'bg-pink-200 dark:bg-pink-900/40',
  'bg-purple-200 dark:bg-purple-900/40',
  'bg-indigo-200 dark:bg-indigo-900/40',
  'bg-red-200 dark:bg-red-900/40',
  'bg-orange-200 dark:bg-orange-900/40',
  'bg-teal-200 dark:bg-teal-900/40',
  'bg-cyan-200 dark:bg-cyan-900/40',
]

const getColor = (index: number) => COLORS[index % COLORS.length]

// 提取变量占位符
const extractVariables = (text: string): string[] => {
  const regex = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g
  const matches = new Set<string>()
  let match
  while ((match = regex.exec(text)) !== null) {
    matches.add(match[1])
  }
  return Array.from(matches)
}

// 替换变量
const replaceVariables = (text: string, variables: Record<string, string>): string => {
  let result = text
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g')
    result = result.replace(regex, value)
  })
  return result
}

const STORAGE_KEY = 'token-calculator-cache'

export function TokenCalculator() {
  const [input, setInput] = useState('')
  const [selectedModelId, setSelectedModelId] = useState<string>('gpt-4o')
  const [selectedProvider, setSelectedProvider] = useState<string>('全部')
  const [showAllModels, setShowAllModels] = useState(false)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [showVisualization, setShowVisualization] = useState(true)
  const [enableCache, setEnableCache] = useState(false)

  const selectedModel = MODELS.find(m => m.id === selectedModelId) || MODELS[0]

  // 从 localStorage 加载缓存
  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY)
      if (cached) {
        const data = JSON.parse(cached)
        if (data.enableCache) {
          setInput(data.input || '')
          setVariableValues(data.variableValues || {})
          setEnableCache(true)
        }
      }
    } catch {
      // 忽略解析错误
    }
  }, [])

  // 保存到 localStorage
  useEffect(() => {
    if (enableCache) {
      try {
        const data = {
          input,
          variableValues,
          enableCache: true,
          timestamp: Date.now()
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      } catch {
        // 忽略存储错误
      }
    }
  }, [input, variableValues, enableCache])

  // 切换缓存时清理
  const handleToggleCache = (enabled: boolean) => {
    setEnableCache(enabled)
    if (!enabled) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // 忽略清理错误
      }
    }
  }

  // 提取变量
  const variables = useMemo(() => extractVariables(input), [input])

  // 过滤模型
  const filteredModels = useMemo(() => {
    if (selectedProvider === '全部') return MODELS
    return MODELS.filter(m => m.provider === selectedProvider)
  }, [selectedProvider])

  const displayedModels = showAllModels ? filteredModels : filteredModels.slice(0, 3)

  // 计算最终文本（替换变量后）
  const finalText = useMemo(() => {
    return replaceVariables(input, variableValues)
  }, [input, variableValues])

  // 计算 Token 和位置信息
  const tokenInfo: TokenInfo & { tokens: TokenWithRange[] } = useMemo(() => {
    if (!finalText.trim()) {
      return { tokenCount: 0, charCount: 0, avgTokensPerChar: 0, tokens: [] }
    }

    try {
      const encoding = getEncoding(selectedModel.encoding)
      const tokens = encoding.encode(finalText)
      const charCount = finalText.length
      const avgTokensPerChar = tokens.length / charCount

      // 计算每个 token 的文本范围
      const tokensWithRange: TokenWithRange[] = []
      let currentIndex = 0

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        // 解码 token 获取文本
        const decoded = encoding.decode([token])
        const tokenText = decoded

        // 在原文本中查找该 token 的位置
        const startIndex = finalText.indexOf(tokenText, currentIndex)
        const endIndex = startIndex + tokenText.length

        tokensWithRange.push({
          token,
          text: tokenText,
          startIndex,
          endIndex,
        })

        currentIndex = endIndex
      }

      return {
        tokenCount: tokens.length,
        charCount,
        avgTokensPerChar: Math.round(avgTokensPerChar * 100) / 100,
        tokens: tokensWithRange,
      }
    } catch {
      return { tokenCount: 0, charCount: finalText.length, avgTokensPerChar: 0, tokens: [] }
    }
  }, [finalText, selectedModel])

  const clearInput = () => {
    setInput('')
    setVariableValues({})
  }

  const updateVariable = (key: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [key]: value }))
  }

  const fillDemoData = () => {
    const demoText = `你是一个专业的 {role}，请帮我分析以下 {topic} 相关的内容。

用户背景：
- 姓名：{name}
- 经验水平：{level}
- 目标：{goal}

请提供详细的分析和建议，包括：
1. {topic} 的基本概念
2. 适合 {level} 水平的学习路径
3. 实现 {goal} 的具体步骤
4. 常见问题和解决方案

期待你的专业回复！`

    const demoVariables = {
      role: 'AI 技术顾问',
      topic: '大语言模型应用开发',
      name: '张三',
      level: '中级',
      goal: '构建智能客服系统'
    }

    setInput(demoText)
    setVariableValues(demoVariables)
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<Calculator className="h-8 w-8" />}
        title="Token 计算器"
        description="计算文本的 Token 数量，支持变量填充和 20+ 种主流大语言模型"
      />

      {/* 模型选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-sky-500" />
            选择模型
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 厂商筛选 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedProvider('全部')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedProvider === '全部'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            {PROVIDERS.map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedProvider(provider)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedProvider === provider
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {provider}
              </button>
            ))}
          </div>

          {/* 模型列表 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayedModels.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={`relative px-4 py-3 rounded-xl text-left transition-all duration-200 border-2 ${
                  selectedModelId === model.id
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-300 dark:hover:border-sky-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {model.name}
                  </div>
                  {selectedModelId === model.id && (
                    <div className="w-2 h-2 rounded-full bg-sky-500 mt-1.5" />
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {model.description}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {model.provider}
                </div>
              </button>
            ))}
          </div>

          {/* 展开/收起按钮 */}
          {filteredModels.length > 3 && (
            <button
              onClick={() => setShowAllModels(!showAllModels)}
              className="w-full py-2 flex items-center justify-center gap-2 text-sm text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
            >
              {showAllModels ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  收起
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  展开更多 ({filteredModels.length - 3} 个)
                </>
              )}
            </button>
          )}
        </CardContent>
      </Card>

      {/* 计算结果 */}
      <Card className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-sky-200 dark:border-sky-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-sky-500" />
              计算结果
            </div>
            <div className="flex items-center gap-2">
              {showVisualization ? (
                <Eye className="h-4 w-4 text-slate-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-slate-500" />
              )}
              <span className="text-sm text-slate-600 dark:text-slate-400">Token 可视化</span>
              <Switch
                checked={showVisualization}
                onCheckedChange={setShowVisualization}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 text-center shadow-sm">
              <div className="text-4xl font-bold text-sky-600 dark:text-sky-400">
                {tokenInfo.tokenCount.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Token 数量
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 text-center shadow-sm">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {tokenInfo.charCount.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                字符数量
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 text-center shadow-sm">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                {tokenInfo.avgTokensPerChar || '-'}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Token/字符比
              </div>
            </div>
          </div>

          {/* Token 可视化 */}
          {showVisualization && tokenInfo.tokens.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Token 可视化预览
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm">
                <div className="flex flex-wrap gap-1 font-mono text-sm">
                  {tokenInfo.tokens.map((tokenData, index) => (
                    <div
                      key={index}
                      className={`${getColor(index)} rounded px-2 py-1 transition-all hover:opacity-80`}
                      title={`Token #${index + 1}: ${tokenData.text}`}
                    >
                      <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
                        #{index + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {tokenData.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  共 {tokenInfo.tokens.length} 个 Token，每个颜色代表一个 Token
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Variable className="h-5 w-5 text-sky-500" />
              输入文本
              {/* 说明图标 */}
              <div className="group relative inline-block">
                <button
                  className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-sky-500 hover:text-white text-slate-500 dark:text-slate-400 transition-all duration-200 flex items-center justify-center"
                  aria-label="查看说明"
                >
                  <Info className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-sky-500" />
                      使用说明
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2.5">
                      <p className="whitespace-nowrap">• <strong>变量填充</strong>：使用 {'{变量名}'} 作为占位符</p>
                      <p className="whitespace-nowrap">• 1 Token ≈ 4 个英文字符或 0.75 个汉字</p>
                      <p className="whitespace-nowrap">• 不同模型使用不同分词器，结果略有差异</p>
                      <p className="whitespace-nowrap">• 使用 js-tiktoken 库，与 OpenAI API 基本一致</p>
                      <p className="whitespace-nowrap">• 非 OpenAI 模型使用相近编码估算</p>
                      <p className="whitespace-nowrap">• 开启可视化可查看每个 Token 的边界</p>
                    </div>
                    <div className="absolute top-0 left-4 -translate-y-1/2 rotate-45 w-2.5 h-2.5 bg-white dark:bg-slate-800 border-t border-l border-slate-200 dark:border-slate-700"></div>
                  </div>
                </div>
              </div>
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300">
                {selectedModel.name}
              </span>
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                  记住输入
                </span>
                <Switch
                  checked={enableCache}
                  onCheckedChange={handleToggleCache}
                />
              </div>
                  <Button
                variant="outline"
                size="sm"
                onClick={fillDemoData}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                示例
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearInput}
                disabled={!input}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="在此输入要计算 Token 的文本，支持使用 {变量名} 作为占位符...&#10;&#10;例如：&#10;你好，我叫 {name}，今年 {age} 岁。&#10;&#10;系统会自动识别变量并生成输入框。"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[150px] font-mono text-sm resize-y"
          />

          {/* 变量输入区域 */}
          {variables.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Variable className="h-4 w-4 text-sky-500" />
                变量填充 ({variables.length} 个)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {variables.map((varName) => (
                  <div key={varName} className="flex items-center gap-2">
                    <span className="text-sm font-mono text-sky-600 dark:text-sky-400 min-w-[80px]">
                      {'{'}{varName}{'}'}
                    </span>
                    <Input
                      placeholder={`输入 ${varName} 的值...`}
                      value={variableValues[varName] || ''}
                      onChange={(e) => updateVariable(varName, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 最终文本预览 */}
          {finalText !== input && finalText && (
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
              <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                填充后的文本预览
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-all">
                {finalText}
              </div>
            </div>
          )}

          <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
            <span>字符数: {tokenInfo.charCount.toLocaleString()}</span>
            <span>平均 Token/字符: {tokenInfo.avgTokensPerChar || '-'}</span>
          </div>
        </CardContent>
      </Card>

      {/* 说明悬浮窗 */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="group relative">
          <button
            className="w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            aria-label="查看说明"
          >
            <Info className="h-6 w-6" />
          </button>
          <div className="absolute bottom-full right-0 mb-3 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-sky-500" />
                使用说明
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <p>• <strong>变量填充</strong>：使用 {'{变量名}'} 作为占位符，系统自动生成输入框。</p>
                <p>• Token 是大语言模型处理文本的基本单位，1 Token ≈ 4 英文字符或 0.75 个汉字。</p>
                <p>• 不同模型使用不同分词器，Token 数量可能略有差异。</p>
                <p>• 使用 js-tiktoken 库计算，结果与 OpenAI API 基本一致。</p>
                <p>• 非 OpenAI 模型使用相近编码估算，结果仅供参考。</p>
                <p>• 开启可视化可查看每个 Token 的边界和内容。</p>
              </div>
              <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-3 h-3 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
