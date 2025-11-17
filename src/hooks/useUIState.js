import { useStore } from '../stores';

/**
 * UI状态管理的自定义Hook
 * 封装UI相关的状态和操作，简化组件中的状态管理
 */
export const useUIState = () => {
  // 从store中提取UI状态和操作方法
  const {
    ui: { isLoading, showSecondaryHeader, showViewportContent },
    setUIState
  } = useStore();

  // 封装常用的UI状态更新方法
  const setIsLoading = (loading) => setUIState({ isLoading: loading });
  const setShowSecondaryHeader = (show) => setUIState({ showSecondaryHeader: show });
  const setShowViewportContent = (show) => setUIState({ showViewportContent: show });

  return {
    // UI状态
    isLoading,
    showSecondaryHeader,
    showViewportContent,
    // UI操作方法
    setIsLoading,
    setShowSecondaryHeader,
    setShowViewportContent,
    setUIState
  };
};