import { motion } from 'framer-motion';
import './SecondaryHeader.css';

const SecondaryHeader = ({ activeTab, onTabChange }) => {
  const handleGithubClick = () => {
    window.open('https://github.com', '_blank');
  };

  const handleBilibiliClick = () => {
    onTabChange('bilibili');
  };

  const handleIntroClick = () => {
    onTabChange('intro');
  };

  return (
    <motion.div 
      className="secondary-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="secondary-header-container">
        <motion.div 
          className="social-links"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.button 
            className={`social-link intro-link ${activeTab === 'intro' || activeTab === 'nickname' ? 'active' : ''}`}
            onClick={handleIntroClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-user-3-fill"></i>
            <span>简介</span>
          </motion.button>
          
          <motion.button 
            className={`social-link bilibili-link ${activeTab === 'bilibili' ? 'active' : ''}`}
            onClick={handleBilibiliClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-bilibili-fill"></i>
            <span>Bilibili</span>
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
            <span>GitHub</span>
            <i className="ri-external-link-line external-icon"></i>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SecondaryHeader;