# 状态管理架构

本项目使用 Zustand 进行状态管理，将应用状态集中管理，减少组件间的状态传递和代码冗余。

## 状态管理模块

### 1. 应用状态 (appStore.js)

负责管理全局应用状态，包括：

- **加载状态**：`isLoading`, `setIsLoading`
- **UI状态**：`showSecondaryHeader`, `showViewportContent`
- **标签状态**：`mainTab`, `subTab`, `lastMainTab`, `lastSubTab`
- **刷新回调**：`refreshBilibiliRef`, `refreshBlogRef`, `setRefreshBilibiliRef`, `setRefreshBlogRef`
- **操作方法**：`handleBackToHome`, `handleScrollIndicatorClick`, `handleMainTabChange`, `handleSubTabChange`, `handleRefresh`
- **工具方法**：`isMobile`

#### 使用示例

```jsx
import { useAppStore } from '../store';

function MyComponent() {
  const { 
    isLoading, 
    mainTab, 
    handleMainTabChange, 
    handleBackToHome 
  } = useAppStore();
  
  // 使用状态和方法
  const handleTabClick = () => {
    handleMainTabChange('bilibili');
  };
  
  return (
    <div>
      {isLoading ? '加载中...' : '内容'}
      <button onClick={handleTabClick}>切换到Bilibili</button>
    </div>
  );
}
```

### 2. 语言状态 (languageStore.js)

负责管理应用语言状态：

- **当前语言**：`currentLanguage`
- **操作方法**：`setLanguage`, `toggleLanguage`

#### 使用示例

```jsx
import { useLanguageStore } from '../store';

function LanguageComponent() {
  const { currentLanguage, toggleLanguage } = useLanguageStore();
  
  return (
    <div>
      <p>当前语言: {currentLanguage}</p>
      <button onClick={toggleLanguage}>切换语言</button>
    </div>
  );
}
```

### 3. 主题状态 (themeStore.js)

负责管理应用主题状态：

- **当前主题**：`theme`
- **操作方法**：`setTheme`, `getSystemTheme`, `getEffectiveTheme`, `getThemeIcon`, `applyTheme`

#### 使用示例

```jsx
import { useThemeStore } from '../store';

function ThemeComponent() {
  const { theme, setTheme, getThemeIcon } = useThemeStore();
  
  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={() => setTheme('dark')}>切换到深色主题</button>
      <i className={getThemeIcon()}></i>
    </div>
  );
}
```

## 状态持久化

应用使用 Zustand 的 `persist` 中间件实现状态持久化：

- **应用状态**：保存在 `sessionStorage` 中，页面关闭后清除
- **语言状态**：保存在 `localStorage` 中，持久保存
- **主题状态**：保存在 `localStorage` 中，持久保存

## 迁移指南

从 React 本地状态迁移到 Zustand 状态管理的步骤：

1. 确定需要全局管理的状态
2. 在相应的 store 文件中定义状态和方法
3. 在组件中导入并使用 `useStore()` 钩子
4. 删除组件中的本地状态定义和相关的处理逻辑

## 注意事项

1. 避免在状态更新时修改原始对象，始终使用不可变更新
2. 对于复杂的状态更新逻辑，可以在 store 中定义专门的方法
3. 使用 `partialize` 选项来指定需要持久化的字段
4. 当状态更新依赖其他状态时，可以使用 `get()` 获取当前状态