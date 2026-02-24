import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="p-12 text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-800 select-none">
            404
          </h1>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            页面未找到
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            抱歉，您访问的页面不存在或已被移动。
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回上一页
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            回到首页
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            您可能在寻找以下工具：
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <button
              onClick={() => navigate('/json-formatter')}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm"
            >
              <div className="font-medium text-slate-900 dark:text-slate-100">JSON 格式化</div>
            </button>
            <button
              onClick={() => navigate('/base64')}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm"
            >
              <div className="font-medium text-slate-900 dark:text-slate-100">Base64 编解码</div>
            </button>
            <button
              onClick={() => navigate('/token-calculator')}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm"
            >
              <div className="font-medium text-slate-900 dark:text-slate-100">Token 计算器</div>
            </button>
            <button
              onClick={() => navigate('/ai-price-calculator')}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm"
            >
              <div className="font-medium text-slate-900 dark:text-slate-100">AI 价格计算器</div>
            </button>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              需要帮助？
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              使用侧边栏的搜索功能可以快速找到您需要的工具。您可以按工具名称或关键词进行搜索。
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
