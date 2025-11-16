import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 语言状态管理
 * 使用 Zustand 进行语言状态管理，支持持久化存储到 localStorage
 */
const useLanguageStore = create(
  persist(
    (set, get) => ({
      // 当前语言
      currentLanguage: 'zh',
      
      // 设置语言
      setLanguage: (lang) => {
        set({ currentLanguage: lang });
        // 更新html lang属性
        document.documentElement.lang = lang;
      },
      
      // 切换语言
      toggleLanguage: () => {
        const { currentLanguage } = get();
        const newLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        set({ currentLanguage: newLanguage });
        // 更新html lang属性
        document.documentElement.lang = newLanguage;
      }
    }),
    {
      name: 'language-storage', // 存储键名
      storage: typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      }
    }
  )
);

export default useLanguageStore;