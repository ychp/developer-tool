import { useState } from 'react'
import { Link2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { CopyButton } from '@/components/tool/CopyButton'
import { EncodeDecodeLayout } from '@/components/tool/EncodeDecodeLayout'
import { ModeSwitch } from '@/components/tool/ModeSwitch'

export function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const process = () => {
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

  const clear = () => {
    setInput('')
    setOutput('')
  }

  const swap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode')
    setInput(output)
    setOutput('')
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<Link2 className="h-8 w-8" />}
        title="URL 编解码"
        description="URL 编码和解码工具，处理 URL 中的特殊字符"
      />

      <Card>
        <CardHeader>
          <CardTitle>模式选择</CardTitle>
        </CardHeader>
        <CardContent>
          <ModeSwitch
            modes={['encode', 'decode'] as const}
            currentMode={mode}
            onModeChange={setMode}
            labels={{ encode: '编码', decode: '解码' }}
          />
        </CardContent>
      </Card>

      <EncodeDecodeLayout
        mode={mode}
        input={input}
        onInputChange={setInput}
        output={output}
        onProcess={process}
        onClear={clear}
        onSwap={swap}
        inputPlaceholder={mode === 'encode' ? '输入要编码的 URL' : '输入要解码的 URL 编码字符串'}
        outputPlaceholder={mode === 'encode' ? '编码结果将显示在这里' : '解码结果将显示在这里'}
        modeLabels={{ encode: '编码', decode: '解码' }}
        extraActions={
          <CopyButton 
            text={output} 
            className="w-full"
            defaultLabel="复制结果"
            copiedLabel="已复制"
          />
        }
      />
    </div>
  )
}
