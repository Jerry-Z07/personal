import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });
  const dropdownRef = useRef(null);

  // 获取当前系统主题
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // 获取实际应用的主题（考虑跟随系统的情况）
  const getEffectiveTheme = () => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  };

  // 应用主题到DOM
  const applyTheme = (themeValue) => {
    const effectiveTheme = themeValue === 'system' ? getSystemTheme() : themeValue;
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  };

  // 初始化主题
  useEffect(() => {
    applyTheme(theme);
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

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
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    setIsOpen(false);
  };

  // 获取主题图标
  const getThemeIcon = () => {
    if (theme === 'system') {
      return 'ri-computer-line';
    }
    return getEffectiveTheme() === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
  };

  return (
    <div className="settings-dropdown" ref={dropdownRef}>
      <motion.button
        className="settings-button"
        onClick={() => setIsOpen(!isOpen)}
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
