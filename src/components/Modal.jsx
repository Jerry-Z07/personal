import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 独立的弹窗组件
 * 负责处理所有弹窗的显示、动画和内容展示
 * 
 * @param {Object} props
 * @param {string|null} props.selectedId - 当前选中的卡片 ID
 * @param {Function} props.setSelectedId - 设置选中卡片的函数
 */
function Modal({ selectedId, setSelectedId }) {
  
  // 根据选中的卡片ID获取对应的内容数据
  const getModalContent = (id) => {
    switch (id) {
      case 'bilibili':
        return {
          icon: "ri-bilibili-fill",
          iconColor: "text-[#00aeec]",
          title: "Bilibili 动态",
          content: (
            <div className="space-y-4">
              <p className="text-gray-500">这里可以通过 API 获取 B 站数据，或者放个 iframe 播放器。</p>
              {/* 示例占位符 */}
              <div className="h-32 rounded-xl bg-gray-200 dark:bg-white/5 animate-pulse" />
              <div className="h-32 rounded-xl bg-gray-200 dark:bg-white/5 animate-pulse" />
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

          {/* 2. 弹出的内容窗口 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
            <motion.div
              layoutId={`card-${selectedId}`} // 对应上面的 layoutId，实现无缝变形
              className="pointer-events-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl"
            >
              {/* 弹窗头部 */}
              <div className="relative p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                      <i className={`${modalData.icon} ${modalData.iconColor}`}></i>
                      {modalData.title}
                  </h2>
                  <button 
                    onClick={() => setSelectedId(null)} 
                    className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/10 transition-colors"
                    aria-label="关闭弹窗"
                  >
                      <i className="ri-close-line text-xl"></i>
                  </button>
              </div>

              {/* 弹窗内容区 */}
              <div className="p-8 h-[400px] overflow-y-auto">
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