import { useEffect } from 'react';

/**
 * 自定义Hook：处理滚动事件逻辑
 * @param {Function} isMobile - 判断是否为移动端的函数
 * @param {boolean} showViewportContent - 是否显示主视图内容
 * @param {string|null} mainTab - 当前选中的主标签
 * @param {string} lastMainTab - 上次访问的主标签
 * @param {string} lastSubTab - 上次访问的子标签
 * @param {Function} setShowSecondaryHeader - 设置是否显示二级页眉的函数
 * @param {Function} setShowViewportContent - 设置是否显示主视图内容的函数
 * @param {Function} setMainTab - 设置主标签的函数
 * @param {Function} setSubTab - 设置子标签的函数
 */
const useScrollHandling = (isMobile, showViewportContent, showSecondaryHeader, mainTab, lastMainTab, lastSubTab, setShowSecondaryHeader, setShowViewportContent, setMainTab, setSubTab) => {
  useEffect(() => {
    // 移动端不需要滚动检测，但只在需要时设置显示二级页眉
    if (isMobile()) {
      // 只有在当前未显示secondaryHeader时才设置，防止无限循环更新
      if (!showSecondaryHeader) {
        setShowSecondaryHeader(true);
      }
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 只有在主页时（showViewportContent为true）才监听滚动切换到二级页面
      if (showViewportContent && scrollY > 100) {
        setShowSecondaryHeader(true);
        setShowViewportContent(false);
        // 桌面端滚动时，如果没有选中标签，尝试恢复上次访问的标签
        // 但仅当确实有保存的标签时才设置（避免空状态时默认为intro）
        if (!mainTab) {
          const savedMainTab = sessionStorage.getItem('mainTab');
          const savedSubTab = sessionStorage.getItem('subTab');
          if (savedMainTab && savedSubTab) {
            setMainTab(savedMainTab);
            setSubTab(savedSubTab);
          }
        }
      }
      // 注意：删除了向上滚动自动返回主页的逻辑
    };

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mainTab, lastMainTab, lastSubTab, showViewportContent, showSecondaryHeader, isMobile, setShowSecondaryHeader, setShowViewportContent, setMainTab, setSubTab]);
};

export default useScrollHandling;