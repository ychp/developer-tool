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
  outputDescription = '',
  inputPlaceholder = '',
  outputPlaceholder = '',
  showSwapButton = true,
  extraActions,
}: EncodeDecodeLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="relative">
          <CardTitle className="text-slate-700 dark:text-slate-200">{inputLabel}</CardTitle>
          {inputDescription && <CardDescription className="text-slate-500 dark:text-slate-400">{inputDescription}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <Textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={inputPlaceholder}
            className="min-h-[200px] font-mono text-sm bg-white dark:bg-slate-950/70 backdrop-blur-md border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <div className="flex gap-2">
            <Button onClick={onProcess} className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/30">
              {modeLabels[mode]}
            </Button>
            {showSwapButton && (
              <Button onClick={onSwap} variant="outline" size="icon" title="交换输入输出" className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            )}
            <Button onClick={onClear} variant="ghost" size="icon" title="清空" className="hover:bg-slate-100 dark:hover:bg-slate-800">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="relative">
          <CardTitle className="text-slate-700 dark:text-slate-200">{outputLabel}</CardTitle>
          {outputDescription && <CardDescription className="text-slate-500 dark:text-slate-400">{outputDescription}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <Textarea
            value={output}
            readOnly
            placeholder={outputPlaceholder}
            className="min-h-[200px] font-mono text-sm bg-white dark:bg-slate-950/70 backdrop-blur-md border-slate-200 dark:border-slate-700/60 text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {extraActions}
        </CardContent>
      </Card>
    </div>
  )
}
