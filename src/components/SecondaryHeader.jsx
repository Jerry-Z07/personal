import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './SecondaryHeader.css';

const SecondaryHeader = ({ mainTab, onMainTabChange, isMobile, onBack }) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  const handleBilibiliClick = () => {
    onMainTabChange('bilibili');
  };

  const handleIntroClick = () => {
    onMainTabChange('intro');
  };

  const handleBlogClick = () => {
    onMainTabChange('blog');
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };



  return (
    <motion.div 
      className="secondary-header"
      initial={isMobile ? { opacity: 0 } : { y: -100, opacity: 0 }}
      animate={isMobile ? { opacity: 1 } : { y: 0, opacity: 1 }}
      exit={isMobile ? { opacity: 0 } : { y: -100, opacity: 0 }}
      transition={isMobile ? { duration: 0.2 } : { duration: 0.3, ease: "easeInOut" }}
    >
      <div className="secondary-header-container">
        {isMobile && mainTab && (
          <motion.button
            className="back-button"
            onClick={handleBackClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <i className="ri-arrow-left-s-line"></i>
          </motion.button>
        )}
        <motion.div 
          className="social-links"
          initial={isMobile ? { opacity: 0 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={isMobile ? { delay: 0, duration: 0.2 } : { delay: 0.2, duration: 0.4 }}
        >
          <motion.button 
            className={`social-link intro-link ${mainTab === 'intro' ? 'active' : ''}`}
            onClick={handleIntroClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-user-3-fill"></i>
            <span>{t('secondaryHeader.tabs.intro')}</span>
          </motion.button>
          
          <motion.button 
            className={`social-link bilibili-link ${mainTab === 'bilibili' ? 'active' : ''}`}
            onClick={handleBilibiliClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-bilibili-fill"></i>
            <span>{t('secondaryHeader.tabs.bilibili')}</span>
          </motion.button>
          
          <motion.button 
            className={`social-link blog-link ${mainTab === 'blog' ? 'active' : ''}`}
            onClick={handleBlogClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-article-fill"></i>
            <span>{t('secondaryHeader.tabs.blog')}</span>
          </motion.button>
          
          <motion.a 
            className="social-link github-link"
            href="https://github.com/Jerry-Z07"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-github-fill"></i>
            <span>{t('secondaryHeader.tabs.github')}</span>
            <i className="ri-external-link-line external-icon"></i>
          </motion.a>
        </motion.div>
        

      </div>
    </motion.div>
  );
};

export default SecondaryHeader;