import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './App.css'
import Background from './components/Background'
import Header from './components/Header'
import LoadingMask from './components/LoadingMask'
import PersonalTitle from './components/PersonalTitle'

import SecondaryHeader from './components/SecondaryHeader'
import SidebarNav from './components/SidebarNav'
import ContentArea from './components/ContentArea'
import Footer from './components/Footer'
import { preloadAllData } from './dataPreloader'
import useInteractionHandling from './hooks/useInteractionHandling'
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
    initializeFromStorage
  } = useStore();
  
  

  
  // 处理回到顶部/主页按钮点击的函数


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
        setUIState({ isLoading: false });
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

  // 使用自定义Hook处理滚动和触摸事件
  useInteractionHandling(
    isMobile,
    showViewportContent,
    showSecondaryHeader,
    mainTab,
    lastMainTab,
    lastSubTab,
    setUIState,
    setTabState
  );

  // 页面加载完成后输出console.log并预加载数据
  useEffect(() => {
    if (!isLoading) {
      console.log(t('app.console.welcome'));
      // 在后台静默预加载 Bilibili 和 Blog 数据
      preloadAllData();
    }
  }, [isLoading]);
  


  // 动态更新页面标题和lang属性
  useEffect(() => {
    // 更新页面标题
    document.title = t('meta.title');
    // 更新html lang属性
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLoadingMaskHide = () => {
    setUIState({ isLoading: false });
  };

  return (
    <>
      <LoadingMask isVisible={isLoading} onHide={handleLoadingMaskHide} />
      <Background />
      <Header />
      <AnimatePresence>
        <SecondaryHeader mainTab={mainTab} onMainTabChange={handleMainTabChange} isMobile={isMobile()} onBack={handleBackToHome} />
      </AnimatePresence>
      <div className="content-wrapper">
        <AnimatePresence>
          {/* 主页状态：显示PersonalTitle */}
          {!showSecondaryHeader ? (
            <PersonalTitle key="personal-title" />
          ) : (
            // 二级页面状态：显示导航和内容
            <>
              {mainTab === 'intro' && (
                <SidebarNav subTab={subTab} onSubTabChange={handleSubTabChange} />
              )}
              <ContentArea 
                mainTab={mainTab} 
                subTab={subTab} 
                showSidebar={mainTab === 'intro'} 
                onRefreshBilibili={(ref) => setCallbackRef('refreshBilibiliRef', ref)}
                onRefreshBlog={(ref) => setCallbackRef('refreshBlogRef', ref)}
              />
            </>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {/* 页脚在所有页面都显示 */}
        <Footer />
      </AnimatePresence>
    </>
  )
}

export default App
