import { useEffect, useCallback } from 'react';

/**
 * 自定义Hook：合并处理滚动和触摸事件逻辑
 * @param {Function} isMobile - 判断是否为移动端的函数
 * @param {boolean} showViewportContent - 是否显示主视图内容
 * @param {boolean} showSecondaryHeader - 是否显示二级页眉
 * @param {string|null} mainTab - 当前选中的主标签
 * @param {string} lastMainTab - 上次访问的主标签
 * @param {string} lastSubTab - 上次访问的子标签
 * @param {Function} setUIState - 统一UI状态更新函数
 * @param {Function} setTabState - 统一标签状态更新函数
 */
const useInteractionHandling = (isMobile, showViewportContent, showSecondaryHeader, mainTab, lastMainTab, lastSubTab, setUIState, setTabState) => {
  // 提取通用函数：恢复保存的标签状态
  const restoreTabState = useCallback(() => {
    // 尝试恢复保存的标签状态，但仅当确实有保存的标签时才设置
    const savedMainTab = sessionStorage.getItem('mainTab');
    const savedSubTab = sessionStorage.getItem('subTab');
    if (savedMainTab && savedSubTab) {
      setTabState({ mainTab: savedMainTab, subTab: savedSubTab });
    }
  }, [setTabState]);

  // 提取通用函数：切换到二级页面
  const switchToSecondaryPage = useCallback(() => {
    setUIState({ showSecondaryHeader: true, showViewportContent: false });
    // 桌面端切换时，如果没有选中标签，尝试恢复上次访问的标签
    if (!mainTab) {
      restoreTabState();
    }
  }, [mainTab, setUIState, restoreTabState]);

  useEffect(() => {
    // 不强制设置showSecondaryHeader为true
    // 让stores中的默认设置决定初始状态
    // 保留函数结构以备将来需要添加设备特定的交互处理
  }, [isMobile, showViewportContent, showSecondaryHeader, mainTab, switchToSecondaryPage]);
};

export default useInteractionHandling;