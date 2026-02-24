import { useState, useMemo } from 'react'
import { User, Shield, FileText, Copy, Check, RefreshCw, Sparkles, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Constraint {
  id: string
  type: 'prohibited' | 'required' | 'format'
  content: string
}

interface OutputFormat {
  id: string
  description: string
  example: string
}

interface PromptConfig {
  role: string
  expertise: string
  task: string
  audience: string
  tone: string
  constraints: Constraint[]
  outputFormats: OutputFormat[]
  additionalInstructions: string
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const roleTemplates = [
  { value: '', label: '自定义', role: '' },
  { value: 'software_engineer', label: '软件工程师', role: '你是一位经验丰富的软件工程师，精通多种编程语言和软件架构设计。' },
  { value: 'data_analyst', label: '数据分析师', role: '你是一位专业的数据分析师，擅长数据挖掘、统计分析和可视化。' },
  { value: 'content_writer', label: '内容创作者', role: '你是一位优秀的内容创作者，擅长撰写各类文章、营销文案和社交媒体内容。' },
  { value: 'product_manager', label: '产品经理', role: '你是一位资深产品经理，具有丰富的产品设计和用户需求分析经验。' },
  { value: 'teacher', label: '教师', role: '你是一位经验丰富的教师，擅长用简单易懂的方式解释复杂概念。' },
  { value: 'consultant', label: '咨询顾问', role: '你是一位专业的咨询顾问，擅长分析问题并提供可行性建议。' },
  { value: 'translator', label: '翻译专家', role: '你是一位专业的翻译专家，精通多种语言，能够准确传达原文的语义和风格。' },
  { value: 'researcher', label: '研究员', role: '你是一位专业的研究员，擅长学术研究、文献综述和科学写作。' },
]

const toneOptions = [
  { value: '', label: '默认' },
  { value: 'professional', label: '专业严谨' },
  { value: 'friendly', label: '友好亲和' },
  { value: 'formal', label: '正式庄重' },
  { value: 'casual', label: '轻松随意' },
  { value: 'technical', label: '技术专业' },
  { value: 'creative', label: '创意活泼' },
  { value: 'concise', label: '简洁直接' },
]

const constraintPresets = [
  {
    name: '基础约束',
    constraints: [
      { type: 'required' as const, content: '回答必须准确、客观，如有不确定的地方请明确指出' },
      { type: 'prohibited' as const, content: '不得编造信息或提供虚假数据' },
      { type: 'format' as const, content: '使用清晰的段落结构和适当的格式化（如列表、标题）' },
    ]
  },
  {
    name: '代码助手',
    constraints: [
      { type: 'required' as const, content: '代码必须有清晰的注释说明' },
      { type: 'required' as const, content: '提供错误处理和边界情况说明' },
      { type: 'format' as const, content: '使用代码块格式输出代码，并标注语言类型' },
    ]
  },
  {
    name: '数据分析',
    constraints: [
      { type: 'required' as const, content: '数据引用必须注明来源' },
      { type: 'required' as const, content: '提供数据验证和清洗建议' },
      { type: 'format' as const, content: '重要结论使用加粗或列表强调' },
    ]
  },
  {
    name: '内容创作',
    constraints: [
      { type: 'prohibited' as const, content: '避免使用陈词滥调和过度修饰' },
      { type: 'required' as const, content: '内容必须原创且有独特见解' },
      { type: 'format' as const, content: '使用吸引人的标题和引人入胜的开头' },
    ]
  },
]

const outputFormatPresets = [
  {
    name: '简洁回答',
    formats: [
      { description: '直接回答核心问题，无需展开', example: 'Q: 什么是API？\nA: API（应用程序接口）是不同软件组件之间通信的协议。' },
    ]
  },
  {
    name: '详细分析',
    formats: [
      { description: '结构化分析，包含背景、分析过程和结论', example: '## 背景\n...\n## 分析\n...\n## 结论\n...' },
    ]
  },
  {
    name: '步骤说明',
    formats: [
      { description: '使用编号列表展示操作步骤', example: '1. 第一步\n2. 第二步\n3. 第三步' },
    ]
  },
  {
    name: '表格对比',
    formats: [
      { description: '使用表格对比多个选项的异同', example: '| 特性 | 选项A | 选项B |\n|------|-------|-------|\n| ... | ... | ... |' },
    ]
  },
]

const createDefaultConstraint = (): Constraint => ({
  id: generateId(),
  type: 'required',
  content: ''
})

const createDefaultOutputFormat = (): OutputFormat => ({
  id: generateId(),
  description: '',
  example: ''
})

export function SystemPromptGenerator() {
  const [config, setConfig] = useState<PromptConfig>({
    role: '',
    expertise: '',
    task: '',
    audience: '',
    tone: '',
    constraints: [],
    outputFormats: [],
    additionalInstructions: ''
  })
  const [copied, setCopied] = useState(false)

  const updateConfig = (key: keyof PromptConfig, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const applyRoleTemplate = (template: typeof roleTemplates[0]) => {
    if (template.value === '') {
      setConfig(prev => ({ ...prev, role: '' }))
    } else if (template.role) {
      setConfig(prev => ({ ...prev, role: template.role }))
    }
  }

  const addConstraint = () => {
    setConfig(prev => ({
      ...prev,
      constraints: [...prev.constraints, createDefaultConstraint()]
    }))
  }

  const updateConstraint = (id: string, field: keyof Constraint, value: string) => {
    setConfig(prev => ({
      ...prev,
      constraints: prev.constraints.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      )
    }))
  }

  const removeConstraint = (id: string) => {
    setConfig(prev => ({
      ...prev,
      constraints: prev.constraints.filter(c => c.id !== id)
    }))
  }

  const applyConstraintPreset = (preset: typeof constraintPresets[0]) => {
    const newConstraints = preset.constraints.map(c => ({
      ...c,
      id: generateId()
    }))
    setConfig(prev => ({
      ...prev,
      constraints: newConstraints
    }))
  }

  const addOutputFormat = () => {
    setConfig(prev => ({
      ...prev,
      outputFormats: [...prev.outputFormats, createDefaultOutputFormat()]
    }))
  }

  const updateOutputFormat = (id: string, field: keyof OutputFormat, value: string) => {
    setConfig(prev => ({
      ...prev,
      outputFormats: prev.outputFormats.map(f =>
        f.id === id ? { ...f, [field]: value } : f
      )
    }))
  }

  const removeOutputFormat = (id: string) => {
    setConfig(prev => ({
      ...prev,
      outputFormats: prev.outputFormats.filter(f => f.id !== id)
    }))
  }

  const applyOutputFormatPreset = (preset: typeof outputFormatPresets[0]) => {
    const newFormats = preset.formats.map(f => ({
      ...f,
      id: generateId()
    }))
    setConfig(prev => ({
      ...prev,
      outputFormats: newFormats
    }))
  }

  const generatedPrompt = useMemo(() => {
    const parts: string[] = []

    if (config.role) {
      parts.push(`# 角色设定\n${config.role}`)
    }

    if (config.expertise) {
      parts.push(`\n# 专业领域\n${config.expertise}`)
    }

    if (config.task) {
      parts.push(`\n# 主要任务\n${config.task}`)
    }

    if (config.audience) {
      parts.push(`\n# 目标受众\n${config.audience}`)
    }

    if (config.tone) {
      const toneLabel = toneOptions.find(t => t.value === config.tone)?.label || config.tone
      parts.push(`\n# 回答语气\n${toneLabel}`)
    }

    if (config.constraints.length > 0) {
      const prohibited = config.constraints.filter(c => c.type === 'prohibited')
      const required = config.constraints.filter(c => c.type === 'required')
      const format = config.constraints.filter(c => c.type === 'format')

      parts.push('\n# 约束条件')

      if (prohibited.length > 0) {
        parts.push('\n## 禁止事项')
        prohibited.forEach(c => {
          parts.push(`- ${c.content}`)
        })
      }

      if (required.length > 0) {
        parts.push('\n## 必须遵守')
        required.forEach(c => {
          parts.push(`- ${c.content}`)
        })
      }

      if (format.length > 0) {
        parts.push('\n## 格式要求')
        format.forEach(c => {
          parts.push(`- ${c.content}`)
        })
      }
    }

    if (config.outputFormats.length > 0) {
      parts.push('\n# 输出格式')
      config.outputFormats.forEach((f, index) => {
        parts.push(`\n${index + 1}. ${f.description}`)
        if (f.example) {
          parts.push(`   示例：\n   ${f.example.split('\n').join('\n   ')}`)
        }
      })
    }

    if (config.additionalInstructions) {
      parts.push(`\n# 额外说明\n${config.additionalInstructions}`)
    }

    return parts.join('\n')
  }, [config])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetConfig = () => {
    setConfig({
      role: '',
      expertise: '',
      task: '',
      audience: '',
      tone: '',
      constraints: [],
      outputFormats: [],
      additionalInstructions: ''
    })
  }

  const getTypeColor = (type: Constraint['type']) => {
    const colors = {
      prohibited: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      required: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      format: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
    return colors[type]
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">System Prompt 生成器</h1>
        <p className="text-slate-600 dark:text-slate-400">
          快速构建专业的 AI 系统提示词
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-sky-500" />
              角色设定
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  快捷角色模板
                </label>
                <div className="flex flex-wrap gap-2">
                  {roleTemplates.map((template) => (
                    <button
                      key={template.value}
                      onClick={() => applyRoleTemplate(template)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                        config.role === template.role
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  角色描述
                </label>
                <textarea
                  value={config.role}
                  onChange={(e) => updateConfig('role', e.target.value)}
                  placeholder="描述 AI 的角色身份，如：你是一位经验丰富的软件工程师，精通多种编程语言..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  专业领域
                </label>
                <input
                  type="text"
                  value={config.expertise}
                  onChange={(e) => updateConfig('expertise', e.target.value)}
                  placeholder="如：Web 开发、数据分析、内容创作"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  主要任务
                </label>
                <textarea
                  value={config.task}
                  onChange={(e) => updateConfig('task', e.target.value)}
                  placeholder="描述 AI 的主要职责和任务"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  目标受众
                </label>
                <input
                  type="text"
                  value={config.audience}
                  onChange={(e) => updateConfig('audience', e.target.value)}
                  placeholder="如：初学者、技术专业人士、普通用户"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  回答语气
                </label>
                <select
                  value={config.tone}
                  onChange={(e) => updateConfig('tone', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  {toneOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-sky-500" />
                约束条件
              </h2>
              <div className="flex gap-2">
                <Button onClick={addConstraint} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                快捷预设
              </label>
              <div className="flex flex-wrap gap-2">
                {constraintPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyConstraintPreset(preset)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {config.constraints.length === 0 ? (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                  暂无约束条件，点击添加或选择预设
                </div>
              ) : (
                config.constraints.map((constraint) => (
                  <div
                    key={constraint.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <select
                        value={constraint.type}
                        onChange={(e) => updateConstraint(constraint.id, 'type', e.target.value as Constraint['type'])}
                        className={`px-2 py-1 rounded border text-xs font-medium ${getTypeColor(constraint.type)}`}
                      >
                        <option value="prohibited">禁止</option>
                        <option value="required">必须</option>
                        <option value="format">格式</option>
                      </select>
                      <button
                        onClick={() => removeConstraint(constraint.id)}
                        className="p-1 text-slate-400 hover:text-red-500 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={constraint.content}
                      onChange={(e) => updateConstraint(constraint.id, 'content', e.target.value)}
                      placeholder="输入约束条件描述"
                      rows={2}
                      className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                    />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" />
                输出格式
              </h2>
              <div className="flex gap-2">
                <Button onClick={addOutputFormat} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  添加
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                快捷预设
              </label>
              <div className="flex flex-wrap gap-2">
                {outputFormatPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyOutputFormatPreset(preset)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {config.outputFormats.length === 0 ? (
                <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-sm">
                  暂无输出格式，点击添加或选择预设
                </div>
              ) : (
                config.outputFormats.map((format) => (
                  <div
                    key={format.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">格式 #{config.outputFormats.indexOf(format) + 1}</span>
                      <button
                        onClick={() => removeOutputFormat(format.id)}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={format.description}
                      onChange={(e) => updateOutputFormat(format.id, 'description', e.target.value)}
                      placeholder="格式描述"
                      className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 mb-2"
                    />
                    <textarea
                      value={format.example}
                      onChange={(e) => updateOutputFormat(format.id, 'example', e.target.value)}
                      placeholder="示例（可选）"
                      rows={2}
                      className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none font-mono text-xs"
                    />
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">额外说明</h2>
            <textarea
              value={config.additionalInstructions}
              onChange={(e) => updateConfig('additionalInstructions', e.target.value)}
              placeholder="添加任何额外的说明或注意事项"
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" />
                生成的 System Prompt
              </h2>
              <div className="flex gap-2">
                <Button onClick={resetConfig} size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  重置
                </Button>
                <Button
                  onClick={() => copyToClipboard(generatedPrompt)}
                  size="sm"
                  variant="outline"
                  disabled={!generatedPrompt}
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 min-h-96 max-h-[600px] overflow-y-auto">
              {generatedPrompt ? (
                <pre className="text-sm text-slate-100 whitespace-pre-wrap font-mono break-words">{generatedPrompt}</pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                  <Sparkles className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm">填写左侧信息开始生成</p>
                </div>
              )}
            </div>

            {generatedPrompt && (
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                <div>字符数：{generatedPrompt.length}</div>
                <div>行数：{generatedPrompt.split('\n').length}</div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用提示</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>清晰的约束条件能显著提升 AI 输出的质量！
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>使用快捷预设可以快速开始</li>
                <li>约束条件分为禁止、必须、格式三类</li>
                <li>输出格式示例能帮助 AI 理解期望</li>
                <li>系统提示词越长，Token 消耗越多</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
