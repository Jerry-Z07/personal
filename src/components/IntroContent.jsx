import React from 'react';
import { motion } from 'framer-motion';
import './IntroContent.css';

const IntroContent = () => {
  return (
    <motion.div 
      className="intro-content"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="intro-title">个人简介</h2>
      <div className="intro-details">
        <div className="intro-item">
          <span className="intro-label">昵称：</span>
          <span className="intro-value">Jerry.Z</span>
        </div>
        <div className="intro-item">
          <span className="intro-label">国籍：</span>
          <span className="intro-value">中国🇨🇳</span>
        </div>
        <div className="intro-item">
          <span className="intro-label">身份：</span>
          <span className="intro-value">高中生</span>
        </div>
        <div className="intro-item">
          <span className="intro-label">技术力：</span>
          <span className="intro-value">≈0</span>
        </div>
        <div className="intro-item">
          <span className="intro-label">特点：</span>
          <span className="intro-value">
            爱幻想
            <span className="intro-strikethrough">（所以AI真的太好用了你知道吗）</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroContent;