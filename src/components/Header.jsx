import React from 'react';
import { motion } from 'framer-motion';
import './Header.css';

const Header = () => {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="header-container">
        <div className="header-brand">
          <motion.h1 
            className="brand-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Jerry.Z
          </motion.h1>
        </div>
        
        <nav className="header-nav">
          <motion.a 
            href="#home" 
            className="nav-link active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            首页
          </motion.a>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;