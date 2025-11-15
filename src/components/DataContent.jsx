import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AnimatedContent from './AnimatedContent';
import cacheManager from '../cacheManager';
import './DataContent.css';

/**
 * DataContent - 通用数据内容组件
 * 提供数据获取、缓存、加载和错误状态管理的通用逻辑
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.cacheKey - 缓存键
 * @param {Function} props.fetchData - 数据获取函数
 * @param {React.ReactNode} props.renderData - 数据渲染函数
 * @param {number} props.cacheDuration - 缓存时长(毫秒)
 * @param {string} props.titleKey - 页面标题的i18n键
 */
const DataContent = ({ 
  cacheKey, 
  fetchData, 
  renderData, 
  cacheDuration = 5 * 60 * 1000, // 5分钟
  titleKey = '',
  loadingComponent,
  errorComponent,
  className = '',
  ...rest 
}) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 数据加载逻辑
  const loadData = async () => {
    // 如果有缓存，直接使用缓存
    if (cacheManager.has(cacheKey)) {
      const cachedData = cacheManager.get(cacheKey);
      setData(cachedData);
      setLoading(false);
      return;
    }

    // 没有缓存则获取数据
    try {
      setLoading(true);
      const fetchedData = await fetchData();
      setData(fetchedData);
      cacheManager.set(cacheKey, fetchedData, cacheDuration);
      setError(null);
    } catch (err) {
      console.error(t('app.data.error', { key: cacheKey }), err);
      setError(t('data.error'));
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  // 提供刷新功能的回调
  const handleRefresh = async () => {
    try {
      setLoading(true);
      cacheManager.clear(cacheKey);
      
      const fetchedData = await fetchData();
      setData(fetchedData);
      cacheManager.set(cacheKey, fetchedData, cacheDuration);
      setError(null);
    } catch (err) {
      console.error(t('app.data.refreshError', { key: cacheKey }), err);
      setError(t('data.error'));
    } finally {
      setLoading(false);
    }
  };

  // 返回刷新函数给父组件使用
  useEffect(() => {
    // 如果父组件需要使用刷新功能，可以在这里暴露
    if (typeof rest.onRefresh === 'function') {
      rest.onRefresh(handleRefresh);
    }
  }, [rest.onRefresh]);

  // 加载状态
  if (loading) {
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
            <p>{error}</p>
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
    <AnimatedContent titleKey={titleKey} className={`data-content ${className}`}>
      {renderData(data)}
    </AnimatedContent>
  );
};

export default DataContent;