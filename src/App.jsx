import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { preloadAllData } from './dataPreloader.js'
import './App.css'
import BackgroundImage from './components/BackgroundImage'
import BackgroundBlur from './components/BackgroundBlur'
import Header from './components/Header'
import LoadingMask from './components/LoadingMask'
import PersonalTitle from './components/PersonalTitle'
import ScrollIndicator from './components/ScrollIndicator'
import SecondaryHeader from './components/SecondaryHeader'
import SidebarNav from './components/SidebarNav'
import ContentArea from './components/ContentArea'
import Footer from './components/Footer'
import BackToTopButton from './components/BackToTopButton'

function App() {
  // 检测是否为移动端
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const [isLoading, setIsLoading] = useState(true);
  const [showSecondaryHeader, setShowSecondaryHeader] = useState(false);
  const [showViewportContent, setShowViewportContent] = useState(true);
  // 从 sessionStorage 读取保存的标签状态
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = sessionStorage.getItem('activeTab');
    return savedTab || null;
  });
  // 存储上次访问的标签，用于从主页返回时恢复
  const [lastActiveTab, setLastActiveTab] = useState(() => {
    const savedTab = sessionStorage.getItem('activeTab');
    return savedTab || 'intro';
  });

  // 监听背景图片加载完成事件
  useEffect(() => {
    const handleImageLoad = () => {
      setIsLoading(false);
    };

    // 添加自定义事件监听器
    window.addEventListener('backgroundImageLoaded', handleImageLoad);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('backgroundImageLoaded', handleImageLoad);
    };
  }, []);

  // 在应用启动时预加载所有标签数据
  useEffect(() => {
    // 延迟预加载，确保首屏渲染不被阻塞
    const timer = setTimeout(() => {
      console.log('开始后台预加载数据...');
      preloadAllData();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 保存 activeTab 到 sessionStorage
  useEffect(() => {
    if (activeTab) {
      sessionStorage.setItem('activeTab', activeTab);
      // 更新上次访问的标签
      setLastActiveTab(activeTab);
    } else {
      sessionStorage.removeItem('activeTab');
    }
  }, [activeTab]);

  // 初始化时根据保存的状态恢复页面
  useEffect(() => {
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab) {
      // 如果有保存的标签，说明之前在二级页面
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
        if (!activeTab) {
          setActiveTab(lastActiveTab);
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
  }, [activeTab, lastActiveTab, showViewportContent]);

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
          setActiveTab(lastActiveTab);
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
  }, [lastActiveTab]);

  // 页面加载完成后输出console.log
  useEffect(() => {
    if (!isLoading) {
      console.log('愿你永远心怀热爱，眼中总有星辰大海');
    }
  }, [isLoading]);

  const handleLoadingMaskHide = () => {
    setIsLoading(false);
  };

  const handleScrollIndicatorClick = () => {
    setShowSecondaryHeader(true);
    setShowViewportContent(false);
    // 点击滚动指示器时，恢复上次访问的标签
    setActiveTab(lastActiveTab);
  };

  // 处理返回主页
  const handleBackToHome = () => {
    setShowViewportContent(true);
    setShowSecondaryHeader(false);
    setActiveTab(null);
    // 滚动回顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 处理标签切换
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // 点击标签时隐去主页内容
    setShowViewportContent(false);
  };

  return (
    <>
      <LoadingMask isVisible={isLoading} onHide={handleLoadingMaskHide} />
      <BackgroundImage />
      <BackgroundBlur />
      <Header />
      <AnimatePresence>
        {showSecondaryHeader && <SecondaryHeader activeTab={activeTab} onTabChange={handleTabChange} isMobile={isMobile()} onBack={handleBackToHome} />}
      </AnimatePresence>
      <AnimatePresence>
        {showViewportContent && (
          <>
            <PersonalTitle />
            {!isMobile() && <ScrollIndicator onScroll={handleScrollIndicatorClick} />}
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSecondaryHeader && !showViewportContent && (
          <>
            {activeTab === 'intro' || activeTab === 'nickname' ? (
              <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
            ) : null}
            <ContentArea activeTab={activeTab} showSidebar={activeTab === 'intro' || activeTab === 'nickname'} />
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {/* PC端：在二级页面最底下 */}
        {/* 移动端：主页页面最底下，如果切换到二级页面就在二级页面最底下 */}
        {((!isMobile() && showSecondaryHeader && !showViewportContent) || 
          (isMobile() && (showViewportContent || (!showViewportContent && activeTab)))) && (
          <Footer />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {/* 仅在PC端且在二级页面时显示回到主页按钮 */}
        {!isMobile() && showSecondaryHeader && !showViewportContent && (
          <BackToTopButton onClick={handleBackToHome} />
        )}
      </AnimatePresence>
    </>
  )
}

export default App
