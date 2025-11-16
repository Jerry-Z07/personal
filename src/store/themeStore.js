import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 主题状态管理
 * 使用 Zustand 进行主题状态管理，支持持久化存储到 localStorage
 */
const useThemeStore = create(
  persist(
    (set, get) => ({
      // 当前主题
      theme: 'system', // 可选值: 'light', 'dark', 'system'
      
      // 设置主题
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        
        // 应用主题到DOM
        const applyTheme = (themeValue) => {
          const effectiveTheme = themeValue === 'system' ? get().getSystemTheme() : themeValue;
          document.documentElement.setAttribute('data-theme', effectiveTheme);
        };
        
        // 保存到localStorage
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
      },
      
      // 获取当前系统主题
      getSystemTheme: () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      },
      
      // 获取实际应用的主题（考虑跟随系统的情况）
      getEffectiveTheme: () => {
        const { theme, getSystemTheme } = get();
        if (theme === 'system') {
          return getSystemTheme();
        }
        return theme;
      },
      
      // 获取主题图标
      getThemeIcon: () => {
        const { theme, getEffectiveTheme } = get();
        if (theme === 'system') {
          return 'ri-computer-line';
        }
        return getEffectiveTheme() === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
      },
      
      // 应用主题到DOM
      applyTheme: () => {
        const { theme, getSystemTheme } = get();
        const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
        document.documentElement.setAttribute('data-theme', effectiveTheme);
      }
    }),
    {
      name: 'theme-storage', // 存储键名
      storage: typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      }
    }
  )
);

export default useThemeStore;