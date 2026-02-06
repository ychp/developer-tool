import { Outlet, Link, useLocation } from 'react-router-dom'
import { 
  Code2, 
  Hash, 
  Link2, 
  Clock, 
  KeySquare,
  Home,
  Menu,
  FileSearch,
  FileDiff,
  Lock,
  FileCode,
  RefreshCw,
  Palette,
  QrCode,
  Calculator,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  WrapText,
  Image as ImageIcon,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect } from 'react'

const menuGroups = [
  {
    name: '格式化',
    icon: FileCode,
    tools: [
      { path: '/json-formatter', name: 'JSON 格式化', icon: Code2 },
      { path: '/xml-formatter', name: 'XML 格式化', icon: FileCode },
    ]
  },
  {
    name: '编码转换',
    icon: Hash,
    tools: [
      { path: '/base64', name: 'Base64 编解码', icon: Hash },
      { path: '/url-encoder', name: 'URL 编解码', icon: Link2 },
    ]
  },
  {
    name: '文本处理',
    icon: FileSearch,
    tools: [
      { path: '/regex-tester', name: '正则测试', icon: FileSearch },
      { path: '/diff-checker', name: '文本对比', icon: FileDiff },
      { path: '/string-join-split', name: '字符串合并拆分', icon: WrapText },
    ]
  },
  {
    name: '转换工具',
    icon: Calculator,
    tools: [
      { path: '/timestamp', name: '时间戳转换', icon: Clock },
      { path: '/color-converter', name: '颜色转换', icon: Palette },
      { path: '/number-converter', name: '进制转换', icon: Calculator },
    ]
  },
  {
    name: '生成器',
    icon: KeySquare,
    tools: [
      { path: '/uuid', name: 'UUID 生成', icon: KeySquare },
      { path: '/password-generator', name: '密码生成', icon: RefreshCw },
      { path: '/qr-generator', name: '二维码生成', icon: QrCode },
    ]
  },
  {
    name: '媒体工具',
    icon: ImageIcon,
    tools: [
      { path: '/image-link-preview', name: '图片链接预览', icon: ImageIcon },
    ]
  },
  {
    name: '加密工具',
    icon: Lock,
    tools: [
      { path: '/hash-generator', name: '哈希生成', icon: Lock },
      { path: '/jwt-decoder', name: 'JWT 解码', icon: ShieldCheck },
    ]
  },
  {
    name: '浏览器扩展',
    icon: Globe,
    tools: [
      { path: '/chrome-extensions', name: 'Chrome 扩展', icon: Code2 },
    ]
  },
]

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const location = useLocation()

  const isToolActive = (path: string) => location.pathname === path
  const isGroupActive = (group: typeof menuGroups[0]) => 
    group.tools.some(tool => isToolActive(tool.path))

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const previousPathRef = useRef('/')

  useEffect(() => {
    const currentPath = location.pathname
    const previousPath = previousPathRef.current

    if (currentPath === '/' && previousPath !== '/') {
      setOpenGroups(new Set())
    } else if (currentPath !== '/' && previousPath === '/') {
      const activeGroup = menuGroups.find(isGroupActive)
      if (activeGroup) {
        setOpenGroups(new Set([activeGroup.name]))
      }
    }

    previousPathRef.current = currentPath
  }, [location.pathname, isGroupActive])

  const closePopup = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredGroup(null)
    }, 100)
  }

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const toggleGroup = (groupName: string) => {
    if (openGroups.has(groupName)) {
      setOpenGroups(new Set())
    } else {
      setOpenGroups(new Set([groupName]))
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-5 flex flex-wrap items-center justify-center gap-16 p-8 select-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 100px, rgba(0,0,0,.03) 100px, rgba(0,0,0,.03) 200px), repeating-linear-gradient(-45deg, transparent, transparent 100px, rgba(0,0,0,.03) 100px, rgba(0,0,0,.03) 200px)',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#374151',
        fontFamily: 'monospace',
      }}>
        {Array.from({ length: 100 }).map((_, i) => (
          <span key={i} className="transform -rotate-45">Yun Zhi</span>
        ))}
      </div>
      
      <header className="flex-shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-6 w-6" />
            <span className="font-bold">开发者工具箱</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside 
          className={`fixed lg:relative inset-y-0 left-0 z-40 transform border-r bg-background transition-all duration-200 ease-in-out flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${sidebarCollapsed ? 'w-16' : 'w-64'} lg:translate-x-0`}
        >
          <nav className="flex-1 space-y-1 p-4">
            <Link
              to="/"
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-4 ${
                sidebarCollapsed ? 'justify-center' : 'space-x-3'
              } ${
                isToolActive('/')
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>首页</span>}
            </Link>

            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>

            {menuGroups.map((group) => {
              const GroupIcon = group.icon
              const isOpen = openGroups.has(group.name) || isGroupActive(group)
              
              return (
                <div 
                  key={group.name} 
                  className="mb-2"
                >
                  {!sidebarCollapsed ? (
                    <>
                      <button
                        onClick={() => toggleGroup(group.name)}
                        className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <GroupIcon className="h-4 w-4 shrink-0" />
                          <span>{group.name}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="ml-6 mt-1 space-y-1">
                          {group.tools.map((tool) => {
                            const ToolIcon = tool.icon
                            return (
                              <Link
                                key={tool.path}
                                to={tool.path}
                                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                  isToolActive(tool.path)
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                                title={tool.name}
                              >
                                <ToolIcon className="h-4 w-4 shrink-0" />
                                <span className="truncate">{tool.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className="relative"
                      onMouseLeave={closePopup}
                    >
                      <button
                        onMouseEnter={(e) => {
                          cancelClose()
                          const rect = e.currentTarget.getBoundingClientRect()
                          const centerY = rect.top + rect.height / 2
                          setPopupStyle({
                            position: 'fixed',
                            left: `${rect.right + 8}px`,
                            top: `${centerY}px`,
                            transform: 'translateY(-50%)',
                          })
                          setHoveredGroup(group.name)
                        }}
                        className={`w-full flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isGroupActive(group)
                            ? 'bg-accent text-accent-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                        title={group.name}
                        type="button"
                      >
                        <GroupIcon className="h-4 w-4 shrink-0" />
                      </button>
                      
                      {hoveredGroup === group.name && popupStyle && (
                        <div 
                          className="bg-popover border rounded-lg shadow-lg p-2 min-w-[200px] z-[100]"
                          style={popupStyle}
                          onMouseEnter={cancelClose}
                          onMouseLeave={closePopup}
                        >
                          <p className="px-3 py-2 text-sm font-medium text-muted-foreground border-b">
                            {group.name}
                          </p>
                          <div className="mt-1 space-y-1">
                            {group.tools.map((tool) => {
                              const ToolIcon = tool.icon
                              return (
                                <Link
                                  key={tool.path}
                                  to={tool.path}
                                  className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    isToolActive(tool.path)
                                      ? 'bg-accent text-accent-foreground'
                                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                  }`}
                                  onClick={() => {
                                    setSidebarOpen(false)
                                    setHoveredGroup(null)
                                  }}
                                >
                                  <ToolIcon className="h-4 w-4 shrink-0" />
                                  <span>{tool.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          </nav>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex-shrink-0 flex items-center justify-center border-t transition-all ${
              sidebarCollapsed 
                ? 'h-16 w-full hover:bg-accent' 
                : 'h-14 w-full gap-2 hover:bg-accent/50'
            }`}
            title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </>
            )}
          </button>
        </aside>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col p-4 lg:p-8">
            <div className="flex-1">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>
            
            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
              <div className="max-w-7xl mx-auto space-y-3">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <span>© 2026 Create By 云止.</span>
                  <a 
                    href="https://github.com/ychp/developer-tool"
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    本站源代码
                  </a>
                </div>
                <div>
                  <a 
                    href="https://beian.miit.gov.cn/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    备案号: 浙ICP备2024102079号-2
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}
