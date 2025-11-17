import { useEffect, useCallback } from 'react';

/**
 * 自定义Hook：合并处理滚动和触摸事件逻辑
 * @param {Function} isMobile - 判断是否为移动端的函数
 * @param {boolean} showViewportContent - 是否显示主视图内容
 * @param {boolean} showSecondaryHeader - 是否显示二级页眉
 * @param {string|null} mainTab - 当前选中的主标签
 * @param {string} lastMainTab - 上次访问的主标签
 * @param {string} lastSubTab - 上次访问的子标签
 * @param {Function} setShowSecondaryHeader - 设置是否显示二级页眉的函数
 * @param {Function} setShowViewportContent - 设置是否显示主视图内容的函数
 * @param {Function} setMainTab - 设置主标签的函数
 * @param {Function} setSubTab - 设置子标签的函数
 */
const useInteractionHandling = (isMobile, showViewportContent, showSecondaryHeader, mainTab, lastMainTab, lastSubTab, setShowSecondaryHeader, setShowViewportContent, setMainTab, setSubTab) => {
  // 提取通用函数：恢复保存的标签状态
  const restoreTabState = useCallback(() => {
    // 尝试恢复保存的标签状态，但仅当确实有保存的标签时才设置
    const savedMainTab = sessionStorage.getItem('mainTab');
    const savedSubTab = sessionStorage.getItem('subTab');
    if (savedMainTab && savedSubTab) {
      setMainTab(savedMainTab);
      setSubTab(savedSubTab);
    }
  }, [setMainTab, setSubTab]);

  // 提取通用函数：切换到二级页面
  const switchToSecondaryPage = useCallback(() => {
    setShowSecondaryHeader(true);
    setShowViewportContent(false);
    // 桌面端切换时，如果没有选中标签，尝试恢复上次访问的标签
    if (!mainTab) {
      restoreTabState();
    }
  }, [mainTab, setShowSecondaryHeader, setShowViewportContent, restoreTabState]);

  useEffect(() => {
    // 移动端处理逻辑
    if (isMobile()) {
      // 移动端不需要滚动和触摸事件监听，但需要设置显示二级页眉
      if (!showSecondaryHeader) {
        setShowSecondaryHeader(true);
      }
      return;
    }

    // 滚动事件处理
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 只有在主页时（showViewportContent为true）才监听滚动切换到二级页面
      if (showViewportContent && scrollY > 100) {
        switchToSecondaryPage();
      }
    };

    // 触摸事件相关变量
    let touchStartY = 0;
    let touchStartX = 0;
    let touchStartTime = 0;
    let isVerticalSwipe = false;

    // 触摸开始事件处理
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isVerticalSwipe = false;
    };

    // 触摸移动事件处理
    const handleTouchMove = (e) => {
      const touchEndY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = Math.abs(touchStartY - touchEndY);
      const deltaX = Math.abs(touchStartX - currentX);
      
      // 确定滑动方向，只有垂直滑动才被认为是有效滑动
      if (deltaY > deltaX && deltaY > 20) {
        isVerticalSwipe = true;
      }
    };

    // 触摸结束事件处理
    const handleTouchEnd = () => {
      const touchEndY = window.scrollY;
      const touchEndTime = Date.now();
      const touchDistance = touchStartY - touchEndY;
      const touchDuration = touchEndTime - touchStartTime;
      const touchSpeed = Math.abs(touchDistance) / touchDuration;
      
      // 只有向下滑动超过100px，且速度大于0.3px/ms，且是垂直滑动才触发
      if (touchDistance > 100 && touchSpeed > 0.3 && isVerticalSwipe) {
        // 检查当前是否在页面顶部附近
        const scrollY = window.scrollY;
        if (scrollY <= 100) {
          switchToSecondaryPage();
          // 触发滚动到下一屏
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }
      }
    };

    // 添加事件监听器，使用事件委托的思想集中管理
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, showViewportContent, showSecondaryHeader, mainTab, switchToSecondaryPage]);
};

export default useInteractionHandling;