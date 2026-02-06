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
          className={`flex-1 ${currentMode === mode
            ? 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/30'
            : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
          }`}
        >
          {labels?.[mode] || mode}
        </Button>
      ))}
    </div>
  )
}
