import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { useClipboard } from '@/hooks/useClipboard'
import type { ButtonProps } from '@/components/ui/button'

interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'children'> {
  text: string
  copiedLabel?: string
  defaultLabel?: string
}

export function CopyButton({ 
  text, 
  copiedLabel = '已复制',
  defaultLabel = '复制',
  ...buttonProps
}: CopyButtonProps) {
  const { copied, copy } = useClipboard()

  return (
    <Button
      onClick={() => copy(text)}
      disabled={!text}
      variant={copied ? 'outline' : buttonProps.variant || 'default'}
      {...buttonProps}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          {copiedLabel}
        </>
      ) : (
        <>
          <Copy className="mr-2 h-4 w-4" />
          {defaultLabel}
        </>
      )}
    </Button>
  )
}
