import { useState } from 'react'
import { Code2, Plus, Trash2, Copy, Check, ChevronDown, ChevronUp, FileJson, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Parameter {
  id: string
  name: string
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
  description: string
  required: boolean
  enumValues: string
  nestedParams?: Parameter[]
}

interface FunctionSchema {
  name: string
  description: string
  parameters: Parameter[]
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const createDefaultParameter = (): Parameter => ({
  id: generateId(),
  name: '',
  type: 'string',
  description: '',
  required: true,
  enumValues: '',
  nestedParams: []
})

const inferType = (value: unknown): Parameter['type'] => {
  if (typeof value === 'string') return 'string'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number'
  }
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object' && value !== null) return 'object'
  return 'string'
}

const parseJsonToParameters = (obj: Record<string, unknown>): Parameter[] => {
  return Object.entries(obj).map(([key, value]) => {
    const type = inferType(value)
    const param: Parameter = {
      id: generateId(),
      name: key,
      type,
      description: '',
      required: true,
      enumValues: '',
      nestedParams: []
    }

    if (type === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      param.nestedParams = parseJsonToParameters(value as Record<string, unknown>)
    }

    return param
  })
}

export function FunctionCallingGenerator() {
  const [schema, setSchema] = useState<FunctionSchema>({
    name: 'get_weather',
    description: '获取指定城市的天气信息',
    parameters: [
      {
        id: generateId(),
        name: 'city',
        type: 'string',
        description: '城市名称，如：北京、上海',
        required: true,
        enumValues: ''
      },
      {
        id: generateId(),
        name: 'unit',
        type: 'string',
        description: '温度单位',
        required: false,
        enumValues: 'celsius,fahrenheit'
      }
    ]
  })
  const [copied, setCopied] = useState(false)
  const [expandedParams, setExpandedParams] = useState<Set<string>>(new Set())
  const [jsonInput, setJsonInput] = useState('')
  const [jsonError, setJsonError] = useState('')

  const addParameter = () => {
    setSchema(prev => ({
      ...prev,
      parameters: [...prev.parameters, createDefaultParameter()]
    }))
  }

  const updateParameter = (id: string, field: keyof Parameter, value: string | boolean) => {
    setSchema(prev => ({
      ...prev,
      parameters: prev.parameters.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    }))
  }

  const removeParameter = (id: string) => {
    setSchema(prev => ({
      ...prev,
      parameters: prev.parameters.filter(p => p.id !== id)
    }))
  }

  const toggleExpanded = (id: string) => {
    setExpandedParams(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const parseJsonInput = () => {
    if (!jsonInput.trim()) {
      setJsonError('请输入 JSON 数据')
      return
    }

    try {
      const parsed = JSON.parse(jsonInput)
      
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setJsonError('请输入一个有效的 JSON 对象')
        return
      }

      const parameters = parseJsonToParameters(parsed)
      setSchema(prev => ({
        ...prev,
        parameters
      }))
      setJsonError('')
      setJsonInput('')
    } catch (e) {
      setJsonError('JSON 格式错误，请检查输入')
    }
  }

  const generateJSONSchema = () => {
    const properties: Record<string, unknown> = {}
    const required: string[] = []

    schema.parameters.forEach(param => {
      const prop: Record<string, unknown> = {
        type: param.type,
        description: param.description
      }

      if (param.enumValues && param.type === 'string') {
        prop.enum = param.enumValues.split(',').map(v => v.trim()).filter(Boolean)
      }

      if (param.type === 'array') {
        prop.items = { type: 'string' }
      }

      if (param.type === 'object' && param.nestedParams && param.nestedParams.length > 0) {
        const nestedProps: Record<string, unknown> = {}
        param.nestedParams.forEach(np => {
          nestedProps[np.name] = {
            type: np.type,
            description: np.description
          }
        })
        prop.properties = nestedProps
      }

      properties[param.name] = prop

      if (param.required) {
        required.push(param.name)
      }
    })

    return {
      name: schema.name,
      description: schema.description,
      parameters: {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined
      }
    }
  }

  const generateClaudeSchema = () => {
    const properties: Record<string, unknown> = {}
    const required: string[] = []

    schema.parameters.forEach(param => {
      const prop: Record<string, unknown> = {
        type: param.type,
        description: param.description
      }

      if (param.enumValues && param.type === 'string') {
        prop.enum = param.enumValues.split(',').map(v => v.trim()).filter(Boolean)
      }

      properties[param.name] = prop

      if (param.required) {
        required.push(param.name)
      }
    })

    return {
      name: schema.name,
      description: schema.description,
      input_schema: {
        type: 'object',
        properties,
        required: required.length > 0 ? required : undefined
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const jsonSchema = generateJSONSchema()
  const claudeSchema = generateClaudeSchema()

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Function Calling 生成器</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          可视化生成 OpenAI / Claude Function Calling JSON Schema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileJson className="w-5 h-5 text-sky-500" />
              JSON 实例导入
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              粘贴 JSON 示例数据，自动生成参数列表
            </p>
            <div className="space-y-3">
              <textarea
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value)
                  setJsonError('')
                }}
                placeholder={`{
  "city": "北京",
  "unit": "celsius",
  "days": 3
}`}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm resize-none"
              />
              {jsonError && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  {jsonError}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={parseJsonInput} className="flex-1">
                  解析 JSON
                </Button>
                <Button 
                  onClick={() => {
                    setJsonInput('')
                    setJsonError('')
                  }} 
                  variant="outline"
                >
                  清空
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-sky-500" />
              函数定义
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  函数名称
                </label>
                <input
                  type="text"
                  value={schema.name}
                  onChange={(e) => setSchema(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例如: get_weather"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  函数描述
                </label>
                <textarea
                  value={schema.description}
                  onChange={(e) => setSchema(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述函数的功能和用途"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                />
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    参数列表
                  </label>
                  <Button onClick={addParameter} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    添加参数
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto sidebar-scrollbar">
                  {schema.parameters.map((param, index) => (
                    <div
                      key={param.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 w-6">
                          #{index + 1}
                        </span>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={param.name}
                            onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                            placeholder="参数名"
                            className="px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                          <select
                            value={param.type}
                            onChange={(e) => updateParameter(param.id, 'type', e.target.value)}
                            className="px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="string">string</option>
                            <option value="number">number</option>
                            <option value="integer">integer</option>
                            <option value="boolean">boolean</option>
                            <option value="array">array</option>
                            <option value="object">object</option>
                          </select>
                        </div>
                        <button
                          onClick={() => toggleExpanded(param.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {expandedParams.has(param.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => removeParameter(param.id)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {(expandedParams.has(param.id) || !param.description) && (
                        <div className="ml-8 space-y-2">
                          <input
                            type="text"
                            value={param.description}
                            onChange={(e) => updateParameter(param.id, 'description', e.target.value)}
                            placeholder="参数描述"
                            className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />

                          {param.type === 'string' && (
                            <input
                              type="text"
                              value={param.enumValues}
                              onChange={(e) => updateParameter(param.id, 'enumValues', e.target.value)}
                              placeholder="枚举值（逗号分隔，如：celsius,fahrenheit）"
                              className="w-full px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          )}

                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={param.required}
                              onChange={(e) => updateParameter(param.id, 'required', e.target.checked)}
                              className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                            />
                            <span className="text-slate-600 dark:text-slate-400">必填参数</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}

                  {schema.parameters.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                      暂无参数，点击上方按钮添加或导入 JSON 实例
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                OpenAI 格式
              </h2>
              <Button
                onClick={() => copyToClipboard(JSON.stringify(jsonSchema, null, 2))}
                size="sm"
                variant="outline"
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? '已复制' : '复制'}
              </Button>
            </div>
            <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto font-mono max-h-64 overflow-y-auto">
              {JSON.stringify(jsonSchema, null, 2)}
            </pre>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                Claude 格式
              </h2>
              <Button
                onClick={() => copyToClipboard(JSON.stringify(claudeSchema, null, 2))}
                size="sm"
                variant="outline"
              >
                {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                {copied ? '已复制' : '复制'}
              </Button>
            </div>
            <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-sm overflow-x-auto font-mono max-h-64 overflow-y-auto">
              {JSON.stringify(claudeSchema, null, 2)}
            </pre>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用说明</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>粘贴 JSON 示例数据可自动生成参数列表，大幅提升效率！
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">类型推断规则</h3>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>字符串值 → string 类型</li>
                  <li>整数 → integer 类型</li>
                  <li>浮点数 → number 类型</li>
                  <li>布尔值 → boolean 类型</li>
                  <li>数组 → array 类型</li>
                  <li>对象 → object 类型（支持嵌套）</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">OpenAI 调用示例</h3>
                <pre className="p-3 rounded bg-slate-100 dark:bg-slate-800 text-xs overflow-x-auto font-mono">
{`const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "..." }],
  tools: [{
    type: "function",
    function: ${JSON.stringify(jsonSchema, null, 4)}
  }]
});`}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
