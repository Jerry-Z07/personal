# 网站技术栈与结构总结

## 🎯 项目概述
这是一个现代化的个人网站项目，采用React + Vite技术栈，具有动画效果、响应式设计和国际化支持。

## 🛠️ 核心技术栈

### 前端框架
- **React** - UI组件库
- **Vite** - 构建工具和开发服务器
- **JavaScript (ES6+)** - 编程语言

### 动画与样式
- **Framer Motion** - 动画库，用于页面过渡和元素动画
- **CSS3** - 样式表，包含现代CSS特性
  - Flexbox布局
  - CSS Grid
  - CSS自定义属性
  - 媒体查询实现响应式设计

### 开发工具
- **Node.js** - 运行环境
- **npm** - 包管理器

## 📁 项目结构

### 根目录文件
```
├── index.html              # 主入口HTML文件
├── package.json           # 项目依赖和脚本配置
├── vite.config.js        # Vite构建配置
├── jsconfig.json         # JavaScript项目配置
├── robots.txt            # SEO机器人配置
├── sitemap.xml           # 网站地图
├── generate-sitemap.js   # 网站地图生成脚本
├── .gitignore           # Git忽略文件配置
└── lang.js              # 语言配置文件
```

### 源代码目录 (src/)
```
src/
├── App.jsx              # 主应用组件，包含页面逻辑和动画
├── main.jsx             # React应用入口文件
├── index.css            # 全局样式文件
└── components/          # 可复用组件
    ├── AnimatedButton.jsx    # 动画按钮组件
    ├── AnimatedText.jsx      # 动画文本组件
    └── PageTransition.jsx    # 页面过渡组件
```

### 传统JS/CSS文件
```
├── js/                  # JavaScript功能模块
│   ├── main.js         # 主逻辑文件
│   ├── background.js   # 背景动画逻辑
│   ├── clock.js        # 时钟功能
│   ├── config.js       # 配置管理
│   ├── events.js       # 事件处理
│   ├── overlay.js      # 覆盖层管理
│   ├── storage.js      # 本地存储
│   ├── translations.js # 国际化翻译
│   ├── typing.js       # 打字机效果
│   └── utils.js        # 工具函数
└── styles/             # CSS样式文件
    ├── base.css        # 基础样式
    ├── main.css        # 主样式
    ├── background.css  # 背景样式
    ├── buttons.css     # 按钮样式
    ├── clock.css       # 时钟样式
    ├── panel.css       # 面板样式
    ├── responsive.css  # 响应式设计
    ├── tips.css        # 提示样式
    └── footer.css      # 页脚样式
```

## 🎨 动画系统架构

### 动画组件层次
1. **外层容器动画** - 页面加载时的淡入效果
2. **文本动画** - 标题和副标题的打字机效果
3. **按钮组动画** - 按钮的依次出现效果
4. **悬停动画** - 鼠标悬停时的缩放效果

### 动画参数配置
```javascript
// 当前使用的动画参数
transition: {
  duration: 0.4,    // 动画持续时间
  delay: 0.8,       // 延迟开始时间
  stagger: 0.1      // 元素间延迟间隔
}
```

## 📱 响应式设计

### 断点设置
- **移动端**: < 768px
- **平板端**: 768px - 1024px  
- **桌面端**: > 1024px

### 响应式特性
- 按钮组自动换行
- 字体大小自适应
- 容器宽度动态调整
- 移动端优化的触摸区域

## 🚀 开发脚本

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🔧 开发建议

### 组件开发
1. 使用Framer Motion实现动画效果
2. 保持组件的独立性和可复用性
3. 遵循React Hooks最佳实践
4. 使用语义化的CSS类名

### 样式管理
1. 全局样式放在`index.css`
2. 组件特定样式使用CSS Modules或内联样式
3. 使用CSS自定义变量管理主题色彩
4. 优先使用现代CSS布局技术

### 性能优化
1. 合理使用React.memo防止不必要的重渲染
2. 动画使用硬件加速属性
3. 图片资源进行压缩和格式优化
4. 代码分割和懒加载

### 代码组织
1. 组件文件使用Pascal命名法
2. 工具函数使用camel命名法
3. 保持文件结构清晰
4. 添加适当的代码注释
