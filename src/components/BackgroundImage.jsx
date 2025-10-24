import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './BackgroundImage.css';

const BackgroundImage = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 检测设备类型
  const detectDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    return isMobile ? 'mp' : 'pc';
  };

  // 获取随机背景图片
  const fetchRandomImage = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const deviceType = detectDeviceType();
      const apiUrl = `https://imgapi.lie.moe/random?sort=${deviceType}`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      // 获取重定向后的图片URL
      const finalUrl = response.url;
      setImageUrl(finalUrl);
    } catch (err) {
      setError(err.message);
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
  };

  // 图片加载错误处理
  const handleImageError = () => {
    setError('Failed to load image');
    setIsLoading(false);
  };

  return (
    <div className="background-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {error && (
        <div className="error-overlay">
          <p>{error}</p>
          <button onClick={fetchRandomImage} className="retry-button">
            重试
          </button>
        </div>
      )}
      
      {imageUrl && !error && (
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
  );
};

export default BackgroundImage;