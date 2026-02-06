import { Button } from '@/components/ui/button'

interface ModeSwitchProps<T extends string> {
  modes: readonly T[]
  currentMode: T
  onModeChange: (mode: T) => void
  labels?: Record<T, string>
  className?: string
}

export function ModeSwitch<T extends string>({ 
  modes, 
  currentMode, 
  onModeChange,
  labels,
  className = ''
}: ModeSwitchProps<T>) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {modes.map((mode) => (
        <Button
          key={mode}
          onClick={() => onModeChange(mode)}
          variant={currentMode === mode ? 'default' : 'outline'}
          className="flex-1"
        >
          {labels?.[mode] || mode}
        </Button>
      ))}
    </div>
  )
}
