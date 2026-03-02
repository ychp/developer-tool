# AI 智能体指南

> 本文档专为 AI 智能体设计，帮助快速理解项目架构、开发规范和最佳实践。

## 项目概述

**项目名称**: 在线工具箱 (Developer Tools)

**技术栈**:
- React 19 + TypeScript + Vite
- React Router v6
- Tailwind CSS + Radix UI
- 36+ 懒加载工具组件

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
├── components/tool/      # 工具相关可复用组件
├── contexts/            # React Context
├── hooks/              # 自定义 Hooks
├── layouts/            # 布局组件
├── pages/              # 页面组件
├── tools/              # 工具组件 (36个)
│   ├── ai/             # AI 工具 (9个)
│   ├── browser/        # 浏览器扩展 (1个)
│   ├── convertor/      # 编码转换 (6个)
│   ├── formatting/     # 格式化工具 (3个)
│   ├── generator/      # 生成器 (4个)
│   ├── lifestyle/      # 生活查询 (4个)
│   ├── media/          # 媒体工具 (2个)
│   ├── security/       # 加密工具 (2个)
│   └── text/           # 文本处理 (4个)
├── lib/                # 工具函数
└── main.tsx           # 入口文件
```

## 工具分类清单

### 1. 格式化 (3个)
- JSON 格式化 (`/json-formatter`)
- XML 格式化 (`/xml-formatter`)
- 代码格式化 (`/code-formatter`)

### 2. 编码转换 (4个)
- Base64 编解码 (`/base64`)
- URL 编解码 (`/url-encoder`)
- JSON/YAML 转换 (`/json-yaml-converter`)
- 图片 Base64 (`/image-base64`)

### 3. 文本处理 (4个)
- 正则测试 (`/regex-tester`)
- 文本对比 (`/diff-checker`)
- 字符串合并拆分 (`/string-join-split`)
- 文本提取器 (`/text-extractor`)

### 4. 转换工具 (3个)
- 时间戳转换 (`/timestamp`)
- 颜色转换 (`/color-converter`)
- 进制转换 (`/number-converter`)

### 5. 生成器 (4个)
- UUID 生成 (`/uuid`)
- 密码生成 (`/password-generator`)
- 二维码生成 (`/qr-generator`)
- Cron 生成 (`/cron-generator`)

### 6. 媒体工具 (2个)
- 图片链接预览 (`/image-link-preview`)
- 表格预览 (`/table-viewer`)

### 7. 加密工具 (2个)
- 哈希生成 (`/hash-generator`)
- JWT 解码 (`/jwt-decoder`)

### 8. 浏览器扩展 (1个)
- Chrome 扩展 (`/chrome-extensions`)

### 9. 生活查询 (4个)
- 手机号归属 (`/phone-number`)
- 邮编查询 (`/postal-code`)
- 电话区号 (`/area-code`)
- 房贷计算器 (`/mortgage-calculator`)

### 10. AI 工具 (9个)
- Token 计算器 (`/token-calculator`)
- AI 价格计算器 (`/ai-price-calculator`)
- Function Calling 生成器 (`/function-calling-generator`)
- JSON → Prompt (`/json-to-prompt`)
- 图像 Prompt 生成器 (`/image-prompt-generator`)
- System Prompt 生成器 (`/system-prompt-generator`)
- Markdown → Prompt (`/markdown-to-prompt`)
- Few-shot 格式化 (`/fewshot-formatter`)
- 图像尺寸计算器 (`/image-size-calculator`)

## 开发规范

### React.js 代码规范

#### 命名规范

**组件命名**
- 组件名称使用 **大驼峰命名法 (PascalCase)**
- 组件名应与文件名保持一致
- 避免使用缩写或模糊的命名

```typescript
// ✅ 正确
export function UserProfile() { }
export function JsonFormatter() { }

// ❌ 错误
export function userProfile() { }
export function user_profile() { }
```

**变量和函数命名**
- 变量、函数使用 **小驼峰命名法 (camelCase)**
- 常量使用 **全大写 + 下划线**
- 事件处理函数以 `handle` 前缀开头
- 布尔值变量使用 `is`/`has`/`should` 前缀

```typescript
// ✅ 正确
const userName = 'John'
const handleSubmit = () => { }
const MAX_COUNT = 100
const isLoading = false
const hasError = true

// ❌ 错误
const username = 'John'
const HandleSubmit = () => { }
const max_count = 100
const loading = false
```

**自定义 Hook 命名**
- 自定义 Hook 必须以 `use` 开头
- 使用 camelCase 命名

```typescript
// ✅ 正确
export function useFetchData() { }
export function useLocalStorage() { }

// ❌ 错误
export function fetchUserData() { }
export function getLocalStorage() { }
```

#### 组件规范

**使用函数组件**
- 优先使用函数组件和 Hooks
- 避免使用类组件

```typescript
// ✅ 正确
export function MyComponent() {
  const [state, setState] = useState('')
  return <div>{state}</div>
}

// ❌ 避免
export class MyComponent extends React.Component {
  // ...
}
```

**返回值规范**
- 组件必须只返回一个 DOM 元素
- 可以使用 Fragment (`<></>`) 或 `<div>` 包装
- 没有子内容的标签必须自闭合

```typescript
// ✅ 正确
export function MyComponent() {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  )
}

// ✅ 正确
export function Input() {
  return <input type="text" />
}

// ❌ 错误 - 多个根元素
export function MyComponent() {
  return (
    <h1>Title</h1>
    <p>Content</p>
  )
}
```

**JSX 规范**
- 超过一行的 JSX 必须使用括号括起来
- Props 使用 camelCase
- 使用布尔属性时，值为 true 可以省略

```typescript
// ✅ 正确
export function MyComponent() {
  return (
    <div className="container">
      <Button disabled={isLoading} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  )
}

// ✅ 正确 - 布尔属性省略值
<Button disabled />
<Input required />

// ❌ 错误 - 缺少括号
export function MyComponent() {
  return <div className="container">
    <Button>Click</Button>
  </div>
}
```

#### Hooks 规则

**Hook 调用规则**
- 只在组件顶层调用 Hook
- 只在 React 函数组件或自定义 Hook 中调用 Hook
- 不能在循环、条件语句或嵌套函数中调用 Hook
- 必须在任何早期 return 之前调用 Hook

```typescript
// ✅ 正确
export function MyComponent() {
  const [state, setState] = useState('')
  const { data } = useFetchData()

  if (someCondition) {
    return <div>Loading...</div>
  }

  return <div>{state}</div>
}

// ❌ 错误 - 在条件语句中调用 Hook
export function MyComponent() {
  if (someCondition) {
    const [state, setState] = useState('') // 错误！
  }
  return <div></div>
}

// ❌ 错误 - 在循环中调用 Hook
export function MyComponent({ items }) {
  items.forEach(item => {
    const [value, setValue] = useState(item) // 错误！
  })
  return <div></div>
}
```

**自定义 Hook 规范**
- 必须以 `use` 开头
- 使用 TypeScript 定义返回类型
- 保持单一职责

```typescript
// ✅ 正确
interface UseLocalStorageReturn<T> {
  value: T
  setValue: (value: T) => void
}

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageReturn<T> {
  const [value, setValue] = useState<T>(initialValue)
  // ...
  return { value, setValue }
}
```

#### TypeScript 规范

**类型定义**
- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型、交叉类型
- 避免使用 `any`，优先使用 `unknown`
- 导出会被外部使用的 Props 类型

```typescript
// ✅ 正确 - 使用 interface
interface ButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
}

export function Button({ label, disabled = false, onClick }: ButtonProps) {
  return <button disabled={onClick}>{label}</button>
}

// ✅ 正确 - 使用 type
type Status = 'loading' | 'success' | 'error'
type Theme = 'light' | 'dark'

// ❌ 错误 - 使用 any
function processData(data: any) { }
```

**类型导出**
- 对于需要被外部使用的组件，始终导出其 Props 类型
- 使用 Type-Only 导出避免运行时依赖

```typescript
// ✅ 正确 - 导出 Props 类型
export interface UserCardProps {
  user: User
  onEdit?: (id: number) => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return <div>{user.name}</div>
}

// ✅ 正确 - Type-Only 导出
import type { ButtonProps } from './Button'
export type { UserCardProps }
```

**泛型使用**
- 合理使用泛型提高组件复用性
- 泛型参数使用有意义的首字母大写命名

```typescript
// ✅ 正确
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

export function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>
}
```

#### 性能优化规范

**React.memo**
- 使用 `React.memo` 包装纯组件，避免不必要的重新渲染
- 对于大型列表使用虚拟化 (react-window/react-virtualized)

```typescript
// ✅ 正确
export const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  return <div>{/* 复杂渲染逻辑 */}</div>
})
```

**useMemo**
- 使用 `useMemo` 缓存昂贵的计算结果
- 不要过度使用，只有计算确实昂贵时才使用

```typescript
// ✅ 正确
const sortedList = useMemo(() => {
  return list.sort((a, b) => a.value - b.value)
}, [list])
```

**useCallback**
- 使用 `useCallback` 缓存传递给子组件的函数
- 避免在渲染中创建新函数导致子组件不必要地重新渲染

```typescript
// ✅ 正确
const handleClick = useCallback(() => {
  doSomething(dependency)
}, [dependency])

return <ChildComponent onClick={handleClick} />
```

#### 样式规范

**CSS-in-JS**
- 推荐使用 Tailwind CSS（项目默认）
- 避免在组件中写内联样式，除非是动态样式

```typescript
// ✅ 正确 - 使用 Tailwind
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 rounded-lg">
  Content
</div>

// ✅ 正确 - 动态样式使用内联
<div style={{ width: `${progress}%` }}>Progress</div>

// ❌ 错误 - 静态样式使用内联
<div style={{ padding: '16px', backgroundColor: 'white' }}>Content</div>
```

**深色模式**
- 使用 `dark:` 前缀支持深色模式
- 确保所有颜色都有对应的深色模式变体

```typescript
// ✅ 正确
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
  支持深色模式的内容
</div>
```

#### 错误处理规范

**错误边界**
- 为应用添加错误边界捕获组件树中的错误
- 记录错误信息并显示降级 UI

```typescript
// ✅ 正确
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>
    }
    return this.props.children
  }
}
```

**用户输入验证**
- 在状态更新前验证用户输入
- 提供清晰的错误信息

```typescript
// ✅ 正确
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

#### 代码组织规范

**导入顺序**
- 按以下顺序组织导入：核心库 → 第三方库 → 本地组件
- 使用空行分隔不同类型的导入

```typescript
// ✅ 正确
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CopyButton } from '@/components/tool/CopyButton'
import { useTheme } from '@/contexts/ThemeContext'
```

**文件结构**
- 相关文件组织在同一目录下
- 按功能或模块划分目录结构

```
components/
  UserProfile/
    UserProfile.tsx      # 组件实现
    UserProfile.test.tsx # 测试文件
    index.ts             # 导出文件
```

#### 可访问性规范

**语义化 HTML**
- 使用语义化 HTML 标签
- 为交互元素添加适当的 role 和 aria-* 属性

```typescript
// ✅ 正确
<button
  type="button"
  role="button"
  aria-label="关闭对话框"
  onClick={onClose}
>
  <XIcon />
</button>

<nav aria-label="主导航">
  <ul>
    <li><a href="/">首页</a></li>
  </ul>
</nav>
```

**键盘导航**
- 确保所有交互元素都可通过键盘访问
- 提供清晰的焦点样式

```typescript
// ✅ 正确
<input
  type="text"
  className="focus:ring-2 focus:ring-sky-500"
  onKeyDown={(e) => {
    if (e.key === 'Enter') handleSubmit()
  }}
/>
```

#### 代码格式化

**使用 Prettier 和 ESLint**
- 项目已配置 Prettier 和 ESLint
- 提交代码前自动格式化

**配置规则**
- 2 个空格缩进
- 单引号
- 结尾分号
- 尾随逗号

```bash
# 代码检查
npm run lint

# 代码检查并修复
npm run lint:fix
```

---

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
import { CopyButton } from '@/components/tool/CopyButton'

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
            {output && <CopyButton text={output} />}
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
import { CopyButton } from '@/components/tool/CopyButton'

<CopyButton text={textToCopy} />
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
feat(text-extractor): 添加去重、排序功能

- 添加去重开关
- 添加升序/降序排序选项
- 新增唯一数量统计指标

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

最后更新：2025-02-25
