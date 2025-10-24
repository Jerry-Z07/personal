import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// 背景图片API地址 - 从config.js移入
const BACKGROUND_API_URL = 'https://t.alcy.cc/ycy';

/**
 * 获取设备信息
 * 用于优化图片加载策略
 */
const getDeviceInfo = () => {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  return {
    width: screenWidth,
    height: screenHeight,
    pixelRatio: devicePixelRatio,
    isMobile: screenWidth <= 768,
    isRetina: devicePixelRatio > 1
  };
};

/**
 * 根据设备类型优化图片加载
 */
const optimizeImageLoading = () => {
  const deviceInfo = getDeviceInfo();
  
  // 根据设备类型调整图片质量或尺寸（如果API支持）
  // 这里可以根据需要添加更多的优化逻辑
};

/**
 * 设置备用背景方案
 * 当API图片加载失败时使用CSS渐变背景
 */
const setFallbackBackground = (backgroundContainer) => {
  if (!backgroundContainer) {
    console.warn('背景容器不存在，跳过备用背景设置');
    return;
  }
  
  // 设置CSS渐变背景作为备用方案
  backgroundContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  backgroundContainer.style.backgroundSize = 'cover';
  backgroundContainer.style.backgroundPosition = 'center';
  backgroundContainer.style.backgroundAttachment = 'fixed';
};

/**
 * 背景容器组件 - 封装背景图片加载逻辑
 */
export const BackgroundContainer = ({ children }) => {
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  useEffect(() => {
    // 加载背景图片（将原有逻辑移入组件内部）
    const loadBackground = async () => {
      // 优化图片加载
      optimizeImageLoading();
      
      // 获取背景图片元素
      const backgroundImage = document.getElementById('background-image');
      
      if (!backgroundImage) {
        console.warn('背景图片元素不存在，跳过背景加载');
        setBackgroundLoaded(true);
        return;
      }
      
      try {
        // 创建图片对象进行预加载
        const img = new Image();
        
        // 设置图片源地址
        img.src = BACKGROUND_API_URL;
        
        // 图片加载成功时的处理
        img.onload = function() {
          backgroundImage.src = BACKGROUND_API_URL;
          
          // 添加淡入效果
          backgroundImage.style.opacity = '0';
          backgroundImage.style.transition = 'opacity 1s ease-in-out';
          
          // 延迟设置透明度以实现淡入效果
          setTimeout(() => {
            backgroundImage.style.opacity = '1';
          }, 100);
          
          setBackgroundLoaded(true);
        };
        
        // 图片加载失败时的处理
        img.onerror = function() {
          console.error('背景图片加载失败，使用备用方案');
          // 获取背景容器并设置备用背景
          const backgroundContainer = document.querySelector('.background-container');
          setFallbackBackground(backgroundContainer);
          // 隐藏图片元素
          backgroundImage.style.display = 'none';
          setBackgroundLoaded(true);
        };
        
      } catch (error) {
        console.error('加载背景图片时发生错误:', error);
        // 获取背景容器并设置备用背景
        const backgroundContainer = document.querySelector('.background-container');
        setFallbackBackground(backgroundContainer);
        // 隐藏图片元素
        if (backgroundImage) {
          backgroundImage.style.display = 'none';
        }
        setBackgroundLoaded(true);
      }
    };
    
    loadBackground();
    
    // 页面可见性变化时的处理
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // console.log('页面已隐藏');
      } else {
        // console.log('页面已显示');
      }
    };
    
    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 清理函数
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <motion.div 
        className="background-container"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img 
          id="background-image" 
          alt="背景图片"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </motion.div>
      {children}
    </>
  );
};

export default BackgroundContainer;