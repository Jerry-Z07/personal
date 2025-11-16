import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../store';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // 使用主题状态管理
  const { 
    theme, 
    setTheme, 
    getSystemTheme, 
    getEffectiveTheme, 
    getThemeIcon, 
    applyTheme 
  } = useThemeStore();

  // 初始化主题
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  // 监听系统主题变化
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 切换语言
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  // 切换主题
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="settings-dropdown" ref={dropdownRef}>
      <motion.button
        className="settings-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.15 }}
        aria-label="Settings"
      >
        <i className="ri-translate-2"></i>
        <span className="divider">/</span>
        <i className={getThemeIcon()}></i>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* 语言选择 */}
            <div className="dropdown-section">
              <div className="section-title">语言 / Language</div>
              <button
                className={`dropdown-item ${i18n.language === 'zh-CN' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('zh-CN')}
              >
                <span>简体中文</span>
                {i18n.language === 'zh-CN' && <i className="ri-check-line"></i>}
              </button>
              <button
                className={`dropdown-item ${i18n.language === 'en-US' ? 'active' : ''}`}
                onClick={() => handleLanguageChange('en-US')}
              >
                <span>English</span>
                {i18n.language === 'en-US' && <i className="ri-check-line"></i>}
              </button>
            </div>

            {/* 主题选择 */}
            <div className="dropdown-section">
              <div className="section-title">主题 / Theme</div>
              <button
                className={`dropdown-item ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <i className="ri-sun-line"></i>
                <span>浅色</span>
                {theme === 'light' && <i className="ri-check-line"></i>}
              </button>
              <button
                className={`dropdown-item ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <i className="ri-moon-line"></i>
                <span>深色</span>
                {theme === 'dark' && <i className="ri-check-line"></i>}
              </button>
              <button
                className={`dropdown-item ${theme === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <i className="ri-computer-line"></i>
                <span>跟随系统</span>
                {theme === 'system' && <i className="ri-check-line"></i>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
