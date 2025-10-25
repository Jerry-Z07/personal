import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSecondaryHeader, setShowSecondaryHeader] = useState(false);
  const [showViewportContent, setShowViewportContent] = useState(true);
  const [activeTab, setActiveTab] = useState('intro');

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

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // 当滚动超过100px时显示二级页眉，隐藏视口内容
      if (scrollY > 100) {
        setShowSecondaryHeader(true);
        setShowViewportContent(false);
      } else {
        setShowSecondaryHeader(false);
        setShowViewportContent(true);
      }
    };

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLoadingMaskHide = () => {
    setIsLoading(false);
  };

  return (
    <>
      <LoadingMask isVisible={isLoading} onHide={handleLoadingMaskHide} />
      <BackgroundImage />
      <BackgroundBlur />
      <Header />
      <AnimatePresence>
        {showSecondaryHeader && <SecondaryHeader activeTab={activeTab} />}
      </AnimatePresence>
      <AnimatePresence>
        {showViewportContent && (
          <>
            <PersonalTitle />
            <ScrollIndicator />
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSecondaryHeader && (
          <>
            <SidebarNav activeTab={activeTab} onTabChange={setActiveTab} />
            <ContentArea activeTab={activeTab} />
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default App
