import { useState } from 'react'
import { Code2, Copy, Check, Trash2, Minimize, Maximize, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format as formatSQL } from 'sql-formatter'

type Language = 'javascript' | 'json' | 'html' | 'css' | 'xml' | 'java' | 'sql'

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: 'JavaScript',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  xml: 'XML',
  java: 'Java',
  sql: 'SQL',
}

export function CodeFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [language, setLanguage] = useState<Language>('javascript')
  const [copied, setCopied] = useState(false)

  const formatJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code)
      return JSON.stringify(parsed, null, 4)
    } catch {
      return code
    }
  }

  const minifyJSON = (code: string): string => {
    try {
      const parsed = JSON.parse(code)
      return JSON.stringify(parsed)
    } catch {
      return code
    }
  }

  const formatJavaScript = (code: string): string => {
    let formatted = code

    formatted = formatted.replace(/([a-zA-Z0-9_)])([+\-*/%=<>!&|^~]+)/g, '$1 $2')
    formatted = formatted.replace(/([+\-*/%=<>!&|^~]+)([a-zA-Z0-9_(])/g, '$1 $2')
    formatted = formatted.replace(/\s+/g, ' ')
    formatted = formatted.replace(/\s*([{};,])\s*/g, ' $1 ')

    const tokens = formatted.split(/([{};,])/)
    const result: string[] = []
    let currentLine = ''
    let indentLevel = 0
    const indentSize = 4

    const flushLine = () => {
      if (currentLine.trim()) {
        result.push(' '.repeat(indentLevel * indentSize) + currentLine.trim())
      }
      currentLine = ''
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim()
      if (!token) continue

      if (token === '{') {
        const isClassOrFunction = /class|function|=>/.test(currentLine)
        currentLine += ' {'
        flushLine()
        indentLevel++
        if (isClassOrFunction) {
          result.push('')
        }
      } else if (token === '}') {
        if (currentLine.trim()) {
          flushLine()
        }
        indentLevel = Math.max(0, indentLevel - 1)
        result.push(' '.repeat(indentLevel * indentSize) + '}')
        if (indentLevel >= 1) {
          result.push('')
        }
      } else if (token === ';') {
        currentLine += token
        flushLine()
        if (indentLevel === 1) {
          result.push('')
        }
      } else if (token === ',') {
        currentLine += token
      } else {
        if (currentLine && !currentLine.endsWith(' ')) {
          currentLine += ' '
        }
        currentLine += token
      }
    }

    if (currentLine.trim()) {
      flushLine()
    }

    return result.join('\n')
  }

  const minifyJavaScript = (code: string): string => {
    return code
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};,:])\s*/g, '$1')
      .replace(/;\s*}/g, '}')
      .trim()
  }

  const formatHTML = (code: string): string => {
    const tokens = code.match(/<[^>]+>|[^<]+/g) || []
    const result: string[] = []
    let i = 0

    while (i < tokens.length) {
      const token = tokens[i].trim()
      if (!token) {
        i++
        continue
      }

      if (token.startsWith('</')) {
        result.push(token)
        i++
      } else if (token.startsWith('<') && !token.endsWith('/>')) {
        const tagName = token.match(/<(\w+)/)?.[1] || ''
        const closingTag = `</${tagName}>`
        let content = ''
        let j = i + 1
        let hasChildTags = false
        let depth = 1

        while (j < tokens.length && depth > 0) {
          const nextToken = tokens[j].trim()
          if (nextToken === closingTag) {
            break
          }
          if (nextToken.startsWith('</')) {
            depth--
          } else if (nextToken.startsWith('<')) {
            hasChildTags = true
            if (!nextToken.endsWith('/>')) {
              depth++
            }
          }
          content += nextToken
          j++
        }

        if (!hasChildTags && content.trim()) {
          result.push(token + content + closingTag)
          i = j + 1
        } else {
          result.push(token)
          i++
        }
      } else {
        result.push(token)
        i++
      }
    }

    let indent = 0
    const indentSize = 4
    const finalResult: string[] = []

    for (let line of result) {
      line = line.trim()
      if (!line) continue

      if (line.startsWith('</')) {
        indent = Math.max(0, indent - 1)
        finalResult.push(' '.repeat(indent * indentSize) + line)
      } else if (line.startsWith('<')) {
        if (line.endsWith('/>') || line.includes('</')) {
          finalResult.push(' '.repeat(indent * indentSize) + line)
        } else {
          finalResult.push(' '.repeat(indent * indentSize) + line)
          indent++
        }
      } else {
        finalResult.push(' '.repeat(indent * indentSize) + line)
      }
    }

    return finalResult.join('\n')
  }

  const minifyHTML = (code: string): string => {
    return code
      .replace(/\s+</g, '<')
      .replace(/>\s+/g, '>')
      .replace(/<!--.*?-->/g, '')
      .trim()
  }

  const formatCSS = (code: string): string => {
    let formatted = code
    formatted = formatted.replace(/\s*{\s*/g, ' {\n    ')
    formatted = formatted.replace(/;\s*/g, ';\n    ')
    formatted = formatted.replace(/\s*}\s*/g, '\n}\n')
    formatted = formatted.replace(/\n\s*\n/g, '\n')
    return formatted.trim()
  }

  const minifyCSS = (code: string): string => {
    return code
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};:,])\s*/g, '$1')
      .trim()
  }

  const formatXML = (code: string): string => {
    let formatted = code
    let xmlDeclaration = ''

    const declarationMatch = formatted.match(/^(\s*<\?xml[^?]*\?>)/)
    if (declarationMatch) {
      xmlDeclaration = declarationMatch[1]
      formatted = formatted.slice(declarationMatch[1].length)
    }

    const tokens = formatted.match(/<[^>]+>|[^<]+/g) || []
    const result: string[] = []
    let i = 0

    while (i < tokens.length) {
      const token = tokens[i].trim()
      if (!token) {
        i++
        continue
      }

      if (token.startsWith('</')) {
        result.push(token)
        i++
      } else if (token.startsWith('<') && !token.endsWith('/>')) {
        const tagName = token.match(/<(\w+)/)?.[1] || ''
        const closingTag = `</${tagName}>`
        let content = ''
        let j = i + 1
        let hasChildTags = false
        let depth = 1

        while (j < tokens.length && depth > 0) {
          const nextToken = tokens[j].trim()
          if (nextToken === closingTag) {
            break
          }
          if (nextToken.startsWith('</')) {
            depth--
          } else if (nextToken.startsWith('<')) {
            hasChildTags = true
            if (!nextToken.endsWith('/>')) {
              depth++
            }
          }
          content += nextToken
          j++
        }

        if (!hasChildTags && content.trim()) {
          result.push(token + content + closingTag)
          i = j + 1
        } else {
          result.push(token)
          i++
        }
      } else {
        result.push(token)
        i++
      }
    }

    let indent = 0
    const indentSize = 4
    const finalResult: string[] = []

    for (let line of result) {
      line = line.trim()
      if (!line) continue

      if (line.startsWith('</')) {
        indent = Math.max(0, indent - 1)
        finalResult.push(' '.repeat(indent * indentSize) + line)
      } else if (line.startsWith('<')) {
        if (line.endsWith('/>') || line.includes('</')) {
          finalResult.push(' '.repeat(indent * indentSize) + line)
        } else {
          finalResult.push(' '.repeat(indent * indentSize) + line)
          indent++
        }
      } else {
        finalResult.push(' '.repeat(indent * indentSize) + line)
      }
    }

    const body = finalResult.join('\n')
    return xmlDeclaration + (xmlDeclaration && body ? '\n' : '') + body
  }

  const minifyXML = (code: string): string => {
    return minifyHTML(code)
  }

  const formatJava = (code: string): string => {
    let formatted = code

    formatted = formatted.replace(/([a-zA-Z0-9_)])([+\-*/%=<>!&|^~]+)/g, '$1 $2')
    formatted = formatted.replace(/([+\-*/%=<>!&|^~]+)([a-zA-Z0-9_(])/g, '$1 $2')
    formatted = formatted.replace(/\s+/g, ' ')
    formatted = formatted.replace(/\s*([{};,])\s*/g, ' $1 ')

    const tokens = formatted.split(/([{};,])/)
    const result: string[] = []
    let currentLine = ''
    let indentLevel = 0
    const indentSize = 4

    const flushLine = () => {
      if (currentLine.trim()) {
        result.push(' '.repeat(indentLevel * indentSize) + currentLine.trim())
      }
      currentLine = ''
    }

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim()
      if (!token) continue

      if (token === '{') {
        const isClassOrInterface = /class|interface/.test(currentLine)
        currentLine += ' {'
        flushLine()
        indentLevel++
        if (isClassOrInterface) {
          result.push('')
        }
      } else if (token === '}') {
        if (currentLine.trim()) {
          flushLine()
        }
        indentLevel = Math.max(0, indentLevel - 1)
        result.push(' '.repeat(indentLevel * indentSize) + '}')
        if (indentLevel >= 1) {
          result.push('')
        }
      } else if (token === ';') {
        currentLine += token
        flushLine()
        if (indentLevel === 1) {
          result.push('')
        }
      } else if (token === ',') {
        currentLine += token
      } else {
        if (currentLine && !currentLine.endsWith(' ')) {
          currentLine += ' '
        }
        currentLine += token
      }
    }

    if (currentLine.trim()) {
      flushLine()
    }

    return result.join('\n')
  }

  const minifyJava = (code: string): string => {
    return code
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};,:()])\s*/g, '$1')
      .replace(/;\s*}/g, '}')
      .replace(/\/\*.*?\*\//g, '')
      .trim()
  }

  const formatSQLCode = (code: string): string => {
    try {
      return formatSQL(code, {
        language: 'sql',
        tabWidth: 4,
        keywordCase: 'upper',
        functionCase: 'upper',
        indentStyle: 'standard',
        logicalOperatorNewline: 'before',
      })
    } catch {
      return code
    }
  }

  const minifySQL = (code: string): string => {
    return code
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s*([(),])\s*/g, '$1')
      .trim()
  }

  const format = () => {
    if (!input.trim()) return

    let result = ''
    switch (language) {
      case 'json':
        result = formatJSON(input)
        break
      case 'javascript':
        result = formatJavaScript(input)
        break
      case 'html':
        result = formatHTML(input)
        break
      case 'css':
        result = formatCSS(input)
        break
      case 'xml':
        result = formatXML(input)
        break
      case 'java':
        result = formatJava(input)
        break
      case 'sql':
        result = formatSQLCode(input)
        break
    }
    setOutput(result)
  }

  const minify = () => {
    if (!input.trim()) return

    let result = ''
    switch (language) {
      case 'json':
        result = minifyJSON(input)
        break
      case 'javascript':
        result = minifyJavaScript(input)
        break
      case 'html':
        result = minifyHTML(input)
        break
      case 'css':
        result = minifyCSS(input)
        break
      case 'xml':
        result = minifyXML(input)
        break
      case 'java':
        result = minifyJava(input)
        break
      case 'sql':
        result = minifySQL(input)
        break
    }
    setOutput(result)
  }

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  const loadSample = () => {
    const samples: Record<Language, string> = {
      javascript: `class Calculator{constructor(){this.result=0}add(n){this.result+=n;return this}multiply(n){this.result*=n;return this}getResult(){return this.result}}const calc=new Calculator();console.log(calc.add(5).multiply(3).getResult());`,
      json: '{"name":"开发者工具","version":"1.0.0","features":["格式化","压缩","转换"],"settings":{"theme":"dark","autoSave":true,"maxSize":1024},"active":true}',
      html: '<div class="container"><header><h1>开发者工具</h1><nav><ul><li>首页</li><li>文档</li><li>关于</li></ul></nav></header><main><section class="features"><h2>功能特性</h2><p>强大的代码处理工具</p></section></main></div>',
      css: '.container{width:100%;max-width:1200px;margin:0 auto;padding:20px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}.btn{padding:12px 24px;background:#007bff;color:#fff;border:none;border-radius:4px;cursor:pointer}',
      xml: '<?xml version="1.0" encoding="UTF-8"?><config><app name="devtools" version="2.0"><features><feature id="fmt">代码格式化</feature><feature id="min">代码压缩</feature></features><settings><theme>dark</theme><autosave>true</autosave></settings></app></config>',
      java: `public class Calculator{private int result;public Calculator(){this.result=0;}public int add(int a,int b){return a+b;}public int multiply(int a,int b){return a*b;}public static void main(String[] args){Calculator calc=new Calculator();int sum=calc.add(10,5);int product=calc.multiply(10,5);System.out.println("Sum: "+sum);System.out.println("Product: "+product);}}`,
      sql: `select u.id,u.name,u.email,count(o.id) as order_count,sum(o.total_amount) as total_spent from users u left join orders o on u.id=o.user_id where u.created_at>'2024-01-01' and u.status='active' group by u.id,u.name,u.email having count(o.id)>5 order by total_spent desc limit 10`,
    }
    setInput(samples[language])
  }

  const swapInputOutput = () => {
    if (output) {
      setInput(output)
      setOutput('')
    }
  }

  const getStats = () => {
    const inputLines = input.split('\n').length
    const outputLines = output.split('\n').length
    const inputSize = new Blob([input]).size
    const outputSize = new Blob([output]).size
    const compression = inputSize > 0 ? Math.round(((inputSize - outputSize) / inputSize) * 100) : 0

    return { inputLines, outputLines, inputSize, outputSize, compression }
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<Code2 className="h-8 w-8" />}
        title="代码格式化"
        description="代码美化、压缩和格式转换，支持多种编程语言"
      />

      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-sky-500" />
              格式化设置
            </span>
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm"
              >
                {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm" onClick={loadSample}>
                示例
              </Button>
              <Button variant="outline" size="sm" onClick={swapInputOutput} disabled={!output}>
                <RefreshCw className="h-4 w-4 mr-1" />
                交换
              </Button>
              <Button variant="outline" size="sm" onClick={clearAll} disabled={!input}>
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 操作按钮 */}
          <div className="flex items-center justify-center gap-4">
            <Button onClick={format} disabled={!input} className="flex items-center gap-2">
              <Maximize className="h-4 w-4" />
              美化格式
            </Button>
            <Button onClick={minify} disabled={!input} variant="outline" className="flex items-center gap-2">
              <Minimize className="h-4 w-4" />
              压缩代码
            </Button>
          </div>

          {/* 统计信息 */}
          {output && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">输入行数</div>
                <div className="font-medium text-slate-800 dark:text-slate-200">{stats.inputLines}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">输出行数</div>
                <div className="font-medium text-slate-800 dark:text-slate-200">{stats.outputLines}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">输入大小</div>
                <div className="font-medium text-slate-800 dark:text-slate-200">{formatSize(stats.inputSize)}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">输出大小</div>
                <div className="font-medium text-slate-800 dark:text-slate-200">{formatSize(stats.outputSize)}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">压缩率</div>
                <div className={`font-medium ${stats.compression > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.compression > 0 ? '-' : '+'}{Math.abs(stats.compression)}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              输入代码 ({LANGUAGE_LABELS[language]})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`在此输入 ${LANGUAGE_LABELS[language]} 代码...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[400px] font-mono text-sm resize-y"
            />
            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>字符数: {input.length.toLocaleString()}</span>
              <span>行数: {input.split('\n').length}</span>
            </div>
          </CardContent>
        </Card>

        {/* 输出区域 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-sm font-medium">
              <span className="text-slate-600 dark:text-slate-400">格式化结果</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOutput}
                disabled={!output}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="格式化后的代码将显示在这里..."
              value={output}
              readOnly
              className="min-h-[400px] font-mono text-sm resize-y bg-slate-50 dark:bg-slate-900"
            />
            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>字符数: {output.length.toLocaleString()}</span>
              <span>行数: {output.split('\n').length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>• <strong>美化格式</strong>：自动缩进和换行，提升代码可读性</p>
          <p>• <strong>压缩代码</strong>：去除空格和换行，减小文件体积</p>
          <p>• <strong>支持语言</strong>：JavaScript、JSON、HTML、CSS、XML、Java、SQL</p>
          <p>• <strong>缩进设置</strong>：统一使用 4 个空格缩进</p>
          <p>• <strong>交换</strong>：将输出结果作为输入继续处理</p>
          <p>• <strong>统计</strong>：显示行数、大小和压缩率</p>
        </CardContent>
      </Card>
    </div>
  )
}
