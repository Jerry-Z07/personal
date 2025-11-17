import { useStore } from '../stores';

/**
 * 标签状态管理的自定义Hook
 * 封装标签相关的状态和操作，简化组件中的标签管理
 */
export const useTabState = () => {
  // 从store中提取标签状态和操作方法
  const {
    tabs: { mainTab, subTab, lastMainTab, lastSubTab },
    setTabState,
    handleMainTabChange,
    handleSubTabChange,
    handleScrollIndicatorClick,
    initializeFromStorage
  } = useStore();

  return {
    // 标签状态
    mainTab,
    subTab,
    lastMainTab,
    lastSubTab,
    // 标签操作方法
    setTabState,
    handleMainTabChange,
    handleSubTabChange,
    handleScrollIndicatorClick,
    initializeFromStorage
  };
};