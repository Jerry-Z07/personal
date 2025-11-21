# 项目技术栈规则

## 核心技术栈

### 前端框架
- **React 19.2.0** - 主要前端框架
- **Vite 7.2.4** - 构建工具和开发服务器
- **TypeScript支持** - 通过 `@types/react` 和 `@types/react-dom`

### 样式系统
- **Tailwind CSS 4.1.17** - 原子化CSS框架
- **PostCSS** - CSS处理器
- **Autoprefixer** - 自动添加浏览器前缀

### 动画和图标
- **Framer Motion** - React动画库
- **Remix Icon** - 开源图标库

## 开发环境配置

### 构建配置
- **Vite配置**: `vite.config.js`
- **PostCSS配置**: `postcss.config.js` 
- **Tailwind配置**: `tailwind.config.js`
- **ESLint配置**: `eslint.config.js`


### 脚本命令
- `npm run dev` - 启动开发服务器 (http://localhost:5173/)
- `npm run build` - 构建生产版本
- `npm run preview` - 预览构建结果
- `npm run lint` - 运行ESLint检查

## 项目结构

```
src/
├── main.jsx          # 应用入口点
├── App.jsx           # 主应用组件
├── index.css         # 全局样式和Tailwind导入
└── assets/           # 静态资源
    └── react.svg
```

## 开发规范

### 组件开发
- 使用函数组件和Hooks
- 优先使用Tailwind CSS进行样式设计
- 合理使用Framer Motion创建流畅动画

### 样式指南
- 遵循Tailwind CSS原子化设计原则
- 使用自定义组件类时，在`@layer components`中定义
- 保留原生CSS用于复杂动画和过渡效果

### 图标使用
- 使用Remix Icon图标库
- 图标类名格式: `ri-{icon-name}-line` 或 `ri-{icon-name}-fill`
- 示例: `<i className="ri-home-line"></i>`

## 性能优化
- 使用Vite的快速热更新
- 合理使用React.memo进行组件优化
- 利用Framer Motion的动画性能优化

## 浏览器兼容性
- 通过Autoprefixer自动处理浏览器前缀
- 支持现代浏览器 (Chrome 88+, Firefox 85+, Safari 14+)
