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

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showSecondaryHeader, setShowSecondaryHeader] = useState(false);

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
      // 当滚动超过100px时显示二级页眉
      if (scrollY > 100) {
        setShowSecondaryHeader(true);
      } else {
        setShowSecondaryHeader(false);
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
        {showSecondaryHeader && <SecondaryHeader />}
      </AnimatePresence>
      <div className="content-wrapper">
        <PersonalTitle />
      </div>
      <ScrollIndicator />
    </>
  )
}

export default App
