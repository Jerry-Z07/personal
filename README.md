# Personal Homepage

一个现代化的个人主页项目，采用 Bento 布局设计，集成 Bilibili 数据展示和博客 RSS 功能。

## 功能特性

- **Bento 布局**：美观的响应式卡片布局
- **诗词打字机动画**：每日诗词展示，带有优雅的打字效果
- **主题切换**：支持 light/dark/system 三种模式，支持 localStorage 持久化
- **Bilibili 数据**：集成用户信息和视频列表展示
- **博客 RSS**：自动拉取并解析博客文章
- **Canvas 光效**：卡片悬停时的动态光效
- **响应式设计**：完美适配桌面端和移动端

## 技术栈

- **React 19** + **TypeScript**：类型安全的组件开发
- **Vite**：快速的开发和构建工具
- **Tailwind CSS 4**：原子化 CSS 框架
- **Framer Motion**：流畅的动画效果
- **React Router 7**：路由管理

## 项目结构

```
├── src/
│   ├── components/          # UI 组件
│   │   ├── BentoCard.tsx    # Bento 卡片（含 Canvas 光效）
│   │   ├── Modal.tsx        # 弹窗/抽屉组件
│   │   ├── BilibiliUserInfo.tsx
│   │   ├── BilibiliVideoList.tsx
│   │   ├── BlogList.tsx
│   │   ├── RootLayout.tsx
│   │   └── motionPresets.ts
│   ├── hooks/
│   │   ├── useData.ts       # 数据获取 Hook
│   │   └── useThemeMode.ts  # 主题管理 Hook
│   ├── utils/
│   │   ├── api.ts           # API 工具函数
│   │   └── cn.ts            # Tailwind 类名合并
│   ├── types/
│   │   └── domain.ts        # 类型定义
│   ├── styles/
│   │   └── inline-style-fixes.css
│   ├── App.tsx
│   └── main.tsx
├── edge-functions/          # EdgeOne 边缘函数
│   └── api/
│       └── proxy.js         # CORS 代理
├── docs/                    # 项目文档
└── public/                  # 静态资源
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
npm run typecheck
```

## 环境变量

项目支持以下环境变量（参考 `.env.example`）：

```env
# CORS 代理地址
VITE_CORS_PROXY_ENDPOINT=/api/proxy
```
