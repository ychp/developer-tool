# 在线工具箱

> 项目源码：[https://github.com/ychp/developer-tool](https://github.com/ychp/developer-tool)

一个现代化的在线工具箱，提供多种实用工具，满足您的工作与生活需求。

## ✨ 特性

- 🚀 基于 React + TypeScript + Vite 构建
- 📱 响应式设计，支持移动端和桌面端
- 🎨 使用 Tailwind CSS 打造精美 UI
- 🛡️ 完全类型安全的 TypeScript 实现
- 📦 18+ 实用工具，8 大分类
- 🔒 所有数据在本地处理，保护隐私
- ⚡ 快速响应，流畅体验
- 🌙 深色模式支持（计划中）

## 🛠️ 工具分类

### 格式化
- **JSON 格式化** - 美化、压缩和验证 JSON 数据
- **XML 格式化** - 美化和压缩 XML 文档

### 编码转换
- **Base64 编解码** - Base64 编码和解码工具
- **URL 编解码** - URL 编码和解码工具

### 文本处理
- **正则测试** - 实时测试正则表达式
- **文本对比** - 对比两个文本的差异
- **字符串合并拆分** - 支持多种分隔符的字符串合并和拆分

### 转换工具
- **时间戳转换** - Unix 时间戳与日期时间互转
- **颜色转换** - RGB、HSL、HEX 等颜色格式转换
- **进制转换** - 二进制、八进制、十进制、十六进制互转

### 生成器
- **UUID 生成** - 生成标准的 UUID
- **密码生成** - 生成安全的随机密码
- **二维码生成** - 将文本转换为二维码图片

### 媒体工具
- **图片链接预览** - 预览图片链接并获取图片信息
- **表格预览** - 在线预览 CSV、Excel、JSON 表格数据

### 加密工具
- **哈希生成** - 生成 MD5、SHA-1、SHA-256 等哈希值
- **JWT 解码** - 解码和查看 JWT Token 内容

### 浏览器扩展
- **Chrome 扩展** - 实用 Chrome 浏览器扩展工具集

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

### 预览生产构建

```bash
npm run preview
```

## 📦 生产部署

### 静态网站托管

本应用构建后为纯静态文件，可以部署到任何静态网站托管服务。

#### 1. Vercel 部署（推荐）

**步骤：**

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **构建项目**
   ```bash
   npm run build
   ```

3. **部署到 Vercel**
   ```bash
   vercel --prod
   ```

   或通过 Vercel 网站：
   - 访问 [vercel.com](https://vercel.com)
   - 导入您的 GitHub 仓库
   - Vercel 会自动检测 Vite 项目并配置构建设置
   - 点击 Deploy 即可

**环境变量：** 无需配置

#### 2. Netlify 部署

**步骤：**

1. **构建项目**
   ```bash
   npm run build
   ```

2. **通过 Netlify 网站部署**
   - 访问 [netlify.com](https://www.netlify.com)
   - 点击 "Add new site" -> "Deploy manually"
   - 拖拽 `dist` 文件夹到部署区域
   - 或连接 Git 仓库自动部署

**或使用 Netlify CLI：**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **配置 netlify.toml**（可选）
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### 3. GitHub Pages 部署

**步骤：**

1. **安装 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **更新 package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist",
       "homepage": "https://yourusername.github.io/developer-tools"
     }
   }
   ```

3. **更新 vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/developer-tools/', // 你的仓库名
     // ... 其他配置
   })
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **在 GitHub 设置中启用 Pages**
   - 进入仓库 Settings -> Pages
   - Source 选择 gh-pages 分支
   - 保存后访问 `https://yourusername.github.io/developer-tools`

#### 4. Cloudflare Pages 部署

**步骤：**

1. **通过 Cloudflare Pages 网站部署**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 选择 Pages -> 创建项目
   - 连接 Git 仓库或上传文件
   - 构建命令：`npm run build`
   - 构建输出目录：`dist`

2. **或使用 Wrangler CLI**
   ```bash
   npm install -g wrangler
   npm run build
   wrangler pages publish dist
   ```

#### 5. 传统服务器部署

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/developer-tools/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**部署步骤：**

1. 构建项目：
   ```bash
   npm run build
   ```

2. 上传 `dist` 目录到服务器：
   ```bash
   scp -r dist/* user@your-server:/var/www/developer-tools/dist/
   ```

3. 配置 Nginx 并重启：
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### 6. Docker 部署

**创建 Dockerfile：**

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**创建 nginx.conf：**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

**构建和运行：**

```bash
# 构建镜像
docker build -t developer-tools .

# 运行容器
docker run -d -p 8080:80 --name developer-tools-app developer-tools
```

### 部署检查清单

- [ ] 确保所有环境变量已正确配置（如有）
- [ ] 测试生产构建：`npm run build && npm run preview`
- [ ] 检查路由是否正常（SPA 需要服务器配置回退到 index.html）
- [ ] 验证静态资源加载正常
- [ ] 测试移动端适配
- [ ] 配置 HTTPS（推荐）
- [ ] 设置适当的缓存策略
- [ ] 配置 CDN（可选，提升加载速度）

## 📁 项目结构

```
developer-tools/
├── src/
│   ├── assets/          # 静态资源
│   │   └── images/      # 图片资源
│   ├── components/      # 公共组件
│   │   ├── ui/          # UI 基础组件
│   │   ├── tool/        # 工具专用组件
│   │   └── CalendarCard.tsx
│   ├── hooks/           # 自定义 Hooks
│   ├── layouts/         # 布局组件
│   │   └── Layout.tsx   # 主布局（含侧边栏）
│   ├── pages/           # 页面组件
│   │   └── Home.tsx     # 首页
│   ├── tools/           # 工具组件
│   │   ├── JsonFormatter.tsx
│   │   ├── Base64.tsx
│   │   └── ...
│   ├── lib/             # 工具函数
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/              # 公共静态资源
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 技术栈

### 核心框架
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具（使用 Rolldown）

### UI 框架
- **Tailwind CSS** - CSS 框架
- **Lucide React** - 图标库
- **Radix UI** - 无样式的 UI 组件

### 功能库
- **React Router** - 路由管理
- **dayjs** - 日期处理
- **crypto-js** - 加密库
- **diff** - 文本对比
- **qrcode** - 二维码生成
- **lunar-typescript** - 农历日期
- **axios** - HTTP 请求
- **xlsx** - Excel 文件处理

### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript ESLint** - TypeScript 代码检查

## 🌟 功能亮点

### 响应式侧边栏
- 支持展开/收起两种模式
- 收起模式下悬停显示工具菜单
- 移动端抽屉式导航

### 精美 UI 设计
- 渐变色卡片设计
- 平滑过渡动画
- 统一的配色方案

### 实时预览
- 所见即所得的操作体验
- 实时错误提示
- 快捷操作支持

### 数据隐私
- 所有处理在浏览器本地完成
- 不收集任何用户数据
- 不向服务器发送敏感信息

## 📝 开发计划

- [ ] 添加更多工具
- [ ] 支持深色模式
- [ ] 添加工具收藏功能
- [ ] 支持本地存储数据
- [ ] 添加 PWA 支持
- [ ] 国际化支持
- [ ] 添加键盘快捷键

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的修改 (`git commit -m 'Add some AmazingFeature'`)
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
