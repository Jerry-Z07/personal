# 项目规则文档

## 项目简介

本项目是一个基于 React 19 的个人展示网站，采用现代前端技术栈构建，支持响应式设计和国际化。主要功能包括个人简介、Bilibili动态展示、博客文章聚合等模块。

## 技术栈

### 核心框架
- **React** (v19.1.1) - 使用函数式组件和 Hooks
- **Vite** (v7.1.7) - 构建工具和开发服务器
- **Zustand** (v5.0.8) - 轻量级状态管理库
- **React Query** (v5.90.9) - 用于数据获取、缓存和状态管理
- **项目类型**: ES Module

### UI与动画
- **Framer Motion** (v12.23.24) - 页面过渡和元素动画
- **@fluentui/react** (v8.125.0) - UI组件库
- **@fluentui/react-components** (v9.72.3) - Fluent UI v9组件
- **@fluentui/react-icons** - Fluent UI 图标库（通过按需引入）
- **Remix Icon** (v4.7.0) - 图标库，通过类名引用（如：ri-github-fill）

### 国际化
- **i18next** (v25.6.0) - 核心国际化库
- **react-i18next** (v16.2.4) - React国际化集成
- **i18next-browser-languagedetector** (v8.2.0) - 浏览器语言检测
- **支持语言**: 简体中文（zh-CN）、英语（en-US）
- **配置位置**: src/i18n/

### 字体
- **LXGW WenKai Screen** - 霞鹜文楷屏幕阅读版
- **加载方式**: CDN
- **字体名称**: 'LXGW WenKai Screen'

### 开发工具
- **ESLint** (v9.36.0) - 代码规范检查
- **@vitejs/plugin-react** (v5.0.4) - Vite的React插件
- **npm** - 包管理器

## 项目架构

### 目录结构
```
src/
├── components/          # React组件（含对应CSS样式文件）
├── i18n/               # 国际化配置
│   ├── config.js       # i18n初始化配置
│   ├── index.js        # 导出i18n实例
│   └── locales/        # 翻译资源
│       ├── zh-CN/      # 中文翻译
│       └── en-US/      # 英文翻译
├── hooks/              # 自定义React Hooks
│   ├── useAppState.js        # 应用状态管理
│   ├── useCallbackRefs.js    # 回调引用管理
│   ├── useInteractionHandling.js # 交互处理逻辑
│   ├── useTabState.js        # 标签状态管理
│   └── useUIState.js         # UI状态管理
├── query/              # React Query相关文件
│   ├── config.js       # React Query配置
│   ├── index.js        # 导出queryClient实例
│   └── useQueries.js   # 自定义查询hooks
├── stores/             # Zustand状态管理
│   └── index.js        # 主状态store
├── utils/              # 工具函数
│   └── formatters.js   # 格式化工具，包含 formatLargeNumber 等通用格式化函数，用于统一处理数字显示格式
├── cacheManager.js     # React Query缓存包装器（轻量级接口）
├── dataPreloader.js    # 数据预加载器（使用React Query）
├── App.jsx             # 主应用组件
└── main.jsx            # 应用入口
```

### 核心组件

#### 页面结构组件
- **Header** - 主页页眉，包含品牌标识和语言/主题切换器
- **SecondaryHeader** - 二级页眉，包含标签导航（简介、Bilibili、博客、GitHub）和刷新按钮
- **Footer** - 页脚组件
- **PersonalTitle** - 主页个人标题展示
- **BackToTopButton** - 返回主页按钮（PC端显示）

#### 内容组件
- **ContentArea** - 内容路由容器，根据 mainTab 和 subTab 渲染不同内容
- **IntroContent** - 个人简介内容
- **NicknameContent** - 昵称说明内容
- **ProjectsContent** - 项目展示内容
- **BilibiliContent** - Bilibili动态展示（支持缓存和刷新）
- **BlogContent** - 博客文章聚合（支持缓存和刷新）

#### 通用组件
- **AnimatedContent** - 提供统一动画配置的包装组件，减少重复代码
- **DataContent** - 通用数据获取、缓存、加载状态管理组件
- **Background** - 动态背景图片组件，支持随机图片获取
- **Navigation** - 通用导航组件

#### 导航组件
- **SidebarNav** - 侧边栏导航（仅在intro主标签下显示）
- **LanguageSwitcher** - 语言和主题切换下拉菜单

#### 辅助组件
- **LoadingMask** - 加载遮罩（等待字体和背景图加载）
- **ScrollIndicator** - 滚动指示器（PC端）
- **BackgroundBlur** - 背景模糊层

### 关键特性

#### 1. 双页面架构
- **主页**: 显示 PersonalTitle 和 ScrollIndicator
- **二级页面**: 显示 SecondaryHeader + ContentArea（根据标签切换内容）
- **状态管理**: 使用 Zustand + sessionStorage 管理应用状态，刷新后自动恢复标签状态

#### 2. 响应式设计
- **断点**: 768px（移动端/PC端分界）
- **PC端**: 支持滚动触发、触摸滑动、返回主页按钮
- **移动端**: 直接显示二级页面，点击返回按钮回到主页

#### 3. 主题系统
- **主题模式**: 浅色（light）/ 深色（dark）/ 跟随系统（system）
- **实现方式**: 通过 `data-theme` 属性控制，不使用 CSS 媒体查询
- **CSS选择器**: 
  - 深色主题: `html[data-theme="dark"]` 或 `html:not([data-theme])`
  - 浅色主题: `html[data-theme="light"]`
- **存储**: localStorage（key: 'theme'）
- **监听系统**: 跟随系统模式时监听 `prefers-color-scheme` 变化

#### 4. 数据缓存机制
- **缓存管理器**: 使用 React Query 进行数据获取和缓存
- **缓存包装器**: cacheManager.js（提供简化的 React Query 接口，完全依赖React Query管理缓存）
- **缓存有效期**: 5分钟（300000ms），通过 staleTime 和 gcTime 参数设置
- **配置文件**: src/query/config.js
- **查询键**: 使用数组格式的查询键，如 ['bilibiliData']
- **重试策略**: 查询失败时最多重试1次
- **窗口聚焦**: 默认不重新获取数据（refetchOnWindowFocus: false）
- **重连时**: 始终重新获取数据（refetchOnReconnect: 'always'）
- **支持功能**: 
  - 自动过期检测和数据重获取
  - 手动刷新（使用 queryClient.invalidateQueries）
  - 预加载数据（使用 queryClient.prefetchQuery）
  - 页面加载时优先使用缓存
- **应用场景**: Bilibili 数据、Blog 数据
- **自定义 Hooks**: 通过 useQueries.js 提供统一的数据获取接口

#### 5. 数据预加载
- **触发时机**: 页面加载完成后（字体和背景图都加载完成）
- **预加载内容**: Bilibili 数据、Blog 数据
- **实现方式**: 使用 React Query 的 queryClient.prefetchQuery 方法进行后台静默预加载，通过 Promise.all 并行加载
- **缓存配置**: 设置 staleTime 为 5 分钟，确保预加载的数据在缓存有效期内不会重新获取

#### 6. 国际化
- **检测顺序**: localStorage → 浏览器语言 → 默认语言（zh-CN）
- **存储位置**: localStorage（key: 'i18nextLng'）
- **使用方式**: 组件中使用 `useTranslation()` 钩子
- **动态更新**: 切换语言时自动更新页面标题和 html lang 属性

#### 构建优化
- **代码分割**: 按供应商库分类打包（React、i18n、Fluent UI、动画库）
- **代理配置**: 开发环境支持API代理和生产环境CORS代理
- **Chunk优化**: 调整chunk大小警告阈值至800KB
- **Fluent UI分组**: 
  - 核心组件: `@fluentui/react` 和 `@fluentui/react-components`
  - 图标库: `@fluentui/react-icons` 单独打包

### 开发规范

#### 文件命名
- 组件文件: PascalCase（如：MyComponent.jsx）
- 工具函数: camelCase（如：cacheManager.js）
- 样式文件: 与组件文件同名（如：MyComponent.css）

#### 组件开发
**务必保证统一的设计风格**
1. 所有组件使用函数式组件，不使用类组件
2. 使用 React Hooks 管理状态和副作用
3. 使用 Zustand 进行全局状态管理（`src/stores/index.js`）
4. 使用 Framer Motion 添加动画效果
5. 每个组件对应一个独立的 CSS 文件
6. 按钮使用圆角样式（border-radius: 8px）
7. 使用 Remix Icon 图标库（通过类名引用）
8. 使用 `useTranslation()` 实现国际化
9. 保持组件单一职责原则
10. 复用 AnimatedContent 和 DataContent 等通用组件

#### 主题适配规范
- 使用 `html[data-theme="dark"]` 和 `html[data-theme="light"]` 选择器
- 默认深色主题: `html[data-theme="dark"], html:not([data-theme])`
- 深色模式容器背景参考: `rgba(0, 0, 0, 0.7)`
- 必须同时适配深色和浅色两种主题

#### 动画规范
- 悬停动画过渡时间: 0.15s ~ 0.2s
- 呼吸效果周期: 3秒，使用 ease-in-out
- 页面过渡使用 `AnimatePresence` 组件包裹
- 合理使用动画优化选项（如 `layoutId`）

#### 性能优化
1. 使用 React.memo 优化组件重渲染
2. 实现数据缓存和预加载机制
3. 避免不必要的依赖包引入
4. 使用 AnimatePresence 管理元素的进入和退出动画

#### 代码风格
1. 使用 ESLint 进行代码规范检查
2. 代码缩进: 2个空格
3. 添加必要注释说明复杂逻辑
4. 使用 ES6+ 语法（箭头函数、解构赋值等）

## 开发环境

### NPM 脚本命令
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码规范检查
npm run lint

# 预览生产构建
npm run preview
```

### API 代理配置

**配置文件**: vite.config.js

#### 开发环境代理
1. **Bilibili API**
   - 代理路径: `/api`
   - 目标地址: `https://uapis.cn`
   - 路径重写: 保持原路径不变

2. **博客 RSS Feed**
   - 代理路径: `/blog-feed`
   - 目标地址: `https://blog.078465.xyz`
   - 路径重写: `/blog-feed` → `/feed`

#### 生产环境
- 使用 CORS 代理服务: `https://cors1.078465.xyz/v1/proxy/?quest=`
- API URL 通过 `import.meta.env.MODE` 判断环境自动切换
- 在 useQueries.js 和 dataPreloader.js 中实现环境切换逻辑

### 响应式设计

**断点**: 768px（移动端/PC端分界）

**判断方式**: 
```javascript
const isMobile = () => window.innerWidth <= 768;
```

**差异化设计**:
- **移动端 (≤768px)**: 
  - 直接显示二级页面
  - 显示返回按钮
  - 不显示滚动指示器
  - 不显示返回主页按钮
  
- **PC端 (>768px)**:
  - 支持滚动触发页面切换
  - 支持触摸滑动
  - 显示滚动指示器
  - 显示返回主页按钮

### 项目特定规范

#### 状态管理规范
- 使用 Zustand 管理全局状态（`src/stores/index.js`）
- 状态包括: UI状态、标签状态、刷新回调等
- 标签状态自动同步到 sessionStorage，实现页面刷新后状态恢复
- 刷新回调通过 ref 的方式在组件间传递

#### PC端卡片规范
- ProjectsContent 组件中，PC端卡片最小宽度: 500px
- 需相应调整内边距、字体大小和按钮尺寸

#### 标签交互规范
- 选中标签添加呼吸效果（3秒周期，ease-in-out，光晕强度0-50%）
- 刷新按钮悬停效果与对应标签一致（轻微上移+放大，3秒呼吸光效）
- 禁止刷新按钮使用旋转动画
- 不同标签使用不同主题色

#### 语言切换按钮规范
- 位置: 页眉 Jerry.Z 文字右侧
- 间距: 与文字保持 1rem 间距
- 高度: Jerry.Z 文字高度的一半（0.8em）

#### 背景图片规范
- 支持动态随机背景图片获取
- 图片加载完成后触发 `backgroundImageLoaded` 事件
- 与字体加载配合，通过 LoadingMask 组件管理加载状态

#### 通用组件规范
- **AnimatedContent**: 提供统一动画配置，减少重复代码，支持自定义动画变体和属性
- **DataContent**: 基于 React Query 实现的数据获取、缓存和错误处理组件，支持自定义加载和错误状态
- **Background**: 动态背景图片管理，支持随机图片API
- 新组件应优先复用现有通用组件
