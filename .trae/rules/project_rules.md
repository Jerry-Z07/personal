# 项目技术栈规则

## 核心技术栈

### 前端框架
- **React 19.2.0** - 主要前端框架 (使用函数组件和Hooks)
- **Vite 7.2.4** - 构建工具和开发服务器
- **TypeScript支持** - 已安装TypeScript依赖，但实际使用JSX格式
- **PropTypes** - 用于JavaScript类型检查

### 样式系统
- **Tailwind CSS 4.1.17** - 原子化CSS框架
- **PostCSS** - CSS处理器 (配置使用 `@tailwindcss/postcss` 插件)
- **Autoprefixer** - 自动添加浏览器前缀
- **clsx** - 条件类名合并工具
- **tailwind-merge** - 合并Tailwind CSS类名 (封装为 `cn()` 函数)

### 动画和图标
- **Framer Motion** - React动画库 (布局动画、悬停效果、弹窗动画)
- **Remix Icon** - 开源图标库

## 开发环境配置

### 构建配置
- **Vite配置**: `vite.config.js` (基础React插件配置)
- **PostCSS配置**: `postcss.config.js` (使用新版本Tailwind CSS语法)
- **Tailwind配置**: `tailwind.config.js` (扩展主题和自定义动画)
- **ESLint配置**: `eslint.config.js` (使用ESLint 9.x Flat Config)

### 脚本命令
- `npm run dev` - 启动开发服务器 (http://localhost:5173/)
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果

## 项目结构

```
src/
├── main.jsx              # React应用入口点
├── App.jsx               # 主应用组件 (Bento卡片布局 + 动画弹窗)
├── index.css             # 全局样式和Tailwind导入
├── App.css               # App组件样式
├── components/           # 组件目录
│   ├── BentoCard.jsx     # 可复用Bento卡片组件
│   ├── BilibiliUserInfo.jsx # B站用户信息组件
│   ├── BilibiliVideoList.jsx # B站视频列表组件
│   └── Modal.jsx         # 模态弹窗组件
├── hooks/                # 自定义Hooks目录
│   └── useData.js        # 数据获取相关Hooks
├── utils/                # 工具函数目录
│   └── api.js            # API接口和数据处理工具
└── assets/               # 静态资源
    └── react.svg
```

## 开发规范

### 组件开发
- 使用函数组件和Hooks
- 优先使用Tailwind CSS进行样式设计
- 合理使用Framer Motion创建流畅动画
- 使用PropTypes进行组件类型检查
- 组件放置在 `src/components/` 目录下
- 组件命名使用PascalCase格式
- 为组件添加适当的JSDoc注释说明

### 样式指南
- 遵循Tailwind CSS原子化设计原则
- 使用自定义组件类时，在`@layer components`中定义
- 保留原生CSS用于复杂动画和过渡效果
- 支持深色模式 (dark模式)
- 使用半透明效果和backdrop-blur增强视觉层次

### 图标使用
- 使用Remix Icon图标库
- 图标类名格式: `ri-{icon-name}-line` 或 `ri-{icon-name}-fill`
- 示例: `<i className="ri-home-line"></i>`

### Bento布局规范
- 使用响应式网格布局 (md:grid-cols-3)
- 卡片大小通过 `md:col-span-{x}` 和 `md:row-span-{y}` 控制
- 卡片组件使用 `BentoCard` 进行统一封装
- 支持点击展开的弹窗动画效果

## 性能优化
- 使用Vite的快速热更新
- 合理使用React.memo进行组件优化
- 利用Framer Motion的布局动画性能优化
- 使用 `cn()` 函数合并CSS类名避免重复

## 动画特性
- 页面滚动时的入场动画 (`whileInView`)
- 卡片悬停缩放效果 (`whileHover`)
- 点击反馈缩放 (`whileTap`)
- 弹窗布局变形动画 (`layoutId`)
- 模态框过渡动画 (`AnimatePresence`)
- 使用Canvas实现卡片聚光灯效果
- 加载状态使用骨架屏动画 (`animate-pulse`)

## API服务与数据处理

### Bilibili集成
- 使用第三方API服务获取B站用户信息和视频列表
- API基础URL: `https://uapis.cn/api/v1/social/bilibili/`
- 支持获取用户基本信息、粉丝数、视频数量
- 支持获取最近发布的视频列表，包括封面、标题、播放量等

### 数据格式化工具
- `formatPlayCount`: 格式化播放量数字（转换为万单位）
- `formatDuration`: 格式化视频时长（秒转换为分:秒格式）
- `formatPublishTime`: 格式化发布时间（显示为今天/昨天/X天前或具体日期）


## 浏览器兼容性
- 通过Autoprefixer自动处理浏览器前缀
- 支持现代浏览器 (Chrome 88+, Firefox 85+, Safari 14+)
- 响应式设计支持移动端和桌面端
