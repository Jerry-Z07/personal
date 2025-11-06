---
trigger: always_on
alwaysApply: true
---
## 项目简介
本项目是一个基于React 19的个人展示网站，采用现代前端技术栈构建，支持响应式设计和国际化。主要功能包括个人简介、Bilibili动态展示、博客文章聚合等模块。

### 核心技术栈
- **框架**: React 19（使用函数式组件和Hooks）
- **构建工具**: Vite 7
- **动画库**: Framer Motion（页面过渡、元素动画）
- **UI库**: @fluentui/react、@fluentui/react-components
- **国际化**: react-i18next + i18next-browser-languagedetector（支持中英文切换）
- **图标库**: Remix Icon
- **字体**: LXGW WenKai Screen（通过CDN加载）
- **代码规范**: ESLint

### 项目架构

#### 目录结构
- `/src/components/` - React组件（含对应CSS样式文件）
- `/src/i18n/` - 国际化配置和翻译资源
- `/src/cacheManager.js` - 数据缓存管理器
- `/src/dataPreloader.js` - 数据预加载器

#### 核心组件说明
- **Header** - 主页眉，包含品牌标识和语言/主题切换器
- **SecondaryHeader** - 二级页眉，包含标签导航和刷新按钮
- **ContentArea** - 内容路由容器，根据mainTab和subTab渲染不同内容
- **SidebarNav** - 侧边栏导航（仅在intro主标签下显示）
- **LanguageSwitcher** - 语言和主题切换下拉菜单
- **BilibiliContent** / **BlogContent** - 数据展示组件（支持缓存和刷新）
- **LoadingMask** - 加载遮罩（等待字体和背景图加载）
- **BackToTopButton** - 返回主页按钮（PC端显示）

#### 关键特性
1. **双页面架构**：主页（PersonalTitle）和二级页面（标签内容区）
2. **响应式设计**：PC端和移动端有不同的交互方式
3. **主题系统**：支持浅色/深色/跟随系统三种主题，通过`data-theme`属性控制
4. **缓存机制**：Bilibili和Blog数据缓存5分钟，支持手动刷新和过期自动清除
5. **数据预加载**：页面加载完成后在后台预加载外部数据
6. **状态持久化**：使用sessionStorage保存标签状态，刷新页面后恢复

### 开发规范

#### 文件命名
- 组件文件使用PascalCase命名（如：MyComponent.jsx）
- 工具函数和常量使用camelCase命名（如：cacheManager.js）
- 样式文件与组件文件同名（如：MyComponent.css）

#### 组件开发
**务必保证统一的设计风格**
1. 使用Framer Motion添加动画效果，包括页面过渡、元素进入/退出动画
2. 保持组件的单一职责原则
3. 使用独立CSS文件管理样式，每个组件对应一个CSS文件
4. 按钮组件使用圆角样式（border-radius: 8px）
5. 适配深色和浅色主题，使用`data-theme`属性（而非CSS媒体查询）
6. 使用Remix Icon图标库，通过类名引用图标（如：`ri-github-fill`）
7. 所有组件使用函数式组件和React Hooks
8. 使用react-i18next的`useTranslation`钩子实现国际化

#### 主题适配规范
- 使用`html[data-theme="dark"]`和`html[data-theme="light"]`选择器
- 默认深色主题：`html[data-theme="dark"], html:not([data-theme])`
- 深色模式容器背景参考：`rgba(0, 0, 0, 0.7)`

#### 动画规范
- 悬停动画过渡时间：0.15s ~ 0.2s
- 呼吸效果周期：3秒，使用ease-in-out
- 页面过渡使用`AnimatePresence`组件包裹

#### 性能优化
1. 使用React.memo优化组件重渲染
2. 合理使用Framer Motion的动画优化选项
3. 避免不必要的依赖包引入
4. 使用AnimatePresence组件管理元素的进入和退出动画
5. 实现数据缓存和预加载机制

#### 代码风格
1. 使用ESLint进行代码规范检查
2. 保持一致的代码缩进（2个空格）
3. 添加必要的注释说明复杂逻辑
4. 使用ES6+语法，包括箭头函数、解构赋值等
5. 所有组件使用函数式组件和Hooks，不使用类组件

### 开发环境
- **命令**: `npm run dev` 启动开发服务器
- **构建**: `npm run build` 生产环境打包
- **预览**: `npm run preview` 预览构建结果
- **Lint**: `npm run lint` 执行代码规范检查
- **代理配置**: vite.config.js中配置了/api和/blog-feed代理

### 回复要求
**请使用中文回复**
1. 使用更加细化的步骤说明
2. 使用专业但是简单易懂的代码注释
3. 需要深入理解我的对话，包容不符合行业标准的表达
4. 创作的创意发挥度（80/100）
5. 我正在使用Windows系统，使用的终端是Windows PowerShell
6. 如果你无法完全理解我的对话，请在操作修改文件前反问我
7. 保持中立，不迎合用户，允许反问和质疑
8. 能从已有的代码、组件、包等复用的就不要重新实现，而是直接引用或调用
9. 不要使用迎合性语言（如“你说得对”、“你发现得好”等）