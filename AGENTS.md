# Repository Guidelines

## 项目结构与模块分层
- `src/main.tsx`：应用启动入口，配置 `createBrowserRouter`，通过 `lazy + Suspense` 进行路由级代码分割，并挂载 `RootLayout`。
- `src/App.tsx`：首页 Bento 布局、诗词打字机动画、链接/项目/工具区块，以及弹层触发入口。
- `src/components/`：核心 UI 与交互组件。
  - `BentoCard.tsx`：卡片容器与 Canvas 光效。
  - `Modal.tsx`：桌面弹窗 + 移动端抽屉，按需懒加载内容组件。
  - `BilibiliUserInfo.tsx`、`BilibiliVideoList.tsx`、`BlogList.tsx`：弹层内容组件。
  - `RootLayout.tsx`：路由切换自动回顶。
  - `motionPresets.ts`：Framer Motion 公共动画预设。
- `src/hooks/useData.ts`：B 站用户/视频与博客 RSS 的数据获取 Hook，包含标准化、容错和刷新逻辑。
- `src/utils/api.ts`：API 请求、RSS 解析、时间/数字格式化与错误处理；`src/utils/cn.ts` 用于 Tailwind 类名合并。
- `src/types/domain.ts`：领域模型类型定义（B 站用户、视频、博客文章、弹层状态等）。
- `src/styles/inline-style-fixes.css`：从 JSX 抽离的内联样式与性能优化样式。
- `public/`：静态资源目录。
- `dist/`：构建产物目录（禁止直接修改）。
- `.github/workflows/auto-approve.yml`：Dependabot patch/minor 依赖更新自动审批与自动合并。
- `docs/`：当前为空目录，可用于后续补充项目文档。

## 构建、检查与开发命令
- `npm install`：安装依赖。
- `npm run dev`：启动 Vite 开发服务器（HMR）。
- `npm run typecheck`：运行 TypeScript 类型检查（`tsc --noEmit`）。
- `npm run lint`：运行 ESLint。
- `npm run build`：执行生产构建，输出到 `dist/`。
- `npm run preview`：本地预览生产构建结果。
- 可选质量工具：`qlty check`、`qlty fmt`、`qlty metrics [PATHS]...`、`qlty smells [PATHS]...`。
- 建议提交前最小校验：`npm run typecheck && npm run lint && npm run build`。

## 编码规范与命名约定
- 使用 React 函数组件与 Hooks，优先采用 TypeScript。
- 组件文件使用 `PascalCase.tsx`；Hook 文件使用 `useXxx.ts`；工具函数导出使用语义化 `camelCase`。
- 导入顺序保持一致：第三方依赖在前，本地模块在后。
- 对复杂实现（动画状态机、异步流程、容错分支）添加简洁中文注释；关键区域保留必要日志与错误处理。
- ESLint 规则中，未使用变量检查忽略以大写字母或 `_` 开头的标识符。
- 保持现有代码风格（引号、分号、Tailwind 类名组织）一致，避免无关格式化噪音。

## 测试与验证约定
- 当前仓库未配置 `npm test` 脚本。
- UI 或数据链路改动至少执行：`npm run typecheck && npm run lint && npm run build`。
- PR 中需补充手动验证步骤（桌面端 + 移动端 + API 异常场景）。
- 若新增测试，推荐 `Vitest + React Testing Library`，放置于 `src/__tests__/`，命名使用 `*.test.tsx`。
- Node 环境测试需 mock/polyfill 浏览器 API（如 `fetch`、`DOMParser`）。

## 提交与 PR 规范
- 使用 Conventional Commits：`type(scope): summary`（如 `feat(Modal): ...`、`refactor(styles): ...`）。
- 常用类型：`feat`、`fix`、`refactor`、`chore`、`docs`、`perf`。
- PR 需包含：变更目的、关键改动、验证步骤、关联 Issue（如有）、UI 变更截图/录屏（如有）。
- 保持 PR 小而聚焦，避免混入无关重构。

## 安全与配置注意事项
- `src/utils/api.ts` 内含固定 `USER_UID` 与 CORS 代理地址；改动 API 逻辑时需同时验证开发与生产请求路径（`requestByEnv` 在生产走代理）。
- `fetchDailyPoemText`、`fetchBlogFeed` 默认经代理访问外部资源，需保留异常处理与降级逻辑。
- `formatPublishTime` 约定输入为 Unix 秒级时间戳（非毫秒）。
- 禁止提交密钥或敏感配置，环境相关值仅放入 `.env`。
- 当前实际入口文件为 `src/main.tsx`，若调整 HTML 中模块入口路径，需保持与源码一致以避免启动失败。

## 特有可用 MCP 工具
- `chrome-devtools`：辅助调试网页。
