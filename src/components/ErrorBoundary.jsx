import React, { Component } from 'react';
import { useTranslation } from 'react-i18next';
import './ErrorBoundary.css';

/**
 * 错误边界组件，用于捕获和处理子组件树中的JavaScript错误
 * 在懒加载组件时尤为重要，可以防止单个组件的错误导致整个应用崩溃
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，下次渲染时显示降级UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 可以在这里记录错误信息到错误追踪服务
    console.error('组件渲染错误:', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children, fallback: CustomFallback } = this.props;

    if (hasError) {
      // 如果提供了自定义的降级UI组件，则使用它
      if (CustomFallback) {
        return <CustomFallback />;
      }
      
      // 否则使用默认的降级UI
      return <DefaultErrorFallback />;
    }

    return children;
  }
}

/**
 * 默认的错误边界降级UI组件
 */
const DefaultErrorFallback = () => {
  const { t } = useTranslation();
  
  return (
    <div className="error-boundary-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{t('error.title')}</h3>
      <p className="error-message">{t('error.message')}</p>
      <button 
        className="error-retry-button"
        onClick={() => window.location.reload()}
      >
        {t('error.retry')}
      </button>
    </div>
  );
};

export default ErrorBoundary;