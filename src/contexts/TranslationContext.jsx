import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建翻译上下文
const TranslationContext = createContext();

// 自定义Hook用于使用翻译上下文
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

/**
 * 翻译提供者组件 - 统一管理翻译数据
 */
export const TranslationProvider = ({ children }) => {
  const [userLang, setUserLang] = useState('zh-CN');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // 获取用户语言设置
    const lang = navigator.language || 'zh-CN';
    setUserLang(lang);
    
    // 加载翻译数据
    loadTranslations(lang);
  }, []);

  const loadTranslations = async (lang) => {
    try {
      // 使用相对路径导入翻译文件
      const module = await import('../../js/translations.js');
      const trans = module.translations || {};
      setTranslations(trans[lang] || trans['zh'] || {});
    } catch (error) {
      console.log('加载翻译失败，使用默认中文');
      setTranslations({
        title: '你好，我是JlyVC',
        buttons: {
          github: 'GitHub',
          blog: '博客',
          bilibili: 'Bilibili'
        }
      });
    }
  };

  const getWelcomeMessage = (lang) => {
    const messages = {
      'zh-CN': '愿你永远心怀热爱，眼里总有星辰大海。',
      'en-US': 'May passion abide in your heart forever, and may your eyes never fail to hold the stars and the boundless sea.',
    };
    return messages[lang] || messages['zh-CN'];
  };

  const value = {
    userLang,
    translations,
    getWelcomeMessage
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export default TranslationContext;