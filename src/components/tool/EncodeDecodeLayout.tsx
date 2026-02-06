import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRightLeft, Trash2 } from 'lucide-react'

interface EncodeDecodeLayoutProps {
  mode: 'encode' | 'decode'
  input: string
  onInputChange: (value: string) => void
  output: string
  onProcess: () => void
  onClear: () => void
  onSwap: () => void
  modeLabels?: { encode: string; decode: string }
  inputLabel?: string
  inputDescription?: string
  outputLabel?: string
  outputDescription?: string
  inputPlaceholder?: string
  outputPlaceholder?: string
  showSwapButton?: boolean
  extraActions?: ReactNode
}

export function EncodeDecodeLayout({
  mode,
  input,
  onInputChange,
  output,
  onProcess,
  onClear,
  onSwap,
  modeLabels = { encode: '编码', decode: '解码' },
  inputLabel = '输入',
  inputDescription = '',
  outputLabel = '输出',
  outputDescription = '结果',
  inputPlaceholder = '',
  outputPlaceholder = '',
  showSwapButton = true,
  extraActions,
}: EncodeDecodeLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{inputLabel}</CardTitle>
          {inputDescription && <CardDescription>{inputDescription}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            className="min-h-[200px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={onProcess} className="flex-1">
              {modeLabels[mode]}
            </Button>
            {showSwapButton && (
              <Button onClick={onSwap} variant="outline" size="icon" title="交换输入输出">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            )}
            <Button onClick={onClear} variant="ghost" size="icon" title="清空">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{outputLabel}</CardTitle>
          {outputDescription && <CardDescription>{outputDescription}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={output}
            readOnly
            placeholder={outputPlaceholder}
            className="min-h-[200px] font-mono text-sm"
          />
          {extraActions}
        </CardContent>
      </Card>
    </div>
  )
}
