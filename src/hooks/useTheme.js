// src/hooks/useTheme.js
import { useState, useEffect } from "react";

/**
 * 主题模式枚举
 */
const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * 获取系统主题偏好
 * @returns {string} 'light' 或 'dark'
 */
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

/**
 * 检测主题是否需要切换
 * @param {string} newTheme - 新主题
 * @returns {boolean} 是否需要切换
 */
const shouldSwitchTheme = (newTheme) => {
  if (typeof document === 'undefined') return false;
  
  const currentIsDark = document.documentElement.classList.contains('dark');
  const newIsDark = newTheme === 'dark';
  
  return currentIsDark !== newIsDark;
};

/**
 * 应用主题到文档根元素
 * @param {string} theme - 要应用的主题 ('light' 或 'dark')
 */
const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;
  
  const isDark = theme === 'dark';
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export function useTheme() {
  // 1. 初始化状态：优先从 localStorage 读取，默认为 'system'
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("user-theme-preference") || THEME_MODES.SYSTEM;
    }
    return THEME_MODES.SYSTEM;
  });

  // 获取实际应用的主题（解析system模式）
  const getActualTheme = () => {
    if (themeMode === THEME_MODES.SYSTEM) {
      return getSystemTheme();
    }
    return themeMode;
  };

  // 应用主题
  useEffect(() => {
    const actualTheme = getActualTheme();
    applyTheme(actualTheme);
    
    // 持久化存储
    localStorage.setItem("user-theme-preference", themeMode);
  }, [themeMode]);

  // 当用户选择 'system' 时，监听系统主题变化
  useEffect(() => {
    if (themeMode !== THEME_MODES.SYSTEM) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleSystemThemeChange = () => {
      const newSystemTheme = mediaQuery.matches ? 'dark' : 'light';
      applyTheme(newSystemTheme);
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode]);

  // 设置主题
  const setTheme = (newThemeMode) => {
    if (Object.values(THEME_MODES).includes(newThemeMode)) {
      setThemeMode(newThemeMode);
    }
  };

  const actualTheme = getActualTheme();

  return {
    themeMode,
    actualTheme,
    setTheme,
    isDark: actualTheme === 'dark',
    THEME_MODES,
  };
}