import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Link2, Copy, Check, Trash2, ArrowLeftRight } from 'lucide-react'

export function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [copied, setCopied] = useState(false)

  const process = () => {
    setCopied(false)
    if (mode === 'encode') {
      setOutput(encodeURIComponent(input))
    } else {
      try {
        setOutput(decodeURIComponent(input))
      } catch (err) {
        setOutput('解码失败：无效的 URL 编码')
      }
    }
  }

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
    setCopied(false)
  }

  const swap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput('')
    setCopied(false)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Link2 className="h-8 w-8" />
          URL 编解码
        </h1>
        <p className="text-muted-foreground">
          URL 编码和解码工具，处理 URL 中的特殊字符
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>模式</CardTitle>
              <CardDescription>选择编码或解码</CardDescription>
            </div>
            <Button
              onClick={swap}
              variant="outline"
              size="icon"
              title="切换输入输出"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={() => setMode('encode')}
              variant={mode === 'encode' ? 'default' : 'outline'}
              className="flex-1"
            >
              编码
            </Button>
            <Button
              onClick={() => setMode('decode')}
              variant={mode === 'decode' ? 'default' : 'outline'}
              className="flex-1"
            >
              解码
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>输入</CardTitle>
            <CardDescription>
              {mode === 'encode' ? '输入要编码的 URL/文本' : '输入要解码的 URL'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'https://example.com/?query=测试' : 'https://example.com/?query=%E6%B5%8B%E8%AF%95'}
              className="min-h-[200px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={process} className="flex-1">
                {mode === 'encode' ? '编码' : '解码'}
              </Button>
              <Button onClick={clear} variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>输出</CardTitle>
            <CardDescription>
              {mode === 'encode' ? 'URL 编码结果' : '解码后的 URL'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={output}
              readOnly
              placeholder="结果将显示在这里..."
              className="min-h-[200px] font-mono text-sm"
            />
            <Button
              onClick={copyToClipboard}
              disabled={!output}
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
                  复制结果
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
