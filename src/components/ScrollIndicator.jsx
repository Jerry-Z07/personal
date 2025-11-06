import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './ScrollIndicator.css';

const ScrollIndicator = ({ onScroll }) => {
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

  return (
    <motion.div 
      className="scroll-indicator"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div 
        className="scroll-arrows"
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
        className="scroll-text"
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
};

export default ScrollIndicator;