import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Navigation.css';

const Navigation = ({ 
  type, // 'scroll' 或 'back'
  onScroll, 
  onClick,
  onBackToTop 
}) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  const handleScrollClick = () => {
    // 调用父组件传递的回调函数
    if (onScroll) {
      onScroll();
    }
    // 执行滚动
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const handleBackToTopClick = () => {
    if (onClick) {
      onClick();
    }
    if (onBackToTop) {
      onBackToTop();
    }
  };

  // 滚动指示器
  if (type === 'scroll') {
    return (
      <motion.div 
        className="navigation scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div 
          className="scroll-arrows navigation-arrows"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          onClick={handleScrollClick}
          onTouchEnd={handleScrollClick}
          style={{ cursor: 'pointer' }}
        >
          <i className="ri-arrow-down-s-line"></i>
        </motion.div>
        
        <motion.div 
          className="scroll-text navigation-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            times: [0, 0.2, 0.8, 1]
          }}
        >
          {t('scrollIndicator.hint')}
        </motion.div>
      </motion.div>
    );
  }

  // 返回顶部按钮
  if (type === 'back' || type === 'backToTop') {
    return (
      <motion.button
        className="navigation back-to-top-button"
        onClick={handleBackToTopClick}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={t('backToTop.ariaLabel')}
      >
        <i className="ri-arrow-up-line"></i>
      </motion.button>
    );
  }

  return null;
};

export default Navigation;