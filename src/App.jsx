import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { initializeIcons } from '@fluentui/react/lib/Icons'
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

function App() {
  // 使用i18n翻译函数
  const { t, i18n } = useTranslation();

  // 检测是否为移动端
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const [isLoading, setIsLoading] = useState(true);
  const [showSecondaryHeader, setShowSecondaryHeader] = useState(false);
  const [showViewportContent, setShowViewportContent] = useState(true);
  // 从 sessionStorage 读取保存的标签状态
  const [mainTab, setMainTab] = useState(() => {
    const savedMainTab = sessionStorage.getItem('mainTab');
    return savedMainTab || null;
  });
  const [subTab, setSubTab] = useState(() => {
    const savedSubTab = sessionStorage.getItem('subTab');
    return savedSubTab || 'intro'; // 默认子标签
  });
  // 存储上次访问的主标签，用于从主页返回时恢复
  const [lastMainTab, setLastMainTab] = useState(() => {
    const savedMainTab = sessionStorage.getItem('mainTab');
    return savedMainTab || 'intro';
  });
  const [lastSubTab, setLastSubTab] = useState(() => {
    const savedSubTab = sessionStorage.getItem('subTab');
    return savedSubTab || 'intro';
  });
  
  // 刷新回调函数引用
  const refreshBilibiliRef = { current: null };
  const refreshBlogRef = { current: null };

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

  // 保存标签状态到 sessionStorage
  useEffect(() => {
    if (mainTab) {
      sessionStorage.setItem('mainTab', mainTab);
      setLastMainTab(mainTab);
    } else {
      sessionStorage.removeItem('mainTab');
    }
  }, [mainTab]);

  useEffect(() => {
    if (subTab) {
      sessionStorage.setItem('subTab', subTab);
      setLastSubTab(subTab);
    } else {
      sessionStorage.removeItem('subTab');
    }
  }, [subTab]);

  // 初始化时根据保存的状态恢复页面
  useEffect(() => {
    const savedMainTab = sessionStorage.getItem('mainTab');
    if (savedMainTab) {
      // 如果有保存的主标签，说明之前在二级页面
      setShowSecondaryHeader(true);
      setShowViewportContent(false);
    }
  }, []);

  // 监听滚动事件（仅桌面端有效）
  useEffect(() => {
    // 移动端不需要滚动检测，直接显示二级页眉
    if (isMobile()) {
      setShowSecondaryHeader(true);
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 只有在主页时（showViewportContent为true）才监听滚动切换到二级页面
      if (showViewportContent && scrollY > 100) {
        setShowSecondaryHeader(true);
        setShowViewportContent(false);
        // 桌面端滚动时，如果没有选中标签，恢复上次访问的标签
        if (!mainTab) {
          setMainTab(lastMainTab);
          setSubTab(lastSubTab);
        }
      }
      // 删除了向上滚动自动返回主页的逻辑
    };

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mainTab, lastMainTab, lastSubTab, showViewportContent]);

  // 添加触摸事件支持（仅桌面端有效）
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
  }, [lastMainTab, lastSubTab]);

  // 页面加载完成后输出console.log并预加载数据
  useEffect(() => {
    if (!isLoading) {
      console.log(t('app.console.welcome'));
      // 在后台静默预加载 Bilibili 和 Blog 数据
      preloadAllData();
    }
  }, [isLoading]);

  // 初始化Fluent UI 8图标
  useEffect(() => {
    initializeIcons();
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

  const handleScrollIndicatorClick = () => {
    setShowSecondaryHeader(true);
    setShowViewportContent(false);
    // 点击滚动指示器时，恢复上次访问的标签
    setMainTab(lastMainTab);
    setSubTab(lastSubTab);
  };

  // 处理返回主页
  const handleBackToHome = () => {
    setShowViewportContent(true);
    setShowSecondaryHeader(false);
    setMainTab(null);
    // 滚动回顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 处理主标签切换
  const handleMainTabChange = (tabName) => {
    setMainTab(tabName);
    // 切换主标签时，重置子标签为各主标签的默认子标签
    // 简介标签的默认子标签为 intro
    if (tabName === 'intro') {
      setSubTab('intro');
    } else {
      setSubTab(null);
    }
    // 点击标签时隐去主页内容
    setShowViewportContent(false);
  };

  // 处理子标签切换（侧边栏）
  const handleSubTabChange = (subTabName) => {
    setSubTab(subTabName);
  };
  
  // 处理刷新
  const handleRefresh = () => {
    if (mainTab === 'bilibili' && refreshBilibiliRef.current) {
      refreshBilibiliRef.current();
    } else if (mainTab === 'blog' && refreshBlogRef.current) {
      refreshBlogRef.current();
    }
  };

  return (
    <>
      <LoadingMask isVisible={isLoading} onHide={handleLoadingMaskHide} />
      <Background />
      <Header />
      <AnimatePresence>
        {showSecondaryHeader && <SecondaryHeader mainTab={mainTab} onMainTabChange={handleMainTabChange} isMobile={isMobile()} onBack={handleBackToHome} onRefresh={handleRefresh} />}
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
              onRefreshBilibili={(callback) => { refreshBilibiliRef.current = callback; }}
              onRefreshBlog={(callback) => { refreshBlogRef.current = callback; }}
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
        {/* 仅在PC端且在二级页面时显示回到主页按钮 */}
        {!isMobile() && showSecondaryHeader && !showViewportContent && (
          <Navigation type="back" onClick={handleBackToHome} />
        )}
      </AnimatePresence>
    </>
  )
}

export default App
