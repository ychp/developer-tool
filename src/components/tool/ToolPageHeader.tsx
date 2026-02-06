import type { ReactNode } from 'react'

interface ToolPageHeaderProps {
  icon: ReactNode
  title: string
  description: string
}

export function ToolPageHeader({ icon, title, description }: ToolPageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-200">
        <span className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 text-white">
          {icon}
        </span>
        {title}
      </h1>
      <p className="text-muted-foreground text-slate-600 dark:text-slate-400">{description}</p>
    </div>
  )
}
