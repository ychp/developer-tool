import { useState } from 'react'
import { Hash } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { CopyButton } from '@/components/tool/CopyButton'
import { EncodeDecodeLayout } from '@/components/tool/EncodeDecodeLayout'
import { ModeSwitch } from '@/components/tool/ModeSwitch'

export function Base64() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const process = () => {
    if (mode === 'encode') {
      try {
        const encoded = btoa(unescape(encodeURIComponent(input)))
        setOutput(encoded)
      } catch (err) {
        setOutput('编码失败：' + (err instanceof Error ? err.message : '未知错误'))
      }
    } else {
      try {
        const decoded = decodeURIComponent(escape(atob(input)))
        setOutput(decoded)
      } catch (err) {
        setOutput('解码失败：无效的 Base64 字符串')
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
        icon={<Hash className="h-8 w-8" />}
        title="Base64 编解码"
        description="Base64 格式编码和解码工具，支持 UTF-8 字符"
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
        inputPlaceholder={mode === 'encode' ? '输入要编码的文本' : '输入要解码的 Base64 字符串'}
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
