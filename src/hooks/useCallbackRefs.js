import { useStore } from '../stores';

/**
 * 回调引用管理的自定义Hook
 * 封装刷新回调相关的状态和操作
 */
export const useCallbackRefs = () => {
  // 从store中提取回调引用和操作方法
  const {
    callbacks: { refreshBilibiliRef, refreshBlogRef },
    setCallbackRef
  } = useStore();

  // 封装常用的回调设置方法
  const setRefreshBilibiliRef = (callback) => setCallbackRef('refreshBilibiliRef', callback);
  const setRefreshBlogRef = (callback) => setCallbackRef('refreshBlogRef', callback);

  return {
    // 回调引用
    refreshBilibiliRef,
    refreshBlogRef,
    // 回调操作方法
    setCallbackRef,
    setRefreshBilibiliRef,
    setRefreshBlogRef
  };
};