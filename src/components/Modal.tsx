import {
  lazy,
  Suspense,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBilibiliData, useBlogFeed } from '../hooks/useData'
import type { BilibiliVideo, ModalSelectedId } from '../types/domain'

const MotionDiv = motion.div
const MotionButton = motion.button

// 动态导入大型子组件进行代码分割。
const BilibiliUserInfo = lazy(() => import('./BilibiliUserInfo'))
const BilibiliVideoList = lazy(() => import('./BilibiliVideoList'))
const BlogList = lazy(() => import('./BlogList'))

interface ComponentLoaderProps {
  children: ReactNode
}

/**
 * 子组件异步加载器。
 */
function ComponentLoader({ children }: ComponentLoaderProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

interface ModalProps {
  selectedId: ModalSelectedId
  setSelectedId: Dispatch<SetStateAction<ModalSelectedId>>
}

interface ModalContent {
  icon: string
  iconColor: string
  title: string
  content: ReactNode
}

/**
 * 详情弹窗组件。
 */
export default function Modal({ selectedId, setSelectedId }: ModalProps) {
  const { userInfo, videos, loading, error, refresh } = useBilibiliData()
  const {
    posts,
    loading: blogLoading,
    error: blogError,
    refresh: refreshBlog,
  } = useBlogFeed(5)

  const containerTransition = { type: 'spring' as const, stiffness: 260, damping: 30, mass: 0.7 }

  // 内容显隐：仅在布局动画完成后展示重内容，降低绘制压力。
  const [contentVisible, setContentVisible] = useState<boolean>(false)

  const closeModal = (): void => {
    setSelectedId(null)
  }

  const getModalContent = (id: Exclude<ModalSelectedId, null>): ModalContent => {
    switch (id) {
      case 'bilibili':
        return {
          icon: 'ri-bilibili-fill',
          iconColor: 'text-[#00aeec]',
          title: 'Bilibili',
          content: (
            <div className="space-y-6">
              <ComponentLoader>
                <BilibiliUserInfo userInfo={userInfo} loading={loading && !userInfo} />
              </ComponentLoader>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    <i className="ri-film-line mr-2" />最近视频
                  </h3>
                  <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      void refresh()
                    }}
                    disabled={loading}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center disabled:opacity-50"
                  >
                    <i className={`ri-refresh-line mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? '加载中...' : '刷新'}
                  </MotionButton>
                </div>

                <ComponentLoader>
                  <BilibiliVideoList
                    videos={videos}
                    loading={loading && !videos.length}
                    error={error}
                    className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    onVideoClick={(video: BilibiliVideo) => {
                      const url = video.bvid
                        ? `https://www.bilibili.com/video/${video.bvid}`
                        : `https://www.bilibili.com/video/av${video.aid}`
                      window.open(url, '_blank')
                    }}
                  />
                </ComponentLoader>
              </div>
            </div>
          ),
        }

      case 'blog':
        return {
          icon: 'ri-article-fill',
          iconColor: 'text-orange-500',
          title: '博客文章',
          content: (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  <i className="ri-article-line mr-2" />最近更新
                </h3>
                <MotionButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    void refreshBlog()
                  }}
                  disabled={blogLoading}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center disabled:opacity-50"
                >
                  <i className={`ri-refresh-line mr-1.5 ${blogLoading ? 'animate-spin' : ''}`} />
                  {blogLoading ? '加载中...' : '刷新'}
                </MotionButton>
              </div>

              <ComponentLoader>
                <BlogList posts={posts} loading={blogLoading} error={blogError} />
              </ComponentLoader>
            </div>
          ),
        }

      default:
        return {
          icon: '',
          iconColor: '',
          title: '',
          content: null,
        }
    }
  }

  const modalData = selectedId ? getModalContent(selectedId) : null

  return (
    <AnimatePresence>
      {selectedId && modalData && (
        <>
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onClick={closeModal}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] sm:backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-2 sm:p-4 md:p-6 lg:p-8">
            <MotionDiv
              key={selectedId}
              layoutId={`card-${selectedId}`}
              transition={containerTransition}
              style={{ willChange: 'transform' }}
              onAnimationStart={() => setContentVisible(false)}
              onLayoutAnimationComplete={() => setContentVisible(true)}
              className="transform-gpu pointer-events-auto w-full h-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 shadow-xl md:shadow-2xl flex flex-col"
            >
              <MotionDiv
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                style={{ willChange: 'opacity' }}
                className="flex flex-col h-full"
              >
                <div className="relative p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center shrink-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2">
                    <i className={`${modalData.icon} ${modalData.iconColor}`} />
                    {modalData.title}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/10 transition-colors"
                  >
                    <i className="ri-close-line text-lg sm:text-xl" />
                  </button>
                </div>

                <div
                  className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto flex-1"
                  style={{ contentVisibility: 'auto', contain: 'layout paint style' }}
                >
                  {contentVisible && modalData.content}
                </div>
              </MotionDiv>
            </MotionDiv>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
