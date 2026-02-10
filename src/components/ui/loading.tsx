import { Loader2 } from 'lucide-react'

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 dark:text-sky-400 mx-auto mb-4" />
        <p className="text-sm text-slate-600 dark:text-slate-400">加载中...</p>
      </div>
    </div>
  )
}
