import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import BilibiliUserInfo from './BilibiliUserInfo';
import BilibiliVideoList from './BilibiliVideoList';
import { useBilibiliData } from '../hooks/useData';

/**
 * 独立的弹窗组件
 * 负责处理所有弹窗的显示、动画和内容展示
 * 
 * @param {Object} props
 * @param {string|null} props.selectedId - 当前选中的卡片 ID
 * @param {Function} props.setSelectedId - 设置选中卡片的函数
 */
function Modal({ selectedId, setSelectedId }) {
  // 获取B站数据
  const { userInfo, videos, loading, error, refresh } = useBilibiliData();
  
  // 根据选中的卡片ID获取对应的内容数据
  const getModalContent = (id) => {
    switch (id) {
      case 'bilibili':
        return {
          icon: "ri-bilibili-fill",
          iconColor: "text-[#00aeec]",
          title: "Bilibili",
          content: (
            <div className="space-y-6">
              {/* 用户信息条 */}
              <div>
                <BilibiliUserInfo 
                  userInfo={userInfo} 
                  loading={loading && !userInfo}
                />
              </div>

              {/* 视频列表容器 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    <i className="ri-film-line mr-2"></i>最近视频
                  </h3>
                  {/* 刷新按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={refresh}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center disabled:opacity-50"
                  >
                    <i className={`ri-refresh-line mr-1.5 ${loading ? 'animate-spin' : ''}`}></i>
                    {loading ? '加载中...' : '刷新'}
                  </motion.button>
                </div>

                {/* 视频列表 - 使用响应式网格布局 */}
                <BilibiliVideoList
                  videos={videos}
                  loading={loading && !videos.length}
                  error={error}
                  onVideoClick={(video) => {
                    // 处理视频点击事件，可以打开视频播放或跳转到B站
                    const url = video.bvid 
                      ? `https://www.bilibili.com/video/${video.bvid}`
                      : `https://www.bilibili.com/video/av${video.aid}`;
                    window.open(url, '_blank');
                  }}
                  className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                />
              </div>
            </div>
          )
        };
      
      case 'blog':
        return {
          icon: "ri-article-fill", 
          iconColor: "text-orange-500",
          title: "博客文章",
          content: (
            <div className="prose dark:prose-invert">
              <h3>最近更新</h3>
              <p>这里用来展示你的博客文章列表，或者 RSS 订阅内容。</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>如何使用 React + Framer Motion 构建网站</li>
                <li>Tailwind CSS 的进阶技巧</li>
                <li>2024 年前端技术展望</li>
              </ul>
            </div>
          )
        };
      
      default:
        return null;
    }
  };

  const modalData = selectedId ? getModalContent(selectedId) : null;

  return (
    <AnimatePresence>
      {selectedId && (
        <>
          {/* 1. 黑色遮罩层 (点击关闭) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* 2. 弹出的内容窗口 - 自适应缩放 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-2 sm:p-4 md:p-6 lg:p-8">
            <motion.div
              layoutId={`card-${selectedId}`} // 对应上面的 layoutId，实现无缝变形
              className="pointer-events-auto w-full h-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl"
            >
              {/* 弹窗头部 - 自适应内边距 */}
              <div className="relative p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                      <i className={`${modalData.icon} ${modalData.iconColor}`}></i>
                      {modalData.title}
                  </h2>
                  <button 
                    onClick={() => setSelectedId(null)} 
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/10 transition-colors"
                    aria-label="关闭弹窗"
                  >
                      <i className="ri-close-line text-lg sm:text-xl"></i>
                  </button>
              </div>

              {/* 弹窗内容区 - 自适应高度和内边距 */}
              <div className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(90vh-4rem)] sm:max-h-[calc(90vh-5rem)] md:max-h-[calc(90vh-6rem)]">
                {modalData.content}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;