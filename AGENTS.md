# AI 智能体指南

> 本文档专为 AI 智能体设计，帮助快速理解项目架构、开发规范和最佳实践。

## 项目概述

**项目名称**: 在线工具箱 (Developer Tools)

**技术栈**:
- React 19 + TypeScript + Vite
- React Router v6
- Tailwind CSS + Radix UI
- 26+ 懒加载工具组件

**核心特性**:
- 路由懒加载（首屏仅 425KB）
- 代码分割优化
- 键盘快捷键支持
- 深色模式
- 骨架屏 + 错误边界

## 项目结构

```
src/
├── components/ui/        # UI 基础组件
├── contexts/            # React Context
├── hooks/              # 自定义 Hooks
├── layouts/            # 布局组件
├── pages/              # 页面组件
├── tools/              # 工具组件 (26个)
├── lib/                # 工具函数
└── main.tsx           # 入口文件
```

## 开发规范

### 组件规范

#### 1. 工具组件结构

所有工具组件应遵循以下结构：

```typescript
// src/tools/YourTool.tsx
import { useState } from 'react'
import { YourIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
// ... 其他导入

export function YourTool() {
  // 状态管理
  const [state, setState] = useState(initialState)

  // 事件处理函数
  const handleAction = () => {
    // 处理逻辑
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* 工具标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">工具名称</h1>
        <p className="text-slate-600 dark:text-slate-400">工具描述</p>
      </div>

      {/* 工具内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card className="p-6">
          {/* 输入控件 */}
        </Card>

        {/* 输出区域 */}
        <Card className="p-6">
          {/* 输出控件 */}
        </Card>
      </div>
    </div>
  )
}
```

#### 2. 导出规范

工具组件必须使用**命名导出**，不要使用默认导出：

```typescript
// ✅ 正确
export function JsonFormatter() {
  // ...
}

// ❌ 错误
export default function JsonFormatter() {
  // ...
}
```

#### 3. 样式规范

- 使用 Tailwind CSS 类名
- 遵循响应式设计（移动优先）
- 支持深色模式（使用 `dark:` 前缀）

```typescript
// 示例
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
  <input className="border border-slate-200 dark:border-slate-700" />
</div>
```

### 添加新工具的完整流程

#### 步骤 1: 创建工具组件

在 `src/tools/` 创建新文件 `NewTool.tsx`：

```typescript
import { useState } from 'react'
import { IconName } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CopyButton } from '@/components/shared/CopyButton'

export function NewTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const handleProcess = () => {
    // 处理逻辑
    setOutput(/* 结果 */)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">新工具名称</h1>
        <p className="text-slate-600 dark:text-slate-400">工具描述</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">输入</h2>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-40 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
            placeholder="请输入内容..."
          />
          <div className="mt-4 flex gap-3">
            <Button onClick={handleProcess}>处理</Button>
            <Button variant="outline" onClick={() => setInput('')}>清空</Button>
          </div>
        </Card>

        {/* 输出区域 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">输出</h2>
            {output && <CopyButton content={output} />}
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[160px]">
            {output || '结果将显示在这里...'}
          </div>
        </Card>
      </div>
    </div>
  )
}
```

#### 步骤 2: 在 Layout.tsx 注册工具

编辑 `src/layouts/Layout.tsx`，找到 `menuGroups` 数组并添加：

```typescript
const menuGroups: MenuGroup[] = [
  // ... 其他分组
  {
    name: '分类名称',
    icon: IconName, // 从 lucide-react 导入
    tools: [
      // ... 其他工具
      {
        name: '新工具名称',
        path: '/new-tool',
        icon: IconName,
        description: '工具描述',
      },
    ],
  },
]
```

#### 步骤 3: 在 main.tsx 添加懒加载

编辑 `src/main.tsx`：

```typescript
// 1. 添加懒加载导入
const NewTool = lazy(() => import('./tools/NewTool').then(m => ({ default: m.NewTool })))

// 2. 在 lazyRoutes 数组添加路由
const lazyRoutes = [
  // ... 其他路由
  { path: 'new-tool', Component: NewTool },
]
```

#### 步骤 4: 构建验证

```bash
npm run build
```

确保构建成功，然后提交代码。

### 图标选择规范

使用 [Lucide React](https://lucide.dev/) 图标库。

常用图标映射：
- 格式化工具: `FileCode`, `Code2`
- 编码转换: `RefreshCw`, `Shuffle`
- 文本处理: `Type`, `FileText`
- 转换工具: `ArrowLeftRight`, `Repeat`
- 生成器: `Sparkles`, `Wand2`
- 加密工具: `Lock`, `Shield`, `Key`
- 查询工具: `Search`, `Database`, `Globe`
- 媒体工具: `Image`, `Table`, `Film`

### 性能优化规范

#### 1. 大型依赖处理

如果工具使用了大型依赖（> 100KB），需要在 `vite.config.ts` 配置代码分割：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('your-large-lib')) {
              return 'vendor-yourlib'
            }
            // ... 其他分割规则
          }
        },
      },
    },
  },
})
```

#### 2. 组件优化

- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存事件处理函数
- 避免在渲染中创建新对象/数组

```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation(input)
}, [input])

const handleClick = useCallback(() => {
  doSomething(dependency)
}, [dependency])
```

#### 3. 图片优化

- 使用 CDN 加速（如 Unsplash）
- 预设尺寸减少加载时间

```typescript
// ✅ 推荐：使用预设尺寸
const imageUrl = 'https://images.unsplash.com/xxx?w=400&h=300&fit=crop'

// ❌ 避免：使用原图
const imageUrl = 'https://images.unsplash.com/xxx'
```

### 状态管理模式

#### 1. 简单状态

使用 `useState`：

```typescript
const [value, setValue] = useState('')
```

#### 2. 复杂状态

使用 `useReducer`：

```typescript
type State = {
  input: string
  output: string
  error: string | null
}

type Action =
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_OUTPUT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: State = {
  input: '',
  output: '',
  error: null,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, input: action.payload }
    // ... 其他 case
    default:
      return state
  }
}

export function YourTool() {
  const [state, dispatch] = useReducer(reducer, initialState)
  // ...
}
```

#### 3. 全局状态

使用 React Context（如主题）：

```typescript
// contexts/YourContext.tsx
import { createContext, useContext } from 'react'

type ContextType = {
  // 定义类型
}

const YourContext = createContext<ContextType | null>(null)

export function YourProvider({ children }) {
  // ...
  return (
    <YourContext.Provider value={...}>
      {children}
    </YourContext.Provider>
  )
}

export function useYourContext() {
  const context = useContext(YourContext)
  if (!context) {
    throw new Error('useYourContext must be used within YourProvider')
  }
  return context
}
```

### 错误处理规范

#### 1. 用户输入验证

```typescript
const handleProcess = () => {
  if (!input.trim()) {
    setError('请输入内容')
    return
  }

  try {
    // 处理逻辑
    setError(null)
  } catch (error) {
    setError(error instanceof Error ? error.message : '处理失败')
  }
}
```

#### 2. 错误显示

```typescript
{error && (
  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
    {error}
  </div>
)}
```

### 可复用组件

项目中有以下可复用组件：

#### CopyButton - 复制按钮

```typescript
import { CopyButton } from '@/components/shared/CopyButton'

<CopyButton content={textToCopy} />
```

#### Card - 卡片容器

```typescript
import { Card } from '@/components/ui/card'

<Card className="p-6">
  {/* 内容 */}
</Card>
```

#### Button - 按钮

```typescript
import { Button } from '@/components/ui/button'

<Button variant="default">默认按钮</Button>
<Button variant="outline">边框按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
```

### 代码分割配置

当前 `vite.config.ts` 的代码分割策略：

```typescript
manualChunks: (id) => {
  if (id.includes('node_modules')) {
    // React 核心
    if (id.includes('react') || id.includes('react-dom') || id.includes('react-router'))
      return 'vendor-react'
    // UI 组件
    if (id.includes('@radix-ui'))
      return 'vendor-ui'
    // 图标
    if (id.includes('lucide-react'))
      return 'vendor-icons'
    // 代码格式化
    if (id.includes('prettier'))
      return 'vendor-prettier'
    // Excel 处理
    if (id.includes('xlsx'))
      return 'vendor-xlsx'
    // 加密
    if (id.includes('crypto-js'))
      return 'vendor-crypto'
    // YAML
    if (id.includes('js-yaml') || id.includes('yaml'))
      return 'vendor-yaml'
    // Token 计算
    if (id.includes('js-tiktoken') || id.includes('tiktoken'))
      return 'vendor-tiktoken'
    // 农历
    if (id.includes('lunar'))
      return 'vendor-lunar'
    // 二维码
    if (id.includes('qrcode') || id.includes('qr-code') || id.includes('jsqr'))
      return 'vendor-qr'
    // 差异对比
    if (id.includes('diff'))
      return 'vendor-diff'
    // HTTP
    if (id.includes('axios'))
      return 'vendor-axios'
    // 日期
    if (id.includes('dayjs'))
      return 'vendor-dayjs'
  }
}
```

### 常用工具函数

#### cn - 类名合并

```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', 'another-class')} />
```

#### 撤销重做 Hook

```typescript
import { useUndoRedo } from '@/hooks/useUndoRedo'

const { state, setState, undo, redo, canUndo, canRedo } = useUndoRedo(initialState)
```

### 键盘快捷键

项目支持以下快捷键：
- `Ctrl+K` / `Cmd+K` - 聚焦搜索框
- `ESC` - 清除搜索 / 关闭侧边栏 / 关闭弹窗
- `↑↓` - 导航搜索结果
- `Enter` - 打开选中的工具

### 深色模式

项目使用 Tailwind 的 `dark:` 变体支持深色模式。主题状态通过 `ThemeContext` 管理。

```typescript
import { useTheme } from '@/contexts/ThemeContext'

const { theme, toggleTheme } = useTheme()
```

### 常见问题

#### Q: 如何调试懒加载组件？

A: 开发模式下懒加载组件会立即加载。生产模式下可以在 Network 面板查看加载的 chunk。

#### Q: 如何优化首次加载速度？

A:
1. 将大型依赖添加到 `vite.config.ts` 的 `manualChunks`
2. 确保工具组件使用懒加载
3. 避免在入口文件导入大型库

#### Q: 如何添加全局样式？

A: 在 `src/index.css` 添加样式。项目使用 Tailwind CSS，推荐使用 Tailwind 类名而非自定义 CSS。

#### Q: 如何处理文件上传？

A: 使用 `<input type="file">` + `FileReader` API：

```typescript
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    // 处理内容
  }
  reader.readAsText(file)
}
```

### Git 提交规范

使用约定式提交：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型 (type)**:
- `feat`: 新功能
- `fix`: 修复 bug
- `perf`: 性能优化
- `refactor`: 重构
- `style`: 样式修改
- `docs`: 文档更新
- `chore`: 构建/工具更新

**示例**:
```
feat(json-formatter): 添加 JSON 压缩功能

- 添加压缩按钮
- 实现压缩算法
- 更新 UI 布局

Closes #123
```

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint

# 代码检查并修复
npm run lint:fix
```

### 测试清单

在提交代码前，确保：
- [ ] `npm run build` 构建成功
- [ ] `npm run lint` 无错误
- [ ] 新工具在首页正确显示
- [ ] 搜索功能能找到新工具
- [ ] 深色模式显示正常
- [ ] 移动端响应式正常
- [ ] 键盘快捷键正常工作

## 项目资源

- **GitHub**: https://github.com/ychp/developer-tool
- **React 文档**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/
- **Vite 文档**: https://vitejs.dev/

---

最后更新：2025-02-10
