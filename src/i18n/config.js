import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCN from './locales/zh-CN/translation.json';
import enUS from './locales/en-US/translation.json';

// i18next初始化配置
i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 使用react-i18next
  .use(initReactI18next)
  // 初始化配置
  .init({
    // 可用语言资源
    resources: {
      'zh-CN': {
        translation: zhCN
      },
      'en-US': {
        translation: enUS
      }
    },
    // 默认语言
    fallbackLng: 'zh-CN',
    // 调试模式（生产环境关闭）
    debug: false,
    // 语言检测配置
    detection: {
      // 检测顺序：localStorage -> 浏览器语言 -> 默认语言
      order: ['localStorage', 'navigator'],
      // 缓存用户选择的语言到localStorage
      caches: ['localStorage'],
      // localStorage的key名称
      lookupLocalStorage: 'i18nextLng'
    },
    // 插值配置
    interpolation: {
      // React已经处理了XSS，无需转义
      escapeValue: false
    }
  });

export default i18n;

