import type { ReactNode } from 'react'

interface ToolPageHeaderProps {
  icon: ReactNode
  title: string
  description: string
}

export function ToolPageHeader({ icon, title, description }: ToolPageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        {icon}
        {title}
      </h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
