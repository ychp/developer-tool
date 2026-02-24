import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Code2, Copy, Check, Trash2, FileCode, Undo, Redo, FlaskConical } from 'lucide-react'
import { useUndoRedo } from '@/hooks/useUndoRedo'

interface XmlNode {
  tag: string
  attributes?: Record<string, string>
  children?: XmlNode[]
  text?: string
  isSelfClosing: boolean
}

export function XmlFormatter() {
  const { value: input, setValue: setInput, undo, redo, canUndo, canRedo, reset } = useUndoRedo()
  const [parsedXml, setParsedXml] = useState<XmlNode | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [indent, setIndent] = useState(2)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  const parseXml = (xmlString: string): XmlNode | null => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
      
      const parseNode = (element: Element): XmlNode => {
        const node: XmlNode = {
          tag: element.tagName,
          isSelfClosing: false
        }

        if (element.attributes.length > 0) {
          node.attributes = {}
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i]
            node.attributes[attr.name] = attr.value
          }
        }

        if (element.childNodes.length > 0) {
          node.children = []
          element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              node.children!.push(parseNode(child as Element))
            } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
              if (!node.children) node.children = []
              if (child.textContent) {
                node.text = child.textContent.trim()
              }
            }
          })
        }

        return node
      }

      const rootElement = xmlDoc.documentElement
      if (rootElement.nodeName === 'parsererror') {
        return null
      }

      return parseNode(rootElement)
    } catch {
      return null
    }
  }

  const formatXml = (compress = false) => {
    setError('')
    if (!input.trim()) {
      setParsedXml(null)
      return
    }

    try {
      let formatted = input.trim()
      const spaces = ' '.repeat(indent)

      if (compress) {
        formatted = formatted
          .replace(/\s+</g, '<')
          .replace(/>\s+/g, '>')
      } else {
        formatted = formatted
          .replace(/>\s*</g, '>\n<')
          .replace(/</g, '\n<')
          .replace(/^(\n)+/, '')
        
        const lines = formatted.split('\n')
        let indentLevel = 0
        const result: string[] = []
        
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue
          
          if (trimmed.match(/^\<\/\w/)) {
            indentLevel = Math.max(0, indentLevel - 1)
          }
          
          result.push(spaces.repeat(indentLevel) + trimmed)
          
          if (trimmed.match(/^\<\w[^>]*[^\/]\>.*$/) && !trimmed.match(/\<\/\w/)) {
            indentLevel++
          }
        }
        
        formatted = result.join('\n')
      }

      setInput(formatted)
      
      const parsed = parseXml(formatted)
      if (parsed) {
        setParsedXml(parsed)
        setError('')
      } else {
        setError('XML 解析失败：请检查语法')
        setParsedXml(null)
      }
    } catch {
      setError('格式化失败：请检查 XML 语法')
      setParsedXml(null)
    }
  }

  const minify = () => formatXml(true)

  const copyToClipboard = async () => {
    if (input) {
      await navigator.clipboard.writeText(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clear = () => {
    reset('')
    setParsedXml(null)
    setError('')
  }

  const loadTestData = () => {
    const testData = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <application>
    <name>开发者工具箱</name>
    <version>1.0.0</version>
    <description>一个现代化的在线开发者工具箱</description>
  </application>
  <features>
    <feature id="1" category="format">JSON 格式化</feature>
    <feature id="2" category="format">XML 格式化</feature>
    <feature id="3" category="encode">Base64 编解码</feature>
    <feature id="4" category="encode">URL 编解码</feature>
    <feature id="5" category="text">正则测试</feature>
    <feature id="6" category="text">文本对比</feature>
  </features>
  <settings>
    <theme>light</theme>
    <language>zh-CN</language>
    <autoSave>true</autoSave>
    <maxHistory>50</maxHistory>
  </settings>
  <author>
    <name>ychp</name>
    <email>example@email.com</email>
    <github>https://github.com/ychp</github>
  </author>
  <tags>
    <tag>工具</tag>
    <tag>开发者</tag>
    <tag>Web</tag>
    <tag>React</tag>
    <tag>TypeScript</tag>
  </tags>
</root>`
    setInput(testData)
    const parsed = parseXml(testData)
    if (parsed) {
      setParsedXml(parsed)
      setError('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Code2 className="h-8 w-8" />
          XML 格式化
        </h1>
        <p className="text-muted-foreground">
          格式化、压缩和美化 XML 数据
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>XML 编辑器</CardTitle>
            <CardDescription>
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                '输入或粘贴 XML 数据，点击格式化后结果将覆盖此处'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 items-center justify-end pb-2 border-b">
              <span className="text-xs text-muted-foreground">
                快捷键: Ctrl+Z 撤销 / Ctrl+Shift+Z 或 Ctrl+Y 重做
              </span>
              <Button onClick={undo} disabled={!canUndo} variant="outline" size="sm">
                <Undo className="h-4 w-4 mr-1" />
                撤销
              </Button>
              <Button onClick={redo} disabled={!canRedo} variant="outline" size="sm">
                <Redo className="h-4 w-4 mr-1" />
                重做
              </Button>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="<root><item>value</item></root>"
              className="min-h-[500px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={() => formatXml()} className="flex-1">
                格式化
              </Button>
              <Button onClick={minify} variant="outline" className="flex-1">
                压缩
              </Button>
              <Button onClick={loadTestData} variant="secondary" size="sm">
                <FlaskConical className="h-4 w-4 mr-1" />
                测试
              </Button>
              <Button onClick={clear} variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">缩进空格:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="rounded border border-input bg-background px-2 py-1 text-sm"
              >
                <option value={2}>2</option>
                <option value={4}>4</option>
              </select>
            </div>
            <Button
              onClick={copyToClipboard}
              disabled={!input}
              className="w-full"
              variant={copied ? "outline" : "default"}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制 XML
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              结构视图
            </CardTitle>
            <CardDescription>
              {parsedXml && !error ? (
                <span>查看 XML 的层级结构</span>
              ) : (
                <span className="text-muted-foreground">格式化后将在此显示结构视图</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-input p-4 min-h-[500px] max-h-[600px] overflow-auto">
              {parsedXml && !error ? (
                <XmlTreeNode node={parsedXml} />
              ) : (
                <div className="flex items-center justify-center h-full min-h-[450px] text-muted-foreground">
                  <div className="text-center">
                    <FileCode className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p>暂无数据</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface XmlTreeNodeProps {
  node: XmlNode
}

function XmlTreeNode({ node }: XmlTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = node.children && node.children.length > 0

  return (
    <div className="font-mono text-sm">
      <div 
        className="hover:bg-muted/50 rounded cursor-pointer py-1 px-2 -ml-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-2">
          {hasChildren && (
            <span className="flex items-center text-gray-500 mt-0.5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="w-4" />}
          
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">&lt;{node.tag}&gt;</span>
              
              {node.attributes && Object.keys(node.attributes).length > 0 && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                  {Object.keys(node.attributes).length} 个属性
                </span>
              )}
              
              {node.text && !hasChildren && (
                <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                  文本内容
                </span>
              )}
            </div>
            
            {node.attributes && Object.keys(node.attributes).length > 0 && (
              <div className="ml-4 space-y-0.5">
                {Object.entries(node.attributes).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">@{key}</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-green-600 dark:text-green-400">"{value}"</span>
                  </div>
                ))}
              </div>
            )}
            
            {node.text && !hasChildren && (
              <div className="ml-4 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                {node.text}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="border-l border-gray-200 dark:border-gray-700 ml-1 pl-4">
          {node.children!.map((child, index) => (
            <XmlTreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}
