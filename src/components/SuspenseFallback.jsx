import { useTranslation } from 'react-i18next';
import './SuspenseFallback.css';

/**
 * 全局的Suspense加载组件
 * 用于包裹懒加载组件时显示的默认加载状态
 */
const SuspenseFallback = ({ message }) => {
  const { t } = useTranslation();
  
  // 如果没有提供自定义消息，使用默认的加载文本
  const displayMessage = message || t('loading.default');
  
  return (
    <div className="suspense-fallback-container">
      <div className="suspense-spinner"></div>
      <p className="suspense-message">{displayMessage}</p>
    </div>
  );
};

export default SuspenseFallback;