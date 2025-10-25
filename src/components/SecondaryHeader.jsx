import React from 'react';
import { motion } from 'framer-motion';
import './SecondaryHeader.css';

const SecondaryHeader = ({ activeTab }) => {
  const handleGithubClick = () => {
    window.open('https://github.com', '_blank');
  };

  const handleBilibiliClick = () => {
    window.open('https://www.bilibili.com', '_blank');
  };

  const handleIntroClick = () => {
    // 简介标签点击事件，暂时为空
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
            className="social-link github-link"
            onClick={handleGithubClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-github-fill"></i>
            <span>GitHub</span>
          </motion.button>
          
          <motion.button 
            className="social-link bilibili-link"
            onClick={handleBilibiliClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-bilibili-fill"></i>
            <span>Bilibili</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SecondaryHeader;