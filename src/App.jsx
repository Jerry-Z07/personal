import { useState, useEffect } from 'react'
import './App.css'
import BackgroundImage from './components/BackgroundImage'
import BackgroundBlur from './components/BackgroundBlur'
import Header from './components/Header'
import LoadingMask from './components/LoadingMask'

function App() {
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLoadingMaskHide = () => {
    setIsLoading(false);
  };

  return (
    <>
      <LoadingMask isVisible={isLoading} onHide={handleLoadingMaskHide} />
      <BackgroundImage />
      <BackgroundBlur />
      <Header />
      <div className="content-wrapper">
        {/* 留白区域 */}
      </div>
    </>
  )
}

export default App
