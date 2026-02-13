import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Code2, 
  Hash, 
  Link2, 
  ArrowRightLeft,
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
  Globe,
  FileSpreadsheet,
  Phone,
  MapPin,
  PhoneCall,
  BrainCircuit,
  Sparkles,
  Search,
  X,
  Star,
  StarOff,
  DollarSign
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { ThemeToggle } from '../components/ThemeToggle'
import { PWAInstallPrompt } from '../components/ui/PWAInstallPrompt'
import { useState, useRef, useEffect, useCallback } from 'react'

const menuGroups = [
  {
    name: '格式化',
    icon: FileCode,
    tools: [
      { path: '/json-formatter', name: 'JSON 格式化', icon: Code2 },
      { path: '/xml-formatter', name: 'XML 格式化', icon: FileCode },
      { path: '/code-formatter', name: '代码格式化', icon: Code2 },
    ]
  },
  {
    name: '编码转换',
    icon: Hash,
    tools: [
      { path: '/base64', name: 'Base64 编解码', icon: Hash },
      { path: '/url-encoder', name: 'URL 编解码', icon: Link2 },
      { path: '/json-yaml-converter', name: 'JSON/YAML 转换', icon: ArrowRightLeft },
      { path: '/image-base64', name: '图片 Base64', icon: ImageIcon },
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
    icon: Sparkles,
    tools: [
      { path: '/uuid', name: 'UUID 生成', icon: KeySquare },
      { path: '/password-generator', name: '密码生成', icon: RefreshCw },
      { path: '/qr-generator', name: '二维码生成', icon: QrCode },
      { path: '/cron-generator', name: 'Cron 生成', icon: Clock },
    ]
  },
  {
    name: '媒体工具',
    icon: ImageIcon,
    tools: [
      { path: '/image-link-preview', name: '图片链接预览', icon: ImageIcon },
      { path: '/table-viewer', name: '表格预览', icon: FileSpreadsheet },
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
  {
    name: '生活查询',
    icon: Phone,
    tools: [
      { path: '/phone-number', name: '手机号归属', icon: Phone },
      { path: '/postal-code', name: '邮编查询', icon: MapPin },
      { path: '/area-code', name: '电话区号', icon: PhoneCall },
    ]
  },
  {
    name: 'AI 工具',
    icon: BrainCircuit,
    tools: [
      { path: '/token-calculator', name: 'Token 计算器', icon: BrainCircuit },
      { path: '/ai-price-calculator', name: 'AI 价格计算器', icon: DollarSign },
      { path: '/function-calling-generator', name: 'Function Calling 生成器', icon: Code2 },
      { path: '/json-to-prompt', name: 'JSON → Prompt', icon: ArrowRightLeft },
    ]
  },
]

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null)
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [favoritesOpen, setFavoritesOpen] = useState(true)
  const [recentTools, setRecentTools] = useState<string[]>([])
  const [recentOpen, setRecentOpen] = useState(true)
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteTools')
    if (savedFavorites) {
      try {
        setFavorites(new Set(JSON.parse(savedFavorites)))
      } catch (e) {
        console.error('Failed to load favorites:', e)
      }
    }

    const savedFavoritesOpen = localStorage.getItem('favoritesOpen')
    if (savedFavoritesOpen !== null) {
      setFavoritesOpen(savedFavoritesOpen === 'true')
    }

    const savedRecentTools = localStorage.getItem('recentTools')
    if (savedRecentTools) {
      try {
        setRecentTools(JSON.parse(savedRecentTools))
      } catch (e) {
        console.error('Failed to load recent tools:', e)
      }
    }

    const savedRecentOpen = localStorage.getItem('recentOpen')
    if (savedRecentOpen !== null) {
      setRecentOpen(savedRecentOpen === 'true')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('favoriteTools', JSON.stringify(Array.from(favorites)))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('favoritesOpen', String(favoritesOpen))
  }, [favoritesOpen])

  useEffect(() => {
    localStorage.setItem('recentTools', JSON.stringify(recentTools))
  }, [recentTools])

  useEffect(() => {
    localStorage.setItem('recentOpen', String(recentOpen))
  }, [recentOpen])

  useEffect(() => {
    const currentPath = location.pathname
    if (currentPath !== '/' && !searchQuery) {
      setRecentTools(prev => {
        const filtered = prev.filter(path => path !== currentPath)
        const updated = [currentPath, ...filtered].slice(0, 10)
        return updated
      })
    }
  }, [location.pathname, searchQuery])

  const isToolActive = (path: string) => location.pathname === path
  const isGroupActive = useCallback((group: typeof menuGroups[0]) =>
    group.tools.some(tool => isToolActive(tool.path))
  , [location.pathname])

  const filteredMenuGroups = searchQuery
    ? menuGroups.map(group => ({
        ...group,
        tools: group.tools.filter(tool =>
          tool.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(group => group.tools.length > 0)
    : menuGroups

  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())
  const previousPathRef = useRef('/')

  useEffect(() => {
    const currentPath = location.pathname
    const previousPath = previousPathRef.current

    if (currentPath === '/') {
      setOpenGroups(new Set())
    } else if (currentPath !== previousPath) {
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
      setFavoritesOpen(false)
      setRecentOpen(false)
    }, 100)
  }

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const flattenedTools = filteredMenuGroups.flatMap(group => group.tools)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (e.key === 'Escape') {
        if (searchQuery) {
          setSearchQuery('')
          setSelectedSearchIndex(-1)
        } else if (sidebarOpen) {
          setSidebarOpen(false)
        } else if (hoveredGroup) {
          setHoveredGroup(null)
          setFavoritesOpen(false)
          setRecentOpen(false)
        }
        return
      }

      if (searchQuery && flattenedTools.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedSearchIndex(prev => 
            prev < flattenedTools.length - 1 ? prev + 1 : prev
          )
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedSearchIndex(prev => (prev > 0 ? prev - 1 : 0))
        } else if (e.key === 'Enter' && selectedSearchIndex >= 0) {
          e.preventDefault()
          const selectedTool = flattenedTools[selectedSearchIndex]
          if (selectedTool) {
            navigate(selectedTool.path)
            setSearchQuery('')
            setSelectedSearchIndex(-1)
            if (window.innerWidth < 1024) {
              setSidebarOpen(false)
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery, selectedSearchIndex, flattenedTools, sidebarOpen, hoveredGroup, navigate])

  useEffect(() => {
    setSelectedSearchIndex(-1)
  }, [searchQuery])

  const toggleGroup = (groupName: string) => {
    if (openGroups.has(groupName)) {
      setOpenGroups(new Set())
    } else {
      setOpenGroups(new Set([groupName]))
    }
  }

  const toggleFavorite = (toolPath: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(toolPath)) {
        newFavorites.delete(toolPath)
      } else {
        newFavorites.add(toolPath)
      }
      return newFavorites
    })
  }

  const removeFromRecent = (toolPath: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setRecentTools(prev => prev.filter(path => path !== toolPath))
  }

  const favoriteTools = menuGroups.flatMap(group =>
    group.tools.filter(tool => favorites.has(tool.path))
  )

  const recentToolsList = recentTools
    .map(path => menuGroups.flatMap(group => group.tools).find(tool => tool.path === path))
    .filter(Boolean)

  return (
    <div className="h-screen flex flex-col overflow-hidden relative z-10">
      <header className="flex-shrink-0 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-sky-50 via-cyan-50 to-blue-50 dark:from-slate-950/60 dark:via-slate-950/50 dark:to-slate-950/60 backdrop-blur-xl dark:backdrop-blur-2xl dark:shadow-2xl dark:shadow-black/30 supports-[backdrop-filter]:bg-background/60 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-sky-500/10 before:via-cyan-500/10 before:to-blue-500/10 before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2 hover:bg-blue-100 dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg p-2">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">在线工具箱</span>
                <span className="text-xs text-muted-foreground hidden sm:block">26+ 免费实用工具</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside
          className={`fixed lg:relative inset-y-0 left-0 z-40 transform border-r border-slate-200 dark:border-white/10 bg-background backdrop-blur-xl dark:bg-slate-950/50 dark:backdrop-blur-2xl dark:shadow-2xl dark:shadow-black/30 transition-all duration-200 ease-in-out flex flex-col ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${sidebarCollapsed ? 'w-16' : 'w-64'} lg:translate-x-0`}
        >
          <nav className="flex-1 flex flex-col overflow-hidden p-3">
            <Link
              to="/"
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 mb-4 ${
                sidebarCollapsed ? 'justify-center' : 'space-x-3'
              } ${
                isToolActive('/')
                  ? 'bg-gradient-to-r from-sky-300 to-blue-300 dark:from-sky-500/50 dark:to-blue-500/50 text-sky-700 dark:text-slate-200 shadow-sm shadow-sky-300/20 dark:shadow-sky-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/60 hover:text-sky-700 dark:hover:text-slate-200'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className={`p-1.5 rounded-md transition-colors ${isToolActive('/') ? 'bg-gradient-to-br from-sky-300 to-blue-300 dark:from-sky-500 dark:to-blue-500 text-sky-700 dark:text-white' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400'}`}>
                <Home className="h-3.5 w-3.5 shrink-0" />
              </div>
              {!sidebarCollapsed && <span className="font-semibold">首页</span>}
            </Link>

            {!sidebarCollapsed && (
              <div className="mb-3 relative flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="搜索工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-20 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:border-transparent transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 rounded border border-slate-200 dark:border-slate-700">Ctrl+K</kbd>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedSearchIndex(-1)
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {!sidebarCollapsed && !searchQuery && (favoriteTools.length > 0 || recentToolsList.length > 0) && (
              <div className="grid grid-cols-2 gap-2 mb-3 flex-shrink-0">
                {favoriteTools.length > 0 && (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose()
                      setRecentOpen(false)
                    }}
                    onMouseLeave={closePopup}
                  >
                    <button
                      onClick={() => setFavoritesOpen(!favoritesOpen)}
                      className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border transition-all duration-200 ${
                        favoritesOpen
                          ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700 shadow-sm shadow-amber-200 dark:shadow-amber-900/20'
                          : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                      }`}
                      title="我的收藏"
                    >
                      <Star className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{favoriteTools.length}</span>
                    </button>
                    {favoritesOpen && (
                      <div
                        className="absolute left-0 top-full mt-2 z-20 w-56 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 shadow-lg overflow-hidden"
                        onMouseEnter={cancelClose}
                        onMouseLeave={closePopup}
                      >
                        <div className="px-3 py-2.5 border-b border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/30">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">我的收藏</span>
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-1.5">
                          {favoriteTools.map((tool) => {
                            const ToolIcon = tool.icon
                            return (
                              <div key={tool.path} className="relative group/fav-tool">
                                <Link
                                  to={tool.path}
                                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                    isToolActive(tool.path)
                                      ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-medium'
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                                  }`}
                                  onClick={() => {
                                    setSidebarOpen(false)
                                    setFavoritesOpen(false)
                                  }}
                                >
                                  <ToolIcon className="h-4 w-4 shrink-0 opacity-70" />
                                  <span className="truncate flex-1">{tool.name}</span>
                                </Link>
                                <button
                                  onClick={(e) => {
                                    toggleFavorite(tool.path, e)
                                    if (favoriteTools.length === 1) setFavoritesOpen(false)
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/fav-tool:opacity-100 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-all"
                                  title="取消收藏"
                                >
                                  <X className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {recentToolsList.length > 0 && (
                  <div
                    className="relative"
                    onMouseEnter={() => {
                      cancelClose()
                      setFavoritesOpen(false)
                    }}
                    onMouseLeave={closePopup}
                  >
                    <button
                      onClick={() => setRecentOpen(!recentOpen)}
                      className={`w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border transition-all duration-200 ${
                        recentOpen
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 shadow-sm shadow-emerald-200 dark:shadow-emerald-900/20'
                          : 'bg-emerald-50/80 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                      }`}
                      title="最近使用"
                    >
                      <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{recentToolsList.length}</span>
                    </button>
                    {recentOpen && (
                      <div
                        className="absolute left-0 top-full mt-2 z-20 w-56 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/50 shadow-lg overflow-hidden"
                        onMouseEnter={cancelClose}
                        onMouseLeave={closePopup}
                      >
                        <div className="px-3 py-2.5 border-b border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/30">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">最近使用</span>
                          </div>
                        </div>
                        <div className="max-h-80 overflow-y-auto p-1.5">
                          {recentToolsList.map((tool) => {
                            if (!tool) return null
                            const ToolIcon = tool.icon
                            return (
                              <div key={tool.path} className="relative group/recent-tool">
                                <Link
                                  to={tool.path}
                                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                    isToolActive(tool.path)
                                      ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-medium'
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                                  }`}
                                  onClick={() => {
                                    setSidebarOpen(false)
                                    setRecentOpen(false)
                                  }}
                                >
                                  <ToolIcon className="h-4 w-4 shrink-0 opacity-70" />
                                  <span className="truncate flex-1">{tool.name}</span>
                                </Link>
                                <button
                                  onClick={(e) => {
                                    removeFromRecent(tool.path, e)
                                    if (recentToolsList.length === 1) setRecentOpen(false)
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/recent-tool:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                  title="从历史记录中删除"
                                >
                                  <X className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 sidebar-scrollbar">

            {filteredMenuGroups.map((group) => {
              const GroupIcon = group.icon
              const isOpen = searchQuery ? true : openGroups.has(group.name) || isGroupActive(group)
              
              return (
                <div 
                  key={group.name} 
                  className="mb-3"
                >
                  {!sidebarCollapsed ? (
                    <>
                      {!searchQuery && (
                        <button
                          onClick={() => toggleGroup(group.name)}
                          className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/60 group/header"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className={`p-1.5 rounded-md transition-colors ${isOpen ? 'bg-gradient-to-br from-sky-300 to-blue-300 dark:from-sky-500 dark:to-blue-500 text-sky-700 dark:text-white' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 group-hover/header:bg-sky-100 dark:group-hover/header:bg-slate-700/50 group-hover/header:text-sky-600 dark:group-hover/header:text-slate-300'}`}>
                              <GroupIcon className="h-3.5 w-3.5 shrink-0" />
                            </div>
                            <span className="font-semibold">{group.name}</span>
                          </div>
                          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-500 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                      
                      {isOpen && (
                        <div className="ml-2 mt-1.5 space-y-0.5 pl-2 border-l-2 border-slate-200 dark:border-slate-700">
                          {group.tools.map((tool) => {
                            const ToolIcon = tool.icon
                            const globalIndex = flattenedTools.findIndex(t => t.path === tool.path)
                            const isSelected = searchQuery && globalIndex === selectedSearchIndex
                            return (
                              <div
                                key={tool.path}
                                className="relative group/tool"
                              >
                                <Link
                                  to={tool.path}
                                  className={`flex items-center justify-between space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-sky-400 to-blue-400 dark:from-sky-600 dark:to-blue-600 text-white shadow-md -ml-2 pr-8 ring-2 ring-sky-500 dark:ring-sky-400'
                                      : isToolActive(tool.path)
                                      ? 'bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-500/30 dark:to-blue-500/30 text-sky-800 dark:text-slate-200 shadow-sm -ml-2 pr-8'
                                      : 'text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 dark:hover:from-slate-800/60 dark:hover:to-slate-700/60 hover:text-sky-700 dark:hover:text-slate-200 hover:-ml-2 pr-8'
                                  }`}
                                  onClick={() => setSidebarOpen(false)}
                                  title={tool.name}
                                >
                                  <div className="flex items-center space-x-2.5 overflow-hidden">
                                    <ToolIcon className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{tool.name}</span>
                                  </div>
                                </Link>
                                <button
                                  onClick={(e) => toggleFavorite(tool.path, e)}
                                  className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/tool:opacity-100 transition-all ${
                                    favorites.has(tool.path) ? 'opacity-100' : ''
                                  } hover:bg-amber-100 dark:hover:bg-amber-900/30`}
                                  title={favorites.has(tool.path) ? '取消收藏' : '收藏'}
                                >
                                  {favorites.has(tool.path) ? (
                                    <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                  ) : (
                                    <StarOff className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                  )}
                                </button>
                              </div>
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
                                <div key={tool.path} className="relative group/tool-popup">
                                  <Link
                                    to={tool.path}
                                    className={`flex items-center justify-between space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                      isToolActive(tool.path)
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                    onClick={() => {
                                      setSidebarOpen(false)
                                      setHoveredGroup(null)
                                    }}
                                  >
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                      <ToolIcon className="h-4 w-4 shrink-0" />
                                      <span className="truncate">{tool.name}</span>
                                    </div>
                                  </Link>
                                  <button
                                    onClick={(e) => {
                                      toggleFavorite(tool.path, e)
                                      setHoveredGroup(null)
                                    }}
                                    className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover/tool-popup:opacity-100 transition-all ${
                                      favorites.has(tool.path) ? 'opacity-100' : ''
                                    } hover:bg-amber-100 dark:hover:bg-amber-900/30`}
                                    title={favorites.has(tool.path) ? '取消收藏' : '收藏'}
                                  >
                                    {favorites.has(tool.path) ? (
                                      <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                                    ) : (
                                      <StarOff className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                    )}
                                  </button>
                                </div>
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

            {searchQuery && filteredMenuGroups.length === 0 && (
              <div className="text-center py-8 px-4">
                <FileSearch className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">未找到相关工具</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">试试其他关键词</p>
              </div>
            )}

            </div>
          </nav>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex-shrink-0 flex items-center justify-center border-t transition-all h-14 w-full ${
              sidebarCollapsed 
                ? 'hover:bg-accent' 
                : 'gap-2 hover:bg-accent/50'
            }`}
            title={sidebarCollapsed ? '展开菜单' : '收起菜单'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
            <div className="flex-1 mb-8">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </div>

            <footer className="py-6 text-center text-sm text-muted-foreground border-t mt-8">
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
      <PWAInstallPrompt />
    </div>
  )
}
