import { useEffect, useState, useRef, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './App.css'
import Background from './components/Background'
import Header from './components/Header'
import LoadingMask from './components/LoadingMask'
import PersonalTitle from './components/PersonalTitle'
import Navigation from './components/Navigation'
import SecondaryHeader from './components/SecondaryHeader'
import SidebarNav from './components/SidebarNav'
import ContentArea from './components/ContentArea'
import Footer from './components/Footer'
import { preloadAllData } from './dataPreloader'
import useScrollHandling from './hooks/useScrollHandling'
import useTouchHandling from './hooks/useTouchHandling'
import { useStore } from './stores'

function App() {
  // 使用i18n翻译函数
  const { t, i18n } = useTranslation();
  
  // 从全局store获取状态和方法
  const {
    ui: { isLoading, showSecondaryHeader, showViewportContent },
    tabs: { mainTab, subTab, lastMainTab, lastSubTab },
    setUIState,
    setTabState,
    setCallbackRef,
    handleBackToHome,
    handleMainTabChange,
    handleSubTabChange,
    handleRefresh,
    handleScrollIndicatorClick,
    initializeFromStorage
  } = useStore();
  
  // 定义便捷函数映射到新的状态更新方式
  const setIsLoading = (value) => setUIState({ isLoading: value });
  const setShowSecondaryHeader = (value) => setUIState({ showSecondaryHeader: value });
  const setShowViewportContent = (value) => setUIState({ showViewportContent: value });
  const setMainTab = (value) => setTabState({ mainTab: value });
  const setSubTab = (value) => setTabState({ subTab: value });
  const setRefreshBilibiliRef = (ref) => setCallbackRef('refreshBilibiliRef', ref);
  const setRefreshBlogRef = (ref) => setCallbackRef('refreshBlogRef', ref);
  
  // 用于检测双击的状态和引用
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef(null);
  
  // 处理回到顶部/主页按钮点击的函数
  const handleBackButtonClick = () => {
    // 增加点击计数
    setClickCount(prev => prev + 1);
    
    // 如果是第一次点击
    if (clickCount === 0) {
      // 立即执行回到顶部操作，不等待
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // 设置定时器检测300ms内是否有第二次点击
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0); // 300ms后重置点击计数（确认是单击）
      }, 300);
    } else {
      // 双击：清除定时器，回到主页
      clearTimeout(clickTimerRef.current);
      handleBackToHome();
      setClickCount(0); // 重置点击计数
    }
  };

  // 检测是否为移动端 - 使用useCallback缓存函数实例，避免依赖变化导致无限循环
  const isMobile = useCallback(() => {
    return window.innerWidth <= 768;
  }, []);

  // 初始化状态从sessionStorage
  useEffect(() => {
    initializeFromStorage();
  }, []);

  // 同时监听字体和背景图片加载完成
  useEffect(() => {
    let fontLoaded = false;
    let imageLoaded = false;

    // 检查是否所有资源都加载完成
    const checkAllLoaded = () => {
      if (fontLoaded && imageLoaded) {
        setIsLoading(false);
      }
    };

    // 监听字体加载
    const loadFonts = async () => {
      try {
        // 等待 LXGW WenKai 字体加载完成
        await document.fonts.load('1em "LXGW WenKai"');
        fontLoaded = true;
        checkAllLoaded();
      } catch (error) {
        console.warn(t('app.font.loadError'), error);
        // 即使字体加载失败也继续
        fontLoaded = true;
        checkAllLoaded();
      }
    };

    // 监听背景图片加载
    const handleImageLoad = () => {
      imageLoaded = true;
      checkAllLoaded();
    };

    // 添加背景图片加载事件监听器
    window.addEventListener('backgroundImageLoaded', handleImageLoad);
    
    // 开始加载字体
    loadFonts();
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('backgroundImageLoaded', handleImageLoad);
    };
  }, []);

  // 使用自定义Hook处理滚动事件
  useScrollHandling(
    isMobile,
    showViewportContent,
    showSecondaryHeader,
    mainTab,
    lastMainTab,
    lastSubTab,
    setShowSecondaryHeader,
    setShowViewportContent,
    setMainTab,
    setSubTab
  );

  // 使用自定义Hook处理触摸事件
  useTouchHandling(
    isMobile,
    lastMainTab,
    lastSubTab,
    setShowSecondaryHeader,
    setShowViewportContent,
    setMainTab,
    setSubTab
  );

  // 页面加载完成后输出console.log并预加载数据
  useEffect(() => {
    if (!isLoading) {
      console.log(t('app.console.welcome'));
      // 在后台静默预加载 Bilibili 和 Blog 数据
      preloadAllData();
    }
  }, [isLoading]);
  
  // 清理定时器，防止内存泄漏
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  // 动态更新页面标题和lang属性
  useEffect(() => {
    // 更新页面标题
    document.title = t('meta.title');
    // 更新html lang属性
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLoadingMaskHide = () => {
    setIsLoading(false);
  };

  return (
    <>
      <LoadingMask isVisible={isLoading} onHide={handleLoadingMaskHide} />
      <Background />
      <Header />
      <AnimatePresence>
        {showSecondaryHeader && <SecondaryHeader mainTab={mainTab} onMainTabChange={handleMainTabChange} isMobile={isMobile()} onBack={handleBackToHome} />}
      </AnimatePresence>
      <AnimatePresence>
        {showViewportContent && (
          <>
            <PersonalTitle />
            {!isMobile() && <Navigation type="scroll" onScroll={handleScrollIndicatorClick} />}
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSecondaryHeader && !showViewportContent && (
          <>
            {mainTab === 'intro' && (
              <SidebarNav subTab={subTab} onSubTabChange={handleSubTabChange} />
            )}
            <ContentArea 
              mainTab={mainTab} 
              subTab={subTab} 
              showSidebar={mainTab === 'intro'} 
              onRefreshBilibili={setRefreshBilibiliRef}
              onRefreshBlog={setRefreshBlogRef}
            />
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {/* PC端：在二级页面最底下 */}
        {/* 移动端：主页页面最底下，如果切换到二级页面就在二级页面最底下 */}
        {((!isMobile() && showSecondaryHeader && !showViewportContent) || 
          (isMobile() && (showViewportContent || (!showViewportContent && mainTab)))) && (
          <Footer />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {/* 仅在PC端且在二级页面时显示回到顶部按钮 (单击回到顶部，双击回到主页) */}
        {!isMobile() && showSecondaryHeader && !showViewportContent && (
          <Navigation 
            type="backToTop" 
            onClick={handleBackButtonClick} 
            className="secondary-back-to-top"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default App
