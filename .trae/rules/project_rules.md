# 项目技术栈规则

## 技术栈概述

本项目使用以下技术栈：

### 前端框架
- **React** - 用于构建用户界面的JavaScript库
- **Vite** - 快速的构建工具和开发服务器

### UI组件库
- **Fluent UI React** - Microsoft开发的React组件库，提供现代化的UI组件
  - @fluentui/react - 核心组件库
  - @fluentui/react-components - 新版组件库（Fluent UI v9）

### 动画库
- **Framer Motion** - React的动画和手势库，用于创建流畅的动画效果

### 开发工具
- **ESLint** - 代码质量检查工具
- **npm** - 包管理器

## 项目结构规则

### 文件命名
- 组件文件使用PascalCase命名（如：MyComponent.jsx）
- 工具函数和常量使用camelCase命名（如：utils.js）
- 样式文件与组件文件同名（如：MyComponent.css）

### 组件开发规范
1. 优先使用Fluent UI组件构建界面
2. 使用Framer Motion添加动画效果
3. 保持组件的单一职责原则
4. 使用Fluent UI的主题系统进行样式管理

### 性能优化
1. 使用React.memo优化组件重渲染
2. 合理使用Framer Motion的动画优化选项
3. 避免不必要的依赖包引入

### 代码风格
1. 使用ESLint配置进行代码规范检查
2. 保持一致的代码缩进（2个空格）
3. 添加必要的注释说明复杂逻辑

## 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```


## 响应式设计

项目采用移动优先的响应式设计策略，支持以下断点：
- 手机：xs (< 600px)
- 平板：sm (600px - 900px)
- 桌面：md (900px - 1200px)
- 大屏：lg (> 1200px)