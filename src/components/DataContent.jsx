import { useTranslation } from 'react-i18next';
import AnimatedContent from './AnimatedContent';
import './DataContent.css';

/**
 * DataContent - 通用数据内容组件
 * 提供数据获取、缓存、加载和错误状态管理的通用逻辑
 * 基于React Query实现
 * 
 * @param {Object} props - 组件属性
 * @param {Function} props.useQueryHook - React Query hook
 * @param {React.ReactNode} props.renderData - 数据渲染函数
 * @param {string} props.titleKey - 页面标题的i18n键
 */
const DataContent = ({ 
  useQueryHook, // React Query hook
  renderData, 
  titleKey = '',
  loadingComponent,
  errorComponent,
  className = '',
  ...rest 
}) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  // 使用React Query管理数据
  const { data, isLoading, error, refetch } = useQueryHook();
  
  // 处理刷新事件
  const handleRefresh = async () => {
    await refetch();
    if (typeof rest.onRefresh === 'function') {
      rest.onRefresh();
    }
  };

  // 加载状态
  if (isLoading) {
    return (
      <AnimatedContent titleKey={titleKey}>
        {loadingComponent || (
          <div className="data-loading">
            <div className="data-loading-spinner"></div>
            <p>{t('data.loading')}</p>
          </div>
        )}
      </AnimatedContent>
    );
  }

  // 错误状态
  if (error) {
    return (
      <AnimatedContent titleKey={titleKey}>
        {errorComponent || (
          <div className="data-error">
            <p>{t('data.error')}</p>
            <button onClick={handleRefresh} className="data-retry-button">
              {t('data.retry')}
            </button>
          </div>
        )}
      </AnimatedContent>
    );
  }

  // 正常数据状态
  return (
    <AnimatedContent titleKey={titleKey} className={`data-content ${className}`} onClick={handleRefresh}>
      {renderData(data)}
    </AnimatedContent>
  );
};

export default DataContent;