import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-16">
        <div className="flex flex-col items-center justify-center text-center">
          {icon && <div className="text-muted-foreground/20 mb-4">{icon}</div>}
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
