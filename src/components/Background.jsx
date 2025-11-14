import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Background.css';

const Background = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 检测设备类型
  const detectDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    return isMobile ? 'pe' : 'pc';
  };

  // 获取随机背景图片
  const fetchRandomImage = async () => {
    setIsLoading(true);
    
    try {
      const deviceType = detectDeviceType();
      // 根据设备类型使用不同的API
      const apiUrl = deviceType === 'pc' 
        ? 'https://api.miaomc.cn/image/get'
        : 'https://t.alcy.cc/mp';
      
      // 直接使用API URL作为图片源，避免重复请求
      setImageUrl(apiUrl);
    } catch (err) {
      console.error('Error fetching background image:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件挂载时获取图片
  useEffect(() => {
    fetchRandomImage();
  }, []);

  // 图片加载完成处理
  const handleImageLoad = () => {
    setIsLoading(false);
    // 触发自定义事件，通知App组件背景图片已加载完成
    window.dispatchEvent(new CustomEvent('backgroundImageLoaded'));
  };

  // 图片加载错误处理
  const handleImageError = () => {
    setIsLoading(false);
    // 即使加载失败也触发事件，确保用户能看到页面内容
    window.dispatchEvent(new CustomEvent('backgroundImageLoaded'));
  };

  return (
    <>
      {/* 背景图片容器 */}
      <div className="background-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {imageUrl && (
          <motion.img
            src={imageUrl}
            alt="Background"
            className="background-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        <div className="gradient-overlay"></div>
      </div>

      {/* 背景模糊层 */}
      <div className="background-blur"></div>
    </>
  );
};

export default Background;