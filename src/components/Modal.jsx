import React, { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 动态导入大型子组件进行代码分割
const BilibiliUserInfo = React.lazy(() => import('./BilibiliUserInfo'));
const BilibiliVideoList = React.lazy(() => import('./BilibiliVideoList'));
const BlogList = React.lazy(() => import('./BlogList'));
import { useBilibiliData, useBlogFeed } from '../hooks/useData';

// 加载状态组件
const ComponentLoader = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center p-8">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  }>
    {children}
  </Suspense>
);

function Modal({ selectedId, setSelectedId }) {
  const { userInfo, videos, loading, error, refresh } = useBilibiliData();
  const { posts, loading: blogLoading, error: blogError, refresh: refreshBlog } = useBlogFeed(5);

  // 动画过渡参数：统一与 PC 保持一致的 spring，确保视觉一致性
  const containerTransition = { type: "spring", stiffness: 260, damping: 30, mass: 0.7 };

  // 内容显隐：在容器布局动画完成后再展示重内容，降低绘制压力
  const [contentVisible, setContentVisible] = useState(false);
  useEffect(() => {
    if (selectedId) setContentVisible(false);
  }, [selectedId]);
  

  const getModalContent = (id) => {
    switch (id) {
      case 'bilibili':
        return {
          icon: "ri-bilibili-fill",
          iconColor: "text-[#00aeec]",
          title: "Bilibili",
          content: (
            <div className="space-y-6">
              <ComponentLoader>
                <BilibiliUserInfo userInfo={userInfo} loading={loading && !userInfo}/>
              </ComponentLoader>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white"><i className="ri-film-line mr-2"></i>最近视频</h3>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refresh} disabled={loading} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center disabled:opacity-50">
                    <i className={`ri-refresh-line mr-1.5 ${loading ? 'animate-spin' : ''}`}></i>{loading ? '加载中...' : '刷新'}
                  </motion.button>
                </div>
                <ComponentLoader>
                  <BilibiliVideoList 
                    videos={videos} 
                    loading={loading && !videos.length} 
                    error={error} 
                    className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    onVideoClick={(video) => {
                      const url = video.bvid ? `https://www.bilibili.com/video/${video.bvid}` : `https://www.bilibili.com/video/av${video.aid}`;
                      window.open(url, '_blank');
                    }}
                  />
                </ComponentLoader>
              </div>
            </div>
          )
        };
      case 'blog':
        return {
          icon: "ri-article-fill", iconColor: "text-orange-500", title: "博客文章",
          content: (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white"><i className="ri-article-line mr-2"></i>最近更新</h3>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={refreshBlog} disabled={blogLoading} className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center disabled:opacity-50">
                  <i className={`ri-refresh-line mr-1.5 ${blogLoading ? 'animate-spin' : ''}`}></i>{blogLoading ? '加载中...' : '刷新'}
                </motion.button>
              </div>
              <ComponentLoader>
                <BlogList posts={posts} loading={blogLoading} error={blogError} className="" />
              </ComponentLoader>
            </div>
          )
        };
      default: return null;
    }
  };

  const modalData = selectedId ? getModalContent(selectedId) : null;

  return (
    <AnimatePresence>
      {selectedId && (
        <>
          {/* 

          */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] sm:backdrop-blur-sm"
          />

          {/* 弹窗容器 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-2 sm:p-4 md:p-6 lg:p-8">
            <motion.div
              layoutId={`card-${selectedId}`}
              transition={containerTransition}
              style={{ willChange: "transform" }}
              onLayoutAnimationComplete={() => setContentVisible(true)}
              className="transform-gpu pointer-events-auto w-full h-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 shadow-xl md:shadow-2xl flex flex-col"
            >
              {/* 
              */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }} // 瞬发消失
                style={{ willChange: "opacity" }}
                className="flex flex-col h-full"
              >
                {/* 头部 */}
                <div className="relative p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center shrink-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                        <i className={`${modalData.icon} ${modalData.iconColor}`}></i>
                        {modalData.title}
                    </h2>
                    <button 
                      onClick={() => setSelectedId(null)} 
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/10 transition-colors"
                    >
                        <i className="ri-close-line text-lg sm:text-xl"></i>
                    </button>
                </div>

                {/* 内容 */}
                <div className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto flex-1" style={{ contentVisibility: "auto", contain: "layout paint style" }}>
                  {contentVisible && modalData.content}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Modal;
