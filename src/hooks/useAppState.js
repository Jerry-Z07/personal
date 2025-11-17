import { useStore } from '../stores';

/**
 * 应用全局状态管理的综合Hook
 * 提供对所有应用状态和操作的访问，适合需要完整功能的组件
 */
export const useAppState = () => {
  // 从store中提取所有状态和操作方法
  const store = useStore();
  
  // 解构核心功能，方便直接使用
  const {
    ui,
    tabs,
    callbacks,
    setUIState,
    setTabState,
    setCallbackRef,
    handleBackToHome,
    handleMainTabChange,
    handleSubTabChange,
    handleRefresh,
    handleScrollIndicatorClick,
    initializeFromStorage
  } = store;

  return {
    // 完整store引用
    store,
    // 分组状态
    ui,
    tabs,
    callbacks,
    // 核心操作方法
    setUIState,
    setTabState,
    setCallbackRef,
    // 业务逻辑处理方法
    handleBackToHome,
    handleMainTabChange,
    handleSubTabChange,
    handleRefresh,
    handleScrollIndicatorClick,
    initializeFromStorage
  };
};