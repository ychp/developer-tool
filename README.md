# 在线工具箱

> 项目源码：[https://github.com/ychp/developer-tool](https://github.com/ychp/developer-tool)

一个现代化的在线工具箱，提供 39 种实用工具，覆盖 12 大分类，满足开发者、AI 从业者与日常生活的各类需求。

## ✨ 特性

- 🚀 基于 React 19 + TypeScript + Vite（Rolldown）构建
- 📱 响应式设计，完美支持移动端和桌面端
- 🎨 使用 Tailwind CSS 打造精美 UI
- 🛡️ 完全类型安全的 TypeScript 实现
- 📦 39 种实用工具，12 大分类
- 🔒 所有数据在本地处理，保护隐私
- ⚡ 路由懒加载，首屏加载仅 425KB（减少 94%）
- 🌙 深色模式支持
- ⌨️ 键盘快捷键支持（Ctrl+K 搜索、ESC 关闭、方向键导航）
- 🎯 骨架屏加载，流畅的用户体验
- 🛡️ 错误边界处理，防止应用崩溃
- 📲 **PWA 支持** - 支持离线访问和桌面安装

## 🛠️ 工具分类

### 格式化（3 个）
- **JSON 格式化** - 美化、压缩和验证 JSON 数据，支持树状结构展示
- **XML 格式化** - 美化和压缩 XML 文档
- **代码格式化** - 支持 10+ 种编程语言的代码格式化（含 SQL）

### 编码转换（6 个）
- **Base64 编解码** - Base64 编码和解码工具，支持文本转换
- **URL 编解码** - URL 编码和解码工具
- **JSON/YAML 转换** - JSON 和 YAML 格式互相转换
- **颜色转换** - RGB、HSL、HEX 等颜色格式转换，实时预览
- **进制转换** - 二进制、八进制、十进制、十六进制互转
- **时间戳转换** - Unix 时间戳与日期时间互转

### 文本处理（5 个）
- **正则测试** - 实时测试正则表达式，支持多种匹配模式
- **文本对比** - 对比两个文本的差异，高亮显示不同部分
- **字符串合并拆分** - 支持多种分隔符的字符串合并和拆分
- **文本提取器** - 从文本中提取特定内容，支持去重、排序
- **文本长度计算** - 统计文本的字符数、词数、行数、字节数等

### 生成器（4 个）
- **UUID 生成** - 生成标准的 UUID v4
- **密码生成** - 生成安全的随机密码，可自定义规则
- **二维码生成** - 将文本转换为二维码图片，支持自定义样式
- **Cron 表达式** - Cron 表达式生成和解析工具

### 计算器（1 个）
- **通用计算器** - 在线科学计算器

### 媒体工具（2 个）
- **图片链接预览** - 批量预览图片链接，支持多行输入
- **图片 Base64** - 将图片转换为 Base64 编码

### 数据工具（1 个）
- **表格预览** - 在线预览 CSV、Excel、JSON 表格数据

### 加密工具（2 个）
- **哈希生成** - 生成 MD5、SHA-1、SHA-256 等哈希值
- **JWT 解码** - 解码和查看 JWT Token 内容

### 浏览器扩展（1 个）
- **Chrome 扩展** - 实用 Chrome 浏览器扩展工具集

### 生活查询（4 个）
- **电话号码查询** - 查询手机号码归属地信息
- **邮政编码查询** - 查询全国各地邮政编码
- **区号查询** - 查询全国各地电话区号
- **房贷计算器** - 商业贷款/公积金/组合贷款月供计算

### AI 工具（10 个）
- **Token 计算器** - 计算文本的 Token 数量（支持多种模型）
- **AI 价格计算器** - 计算不同 AI 模型的 API 调用成本
- **Function Calling 生成器** - 可视化生成 OpenAI Function Calling JSON Schema
- **JSON → Prompt** - 将 JSON 数据转为结构化 Prompt
- **图像 Prompt 生成器** - Midjourney/DALL-E/Stable Diffusion 提示词生成
- **System Prompt 生成器** - 生成系统提示词，含角色设定与约束条件
- **Markdown → Prompt** - Markdown 转 Prompt 格式
- **Few-shot 格式化** - 格式化 Few-shot 学习示例
- **图像尺寸计算器** - 计算图像的 Token 消耗（GPT-4V/Claude 3）
- **向量相似度计算** - 计算向量间的余弦相似度、欧氏距离、点积

## 🎯 技术栈

### 核心框架
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite（Rolldown）** - 构建工具
- **React Router v7** - 路由管理

### UI 框架
- **Tailwind CSS** - CSS 框架
- **Lucide React** - 图标库
- **Radix UI** - 无样式的 UI 组件

### 功能库
- **dayjs** - 日期处理
- **crypto-js** - 加密库
- **diff** - 文本对比
- **qrcode / react-qr-code** - 二维码生成
- **axios** - HTTP 请求
- **xlsx** - Excel 文件处理
- **js-yaml** - YAML 解析
- **js-tiktoken** - Token 计算
- **prettier** - 代码格式化
- **sql-formatter** - SQL 格式化
- **react-colorful** - 颜色选择器
- **lunar-typescript** - 农历日期
- **vite-plugin-pwa** - PWA 支持

### 开发工具
- **ESLint** - 代码检查
- **TypeScript ESLint** - TypeScript 代码检查
- **Workbox** - Service Worker 管理

## 🌟 功能亮点

### 性能优化
- **路由懒加载** - 39 个工具组件按需加载
- **代码分割** - 精细化分割大型第三方库
  - vendor-react - React 核心
  - vendor-xlsx - Excel 处理
  - vendor-tiktoken - Token 计算（按需加载）
  - vendor-lunar - 农历库（按需加载）
  - vendor-prettier - 代码格式化（按需加载）
  - vendor-sql-formatter - SQL 格式化（按需加载）
- **初始加载优化** - 从 7MB+ 减少到 425KB

### 键盘快捷键
- **Ctrl+K (Cmd+K)** - 聚焦搜索框
- **ESC** - 清除搜索 / 关闭侧边栏 / 关闭弹窗（按优先级）
- **↑↓** - 在搜索结果中导航
- **Enter** - 打开选中的工具

### 用户体验
- **骨架屏加载** - 流畅的加载动画，减少白屏感知
- **错误边界** - 捕获组件错误，显示友好提示
- **响应式侧边栏** - 支持展开/收起，悬停显示
- **收藏功能** - 收藏常用工具
- **最近使用** - 记录最近打开的工具

### 精美 UI 设计
- 渐变色卡片设计
- 平滑过渡动画
- 统一的配色方案
- 深色模式支持

### 数据隐私
- 所有处理在浏览器本地完成
- 不收集任何用户数据
- 不向服务器发送敏感信息

### PWA 支持
- **离线访问** - Service Worker 缓存核心资源，支持离线使用
- **桌面安装** - 支持安装为桌面应用（Windows/macOS/Linux）
- **移动端安装** - 支持添加到主屏幕（iOS/Android）
- **自动更新** - 定期检查更新，有新版本时提示用户

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

### 代码检查

```bash
npm run lint
```

## 📦 生产部署

本应用构建后为纯静态文件，可以部署到任何静态网站托管服务。

### 推荐部署平台

- **Vercel** - 零配置部署，全球 CDN
- **Netlify** - 免费托管，自动部署
- **Cloudflare Pages** - 全球加速，免费 SSL
- **GitHub Pages** - 免费 GitHub 托管

## 📁 项目结构

```
developer-tools/
├── src/
│   ├── assets/              # 静态资源
│   │   └── images/          # 图片资源
│   ├── components/          # 公共组件
│   │   ├── ui/              # UI 基础组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── PWAInstallPrompt.tsx
│   │   │   └── ...
│   │   ├── shared/          # 共享组件
│   │   │   ├── CalendarCard.tsx
│   │   │   └── JsonTree.tsx
│   │   ├── tool/            # 工具相关可复用组件
│   │   │   ├── CopyButton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── EncodeDecodeLayout.tsx
│   │   │   ├── ModeSwitch.tsx
│   │   │   └── ToolPageHeader.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/            # React Context
│   │   └── ThemeContext.tsx  # 主题上下文
│   ├── hooks/               # 自定义 Hooks
│   │   ├── useClipboard.ts
│   │   ├── useErrorHandler.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   └── useUndoRedo.ts
│   ├── layouts/             # 布局组件
│   │   └── Layout.tsx       # 主布局（含侧边栏）
│   ├── lib/                 # 工具函数
│   │   └── utils.ts
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页
│   │   └── NotFound.tsx     # 404 页面
│   ├── tools/               # 工具组件 (39个)
│   │   ├── ai/              # AI 工具 (11个)
│   │   ├── browser/         # 浏览器扩展 (1个)
│   │   ├── calculator/      # 计算器 (1个)
│   │   ├── convertor/       # 编码转换 (6个)
│   │   ├── formatting/      # 格式化工具 (3个)
│   │   ├── generator/       # 生成器 (4个)
│   │   ├── lifestyle/       # 生活查询 (4个)
│   │   ├── media/           # 媒体工具 (2个)
│   │   ├── security/        # 加密工具 (2个)
│   │   ├── text/            # 文本处理 (5个)
│   │   └── utils/           # 数据工具 (1个)
│   ├── App.tsx
│   ├── main.tsx             # 入口文件（路由配置）
│   ├── pwa.ts               # PWA 注册
│   └── index.css            # 全局样式
├── public/                  # 公共静态资源
├── scripts/                 # 脚本工具
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── README.md
└── AGENTS.md                # AI 智能体指南
```

## 🔧 开发指南

### 添加新工具

1. 在 `src/tools/` 对应分类目录下创建新的工具组件
2. 在 `src/layouts/Layout.tsx` 的 `menuGroups` 添加工具信息
3. 在 `src/main.tsx` 添加懒加载配置和路由

### 组件规范

- 使用函数组件 + Hooks
- 使用 TypeScript 定义类型
- 遵循现有的命名约定
- 使用 Tailwind CSS 进行样式设计
- 确保响应式设计

### 性能考虑

- 大型依赖库按需加载
- 避免在组件中进行重复计算
- 使用 useMemo 和 useCallback 优化性能
- 图片使用 CDN 加速

## 📝 更新日志

### v1.1.0 (最新)
- ✅ 新增计算器工具
- ✅ 新增文本长度计算器
- ✅ 新增向量相似度计算工具
- ✅ 升级 React Router 至 v7
- ✅ 新增 sql-formatter 依赖
- ✅ 工具总数从 26 增至 39

### v1.0.0
- ✅ 新增 26 种实用工具
- ✅ 实现路由懒加载和代码分割
- ✅ 添加键盘快捷键支持
- ✅ 实现骨架屏加载和错误边界
- ✅ 支持深色模式
- ✅ 性能优化：初始加载减少 94%
- ✅ PWA 支持：离线访问、桌面安装、自动更新

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 致谢

- [Lucide Icons](https://lucide.dev/) - 精美的图标库
- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Radix UI](https://www.radix-ui.com/) - 无障碍的 UI 组件库
- [Vite](https://vitejs.dev/) - 快速的构建工具

---

Made with ❤️ by [ychp](https://github.com/ychp)
