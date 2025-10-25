import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SidebarNav.css';

const SidebarNav = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'intro', label: '个人简介', icon: 'ri-user-3-line' },
    { id: 'nickname', label: '昵称的由来', icon: 'ri-question-line' }
  ];

  return (
    <motion.div 
      className="sidebar-nav"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className={`${item.icon} nav-icon`}></i>
            <span className="nav-label">{item.label}</span>
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
};

export default SidebarNav;