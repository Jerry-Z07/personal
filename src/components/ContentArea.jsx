import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 使用React.lazy懒加载其他内容组件
const IntroContent = lazy(() => import('./IntroContent'));
const NicknameContent = lazy(() => import('./NicknameContent'));
const ProjectsContent = lazy(() => import('./ProjectsContent'));
import SuspenseFallback from './SuspenseFallback';
import ErrorBoundary from './ErrorBoundary';
// 使用React.lazy懒加载BilibiliContent组件
const BilibiliContent = lazy(() => import('./BilibiliContent'));
// 使用React.lazy懒加载BlogContent组件
const BlogContent = lazy(() => import('./BlogContent'));
import './ContentArea.css';

const ContentArea = ({ mainTab, subTab, showSidebar, onRefreshBilibili, onRefreshBlog }) => {
  const renderContent = () => {
    // 如果是 intro 主标签，根据 subTab 来显示内容
    if (mainTab === 'intro') {
      switch (subTab) {
        case 'intro':
          return (
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback message="加载简介内容..." />}>
                <IntroContent />
              </Suspense>
            </ErrorBoundary>
          );
        case 'nickname':
          return (
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback message="加载昵称说明..." />}>
                <NicknameContent />
              </Suspense>
            </ErrorBoundary>
          );
        case 'projects':
          return (
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback message="加载项目列表..." />}>
                <ProjectsContent />
              </Suspense>
            </ErrorBoundary>
          );
        default:
          return (
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback message="加载简介内容..." />}>
                <IntroContent />
              </Suspense>
            </ErrorBoundary>
          );
      }
    }
    
    // 其他主标签直接根据 mainTab 显示
    switch (mainTab) {
      case 'bilibili':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SuspenseFallback message="加载B站数据中..." />}>
              <BilibiliContent onRefresh={onRefreshBilibili} />
            </Suspense>
          </ErrorBoundary>
        );
      case 'blog':
        return (
          <ErrorBoundary>
            <Suspense fallback={<SuspenseFallback message="加载博客数据中..." />}>
              <BlogContent onRefresh={onRefreshBlog} />
            </Suspense>
          </ErrorBoundary>
        );
      default:
          return (
            <ErrorBoundary>
              <Suspense fallback={<SuspenseFallback message="加载简介内容..." />}>
                <IntroContent />
              </Suspense>
            </ErrorBoundary>
          );
    }
  };

  return (
    <div className={`content-area ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

export default ContentArea;