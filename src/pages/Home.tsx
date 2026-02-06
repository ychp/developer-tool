import { Link } from 'react-router-dom'
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
  FileSpreadsheet
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarCard } from '@/components/CalendarCard'

const tools = [
  {
    path: '/json-formatter',
    name: 'JSON 格式化',
    icon: Code2,
    category: '格式化',
    color: 'bg-blue-500'
  },
  {
    path: '/xml-formatter',
    name: 'XML 格式化',
    icon: FileCode,
    category: '格式化',
    color: 'bg-indigo-500'
  },
  {
    path: '/base64',
    name: 'Base64 编解码',
    icon: Hash,
    category: '编码转换',
    color: 'bg-purple-500'
  },
  {
    path: '/url-encoder',
    name: 'URL 编解码',
    icon: Link2,
    category: '编码转换',
    color: 'bg-pink-500'
  },
  {
    path: '/regex-tester',
    name: '正则测试',
    icon: FileSearch,
    category: '文本处理',
    color: 'bg-cyan-500'
  },
  {
    path: '/diff-checker',
    name: '文本对比',
    icon: FileDiff,
    category: '文本处理',
    color: 'bg-teal-500'
  },
  {
    path: '/string-join-split',
    name: '字符串合并拆分',
    icon: WrapText,
    category: '文本处理',
    color: 'bg-lime-500'
  },
  {
    path: '/timestamp',
    name: '时间戳转换',
    icon: Clock,
    category: '转换工具',
    color: 'bg-amber-500'
  },
  {
    path: '/color-converter',
    name: '颜色转换',
    icon: Palette,
    category: '转换工具',
    color: 'bg-rose-500'
  },
  {
    path: '/number-converter',
    name: '进制转换',
    icon: Calculator,
    category: '转换工具',
    color: 'bg-orange-500'
  },
  {
    path: '/uuid',
    name: 'UUID 生成',
    icon: KeySquare,
    category: '生成器',
    color: 'bg-emerald-500'
  },
  {
    path: '/password-generator',
    name: '密码生成',
    icon: RefreshCw,
    category: '生成器',
    color: 'bg-green-500'
  },
  {
    path: '/qr-generator',
    name: '二维码生成',
    icon: QrCode,
    category: '生成器',
    color: 'bg-violet-500'
  },
  {
    path: '/image-link-preview',
    name: '图片链接预览',
    icon: ImageIcon,
    category: '媒体工具',
    color: 'bg-sky-500'
  },
  {
    path: '/table-viewer',
    name: '表格预览',
    icon: FileSpreadsheet,
    category: '媒体工具',
    color: 'bg-green-500'
  },
  {
    path: '/hash-generator',
    name: '哈希生成',
    icon: Lock,
    category: '加密工具',
    color: 'bg-red-500'
  },
  {
    path: '/jwt-decoder',
    name: 'JWT 解码',
    icon: ShieldCheck,
    category: '加密工具',
    color: 'bg-slate-500'
  },
  {
    path: '/chrome-extensions',
    name: 'Chrome 扩展',
    icon: Code2,
    category: '浏览器扩展',
    color: 'bg-blue-600'
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
  '格式化': 'bg-blue-500',
  '编码转换': 'bg-purple-500',
  '文本处理': 'bg-cyan-500',
  '转换工具': 'bg-amber-500',
  '生成器': 'bg-emerald-500',
  '媒体工具': 'bg-sky-500',
  '加密工具': 'bg-red-500',
  '浏览器扩展': 'bg-blue-600',
}

export function Home() {
  const toolCount = tools.length
  const categoryCount = categories.length

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 text-white shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">在线工具箱</h1>
          <p className="text-base md:text-lg opacity-90 max-w-2xl mb-4">
            免费实用的在线工具集合，满足您的工作与生活需求
          </p>
          <div className="flex gap-4 text-sm">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-bold text-xl">{toolCount}</span>
              <span className="ml-2">个工具</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="font-bold text-xl">{categoryCount}</span>
              <span className="ml-2">个分类</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-[0_0_380px] hidden xl:block">
          <Card className="shadow-lg border-2 border-blue-100 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="text-xl flex items-center gap-2 text-blue-700">
                <Calendar className="h-5 w-5" />
                日历
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <CalendarCard />
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => {
              const CategoryIcon = categoryIcons[category] || Sparkles
              return (
                <Card
                  key={category}
                  className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 overflow-hidden"
                >
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b">
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                      <div className={`p-2 rounded-lg ${categoryColors[category] || 'bg-gray-500'} text-white`}>
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
                              className="w-full justify-start h-11 px-4 hover:bg-blue-50 hover:scale-[1.02] transition-all duration-200 group/btn"
                            >
                              <div className={`p-1.5 rounded mr-3 ${tool.color} text-white group-hover/btn:scale-110 transition-transform`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              <span className="font-medium">{tool.name}</span>
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
