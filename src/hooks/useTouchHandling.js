import { useEffect } from 'react';

/**
 * 自定义Hook：处理触摸事件逻辑
 * @param {Function} isMobile - 判断是否为移动端的函数
 * @param {string} lastMainTab - 上次访问的主标签
 * @param {string} lastSubTab - 上次访问的子标签
 * @param {Function} setShowSecondaryHeader - 设置是否显示二级页眉的函数
 * @param {Function} setShowViewportContent - 设置是否显示主视图内容的函数
 * @param {Function} setMainTab - 设置主标签的函数
 * @param {Function} setSubTab - 设置子标签的函数
 */
const useTouchHandling = (isMobile, lastMainTab, lastSubTab, setShowSecondaryHeader, setShowViewportContent, setMainTab, setSubTab) => {
  useEffect(() => {
    // 移动端不需要触摸滑动，直接通过点击标签切换
    if (isMobile()) {
      return;
    }

    let touchStartY = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let touchEndTime = 0;
    let touchStartX = 0;
    let isVerticalSwipe = false;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      isVerticalSwipe = false;
    };
    
    const handleTouchMove = (e) => {
      touchEndY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = Math.abs(touchStartY - touchEndY);
      const deltaX = Math.abs(touchStartX - currentX);
      
      // 确定滑动方向，只有垂直滑动才被认为是有效滑动
      if (deltaY > deltaX && deltaY > 20) {
        isVerticalSwipe = true;
      }
    };
    
    const handleTouchEnd = () => {
      touchEndTime = Date.now();
      const touchDistance = touchStartY - touchEndY;
      const touchDuration = touchEndTime - touchStartTime;
      const touchSpeed = Math.abs(touchDistance) / touchDuration;
      
      // 增加滑动阈值从50px到100px，并添加速度检测
      // 只有向下滑动超过100px，且速度大于0.3px/ms，且是垂直滑动才触发
      if (touchDistance > 100 && touchSpeed > 0.3 && isVerticalSwipe) {
        // 检查当前是否在页面顶部附近
        const scrollY = window.scrollY;
        if (scrollY <= 100) {
          // 直接更新状态，确保二级界面显示
          setShowSecondaryHeader(true);
          setShowViewportContent(false);
          setMainTab(lastMainTab);
          setSubTab(lastSubTab);
          // 触发滚动到下一屏
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        }
      }
    };
    
    // 添加触摸事件监听器
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [lastMainTab, lastSubTab, isMobile, setShowSecondaryHeader, setShowViewportContent, setMainTab, setSubTab]);
};

export default useTouchHandling;