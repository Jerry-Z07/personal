import React from 'react';
import { motion } from 'framer-motion';
import './NicknameContent.css';

const NicknameContent = () => {
  return (
    <motion.div 
      className="nickname-content"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="nickname-title">昵称的由来</h2>
      <div className="nickname-details">
        <div className="nickname-item">
          <span className="nickname-label">Jerry：</span>
          <span className="nickname-value">
            来源于动画《猫和老鼠》
            <img src="/images/OIP.webp" alt="猫和老鼠" className="tom-jerry-image" />
          </span>
        </div>
        <div className="nickname-item">
          <span className="nickname-label">Z：</span>
          <span className="nickname-value">姓名中某字的首字母</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NicknameContent;