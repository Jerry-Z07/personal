# 项目技术栈规则

## 技术栈概述

本项目使用以下技术栈：

### 前端框架
- **React** - 用于构建用户界面的JavaScript库 (v19.1.1)
- **Vite** - 快速的构建工具和开发服务器 (v7.1.7)

### UI组件库
- **Fluent UI React** - Microsoft开发的React组件库，提供现代化的UI组件
  - @fluentui/react - 核心组件库 (v8.125.0)
  - @fluentui/react-components - 新版组件库（Fluent UI v9）(v9.72.3)

### 图标库
- **Remix Icon** - 简洁、现代的图标库 (v4.7.0)

### 动画库
- **Framer Motion** - React的动画和手势库，用于创建流畅的动画效果 (v12.23.24)

### 字体库
- **LXGW WenKai** - 霞鹜文楷字体，提供优雅的中文字体显示 (v1.7.0)

### 开发工具
- **ESLint** - 代码质量检查工具 (v9.36.0)
- **npm** - 包管理器

## 项目结构规则

### 文件命名
- 组件文件使用PascalCase命名（如：MyComponent.jsx）
- 工具函数和常量使用camelCase命名（如：utils.js）
- 样式文件与组件文件同名（如：MyComponent.css）

### 组件开发规范
**务必保证统一的设计风格**
1. 使用Framer Motion添加动画效果，包括页面过渡、元素进入/退出动画
2. 保持组件的单一职责原则
3. 使用CSS模块化方式管理样式，每个组件对应一个CSS文件
4. 按钮组件使用圆角样式（border-radius: 8px）
5. 适配深色和浅色主题，使用CSS媒体查询实现
6. 使用Remix Icon图标库，通过类名引用图标
7. 组件使用React Hooks管理状态和副作用

### 性能优化
1. 使用React.memo优化组件重渲染
2. 合理使用Framer Motion的动画优化选项
3. 避免不必要的依赖包引入
4. 使用AnimatePresence组件管理元素的进入和退出动画

### 代码风格
1. 使用ESLint配置进行代码规范检查
2. 保持一致的代码缩进（2个空格）
3. 添加必要的注释说明复杂逻辑
4. 使用ES6+语法，包括箭头函数、解构赋值等
5. 组件使用函数式组件和Hooks

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint

# 预览生产构建
npm run preview
```

## API代理配置

项目配置了API代理，开发环境下将 `/api` 路径的请求代理到 `https://uapis.cn`。

## 响应式设计

项目采用移动优先的响应式设计策略，支持以下断点：
- 手机：xs (< 600px)
- 平板：sm (600px - 900px)
- 桌面：md (900px - 1200px)
- 大屏：lg (> 1200px)
