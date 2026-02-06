import { Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  Code2, 
  Hash, 
  Link2, 
  Clock, 
  Calendar,
  KeySquare,
  FileCode,
  FileSearch,
  FileDiff,
  Lock,
  RefreshCw,
  Palette,
  QrCode,
  Calculator,
  ShieldCheck,
  Sparkles,
  WrapText,
  Image as ImageIcon,
  Globe,
  FileSpreadsheet,
  Menu
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarCard } from '@/components/shared/CalendarCard'

const tools = [
  {
    path: '/json-formatter',
    name: 'JSON 格式化',
    icon: Code2,
    category: '格式化',
    gradient: 'from-sky-500 to-sky-600'
  },
  {
    path: '/xml-formatter',
    name: 'XML 格式化',
    icon: FileCode,
    category: '格式化',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    path: '/base64',
    name: 'Base64 编解码',
    icon: Hash,
    category: '编码转换',
    gradient: 'from-cyan-500 to-cyan-600'
  },
  {
    path: '/url-encoder',
    name: 'URL 编解码',
    icon: Link2,
    category: '编码转换',
    gradient: 'from-sky-400 to-sky-500'
  },
  {
    path: '/regex-tester',
    name: '正则测试',
    icon: FileSearch,
    category: '文本处理',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    path: '/diff-checker',
    name: '文本对比',
    icon: FileDiff,
    category: '文本处理',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    path: '/string-join-split',
    name: '字符串合并拆分',
    icon: WrapText,
    category: '文本处理',
    gradient: 'from-sky-500 to-indigo-500'
  },
  {
    path: '/timestamp',
    name: '时间戳转换',
    icon: Clock,
    category: '转换工具',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    path: '/color-converter',
    name: '颜色转换',
    icon: Palette,
    category: '转换工具',
    gradient: 'from-cyan-500 to-sky-500'
  },
  {
    path: '/number-converter',
    name: '进制转换',
    icon: Calculator,
    category: '转换工具',
    gradient: 'from-blue-400 to-blue-500'
  },
  {
    path: '/uuid',
    name: 'UUID 生成',
    icon: KeySquare,
    category: '生成器',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    path: '/password-generator',
    name: '密码生成',
    icon: RefreshCw,
    category: '生成器',
    gradient: 'from-teal-500 to-teal-600'
  },
  {
    path: '/qr-generator',
    name: '二维码生成',
    icon: QrCode,
    category: '生成器',
    gradient: 'from-cyan-400 to-cyan-500'
  },
  {
    path: '/image-link-preview',
    name: '图片链接预览',
    icon: ImageIcon,
    category: '媒体工具',
    gradient: 'from-sky-500 to-violet-500'
  },
  {
    path: '/table-viewer',
    name: '表格预览',
    icon: FileSpreadsheet,
    category: '媒体工具',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    path: '/hash-generator',
    name: '哈希生成',
    icon: Lock,
    category: '加密工具',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    path: '/jwt-decoder',
    name: 'JWT 解码',
    icon: ShieldCheck,
    category: '加密工具',
    gradient: 'from-sky-500 to-blue-500'
  },
  {
    path: '/chrome-extensions',
    name: 'Chrome 扩展',
    icon: Code2,
    category: '浏览器扩展',
    gradient: 'from-cyan-500 to-blue-600'
  },
]

const categories = Array.from(new Set(tools.map(t => t.category)))

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  '格式化': FileCode,
  '编码转换': Hash,
  '文本处理': FileSearch,
  '转换工具': Calculator,
  '生成器': Sparkles,
  '媒体工具': ImageIcon,
  '加密工具': Lock,
  '浏览器扩展': Globe,
}

const categoryColors: Record<string, string> = {
  '格式化': 'bg-gradient-to-br from-sky-500 to-blue-600',
  '编码转换': 'bg-gradient-to-br from-cyan-500 to-sky-600',
  '文本处理': 'bg-gradient-to-br from-blue-500 to-indigo-600',
  '转换工具': 'bg-gradient-to-br from-teal-500 to-cyan-600',
  '生成器': 'bg-gradient-to-br from-emerald-500 to-teal-600',
  '媒体工具': 'bg-gradient-to-br from-blue-500 to-violet-600',
  '加密工具': 'bg-gradient-to-br from-indigo-500 to-blue-600',
  '浏览器扩展': 'bg-gradient-to-br from-cyan-500 to-blue-600',
}

const categoryBgColors: Record<string, string> = {
  '格式化': 'from-sky-50 to-blue-50',
  '编码转换': 'from-cyan-50 to-sky-50',
  '文本处理': 'from-blue-50 to-indigo-50',
  '转换工具': 'from-teal-50 to-cyan-50',
  '生成器': 'from-emerald-50 to-teal-50',
  '媒体工具': 'from-blue-50 to-violet-50',
  '加密工具': 'from-indigo-50 to-blue-50',
  '浏览器扩展': 'from-cyan-50 to-blue-50',
}

export function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-[1920px] mx-auto relative">
     
      {/* 移动端/平板日历 - 显示在顶部 */}
      <div className="mb-4 sm:mb-6 xl:hidden">
        <Card className="shadow-lg border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
          <CardHeader className="bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/50 py-3 sm:py-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2 text-sky-700 dark:text-slate-200">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              日历
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            <CalendarCard />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 sm:gap-4 xl:gap-6 items-start flex-col xl:flex-row relative">
        {/* 桌面端日历侧边栏 - 只在大屏幕显示 */}
        <div className={`
          fixed xl:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
          hidden xl:block xl:w-[360px] 2xl:w-[400px] xl:flex-shrink-0
          ${isSidebarOpen ? 'block' : ''}
        `}>
          <div className="h-full overflow-y-auto bg-white dark:bg-slate-950 xl:bg-transparent">
            <Card className="shadow-lg border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-2xl dark:shadow-black/40 xl:sticky top-4 sm:top-6 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
              <CardHeader className="bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/50 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-sky-700 dark:text-slate-200">
                  <Calendar className="h-5 w-5" />
                  日历
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <CalendarCard />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 遮罩层 */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 xl:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* 工具分类网格 */}
        <div className="flex-1 min-w-0">
          <div className="grid gap-3 sm:gap-4 xl:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
            {categories.map((category) => {
              const CategoryIcon = categoryIcons[category] || Sparkles
              return (
                <Card
                  key={category}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300/80 dark:hover:border-slate-600/60 overflow-hidden bg-white dark:bg-slate-950/60 backdrop-blur-xl dark:shadow-2xl dark:shadow-black/40 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none"
                >
                  <CardHeader className={`bg-gradient-to-br ${categoryBgColors[category]} dark:from-slate-800/50 dark:to-slate-900/50 border-b border-slate-200/60 dark:border-slate-700/50`}>
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <div className={`p-2 rounded-lg ${categoryColors[category]} text-white shadow-sm`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    {tools
                      .filter((tool) => tool.category === category)
                      .map((tool) => {
                        const Icon = tool.icon
                        return (
                          <Link key={tool.path} to={tool.path}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-11 px-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:scale-[1.02] transition-all duration-200 group/btn"
                            >
                              <div 
                                className={`p-1.5 rounded mr-3 text-white group-hover/btn:scale-110 transition-transform shadow-sm bg-gradient-to-br ${tool.gradient}`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <span className="font-medium text-slate-700 dark:text-slate-200">{tool.name}</span>
                            </Button>
                          </Link>
                        )
                      })}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
