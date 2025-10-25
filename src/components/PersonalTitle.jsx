import React from 'react';
import { motion } from 'framer-motion';
import './PersonalTitle.css';

const PersonalTitle = () => {
  return (
    <motion.div 
      className="personal-title-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        ease: "easeInOut"
      }}
    >
      <motion.h1 
        className="personal-title"
        whileHover={{ 
          scale: 1.05,
          textShadow: "0 0 10px rgba(255, 255, 255, 0.5)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
      >
        Jerry.Z的个人页
      </motion.h1>
    </motion.div>
  );
};

export default PersonalTitle;