import {
  useCallback,
  useEffect,
  lazy,
  useRef,
  Suspense,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion'
import { useBilibiliData, useBlogFeed } from '../hooks/useData'
import type { BilibiliVideo, ModalSelectedId } from '../types/domain'

const MotionDiv = motion.div
const MotionButton = motion.button
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)'
const SHEET_COLLAPSED_RATIO = 0.6
const SHEET_EXPANDED_RATIO = 0.85
const SHEET_CLOSE_DISTANCE = 180
const SHEET_CLOSE_VELOCITY = 900
const SHEET_SNAP_DISTANCE = 70
const SHEET_SNAP_VELOCITY = 260

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

  // 响应式状态：用于区分桌面弹窗与移动端抽屉。
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return true
    }
    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches
  })

  // 内容显隐：仅在布局动画完成后展示重内容，降低绘制压力。
  const [contentVisible, setContentVisible] = useState<boolean>(false)
  const [sheetSnapRatio, setSheetSnapRatio] = useState<number>(SHEET_EXPANDED_RATIO)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const previousBodyOverflowRef = useRef<string>('')
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const sheetDragControls = useDragControls()
  const isSheetExpanded = sheetSnapRatio > (SHEET_COLLAPSED_RATIO + SHEET_EXPANDED_RATIO) / 2

  const closeModal = useCallback((): void => {
    // 关闭前重置内容可见状态，避免下次打开时重内容提前闪现。
    setContentVisible(false)
    setSheetSnapRatio(SHEET_EXPANDED_RATIO)
    setSelectedId(null)
  }, [setSelectedId])

  // 手动切换抽屉吸附点，便于单手快速展开/收起。
  const toggleSheetSnap = useCallback((): void => {
    setSheetSnapRatio((prev) =>
      prev > (SHEET_COLLAPSED_RATIO + SHEET_EXPANDED_RATIO) / 2
        ? SHEET_COLLAPSED_RATIO
        : SHEET_EXPANDED_RATIO,
    )
  }, [])

  // 根据拖拽位移与速度决定关闭或吸附到最近的 snap point。
  const handleSheetDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
      const movedDown = info.offset.y > SHEET_CLOSE_DISTANCE || info.velocity.y > SHEET_CLOSE_VELOCITY
      if (movedDown) {
        closeModal()
        return
      }

      const shouldCollapse = info.offset.y > SHEET_SNAP_DISTANCE || info.velocity.y > SHEET_SNAP_VELOCITY
      if (shouldCollapse) {
        setSheetSnapRatio(SHEET_COLLAPSED_RATIO)
        return
      }

      const shouldExpand = info.offset.y < -SHEET_SNAP_DISTANCE || info.velocity.y < -SHEET_SNAP_VELOCITY
      if (shouldExpand) {
        setSheetSnapRatio(SHEET_EXPANDED_RATIO)
      }
    },
    [closeModal],
  )

  // 监听断点变化，实时切换桌面弹窗/移动抽屉形态。
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQueryList = window.matchMedia(DESKTOP_MEDIA_QUERY)
    const updateByMedia = (matches: boolean): void => {
      setIsDesktop(matches)
    }

    updateByMedia(mediaQueryList.matches)

    const handleChange = (event: MediaQueryListEvent): void => {
      updateByMedia(event.matches)
    }

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', handleChange)
      return () => {
        mediaQueryList.removeEventListener('change', handleChange)
      }
    }

    // 兼容旧版浏览器的监听 API。
    mediaQueryList.addListener(handleChange)
    return () => {
      mediaQueryList.removeListener(handleChange)
    }
  }, [])

  // 弹层打开时锁定页面滚动，关闭或卸载时恢复。
  useEffect(() => {
    if (!selectedId) {
      return
    }

    try {
      previousBodyOverflowRef.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } catch (error) {
      console.error('锁定页面滚动失败:', error)
    }

    return () => {
      try {
        document.body.style.overflow = previousBodyOverflowRef.current
      } catch (error) {
        console.error('恢复页面滚动失败:', error)
      }
    }
  }, [selectedId])

  // 记录触发元素并在弹层打开后将焦点引导到关闭按钮，提升可访问性。
  useEffect(() => {
    if (!selectedId) {
      return
    }

    const activeElement = document.activeElement
    if (activeElement instanceof HTMLElement) {
      lastFocusedElementRef.current = activeElement
    }

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 0)

    return () => {
      window.clearTimeout(focusTimer)
    }
  }, [selectedId])

  // 弹层关闭后将焦点返回到触发元素，避免键盘用户丢失上下文。
  useEffect(() => {
    if (selectedId) {
      return
    }

    try {
      lastFocusedElementRef.current?.focus()
    } catch (error) {
      console.error('恢复触发元素焦点失败:', error)
    }
  }, [selectedId])

  // 统一处理 Esc 关闭。
  useEffect(() => {
    if (!selectedId) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return
      }
      event.preventDefault()
      closeModal()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeModal, selectedId])

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
  const titleId = selectedId ? `modal-title-${selectedId}` : 'modal-title'

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

          {isDesktop ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-2 sm:p-4 md:p-6 lg:p-8">
              <MotionDiv
                key={selectedId}
                layoutId={`card-${selectedId}`}
                transition={containerTransition}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="modal-will-change-transform transform-gpu pointer-events-auto w-full h-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 shadow-xl md:shadow-2xl flex flex-col"
                onAnimationStart={() => setContentVisible(false)}
                onLayoutAnimationComplete={() => setContentVisible(true)}
              >
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0 } }}
                  className="modal-will-change-opacity flex flex-col h-full"
                >
                  <div className="relative p-3 sm:p-4 md:p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center shrink-0">
                    <h2
                      id={titleId}
                      className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-2"
                    >
                      <i className={`${modalData.icon} ${modalData.iconColor}`} />
                      {modalData.title}
                    </h2>
                    <button
                      ref={closeButtonRef}
                      onClick={closeModal}
                      className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/10 transition-colors"
                      aria-label="关闭弹层"
                    >
                      <i className="ri-close-line text-lg sm:text-xl" />
                    </button>
                  </div>

                  <div className="modal-content-optimization p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto flex-1">
                    {contentVisible && modalData.content}
                  </div>
                </MotionDiv>
              </MotionDiv>
            </div>
          ) : (
            <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
              <MotionDiv
                key={`sheet-${selectedId}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                drag="y"
                dragControls={sheetDragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.35 }}
                dragMomentum={false}
                initial={{ y: '100%' }}
                animate={{ y: 0, height: `${Math.round(sheetSnapRatio * 100)}dvh` }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 0.8 }}
                onDragEnd={handleSheetDragEnd}
                className="sheet-will-change-transform transform-gpu pointer-events-auto w-full max-h-[85dvh] rounded-t-3xl bg-white dark:bg-zinc-900 shadow-2xl flex flex-col"
              >
                <div className="relative px-4 pt-3 pb-3 border-b border-gray-100 dark:border-white/10 shrink-0">
                  <div
                    className="sheet-drag-handle-zone mx-auto mb-3"
                    onPointerDown={(event) => {
                      try {
                        sheetDragControls.start(event)
                      } catch (error) {
                        console.error('启动抽屉拖拽失败:', error)
                      }
                    }}
                  >
                    <div className="sheet-handle mx-auto" />
                  </div>
                  <div className="flex justify-between items-center">
                    <h2 id={titleId} className="text-lg font-bold flex items-center gap-2">
                      <i className={`${modalData.icon} ${modalData.iconColor}`} />
                      {modalData.title}
                    </h2>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={toggleSheetSnap}
                        className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/10 transition-colors"
                        aria-label={isSheetExpanded ? '收起抽屉' : '展开抽屉'}
                      >
                        <i className={`text-xl ${isSheetExpanded ? 'ri-arrow-down-s-line' : 'ri-arrow-up-s-line'}`} />
                      </button>
                      <button
                        ref={closeButtonRef}
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-white/10 transition-colors"
                        aria-label="关闭弹层"
                      >
                        <i className="ri-close-line text-xl" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sheet-scroll-region sheet-safe-padding modal-content-optimization p-4 overflow-y-auto flex-1">
                  {modalData.content}
                </div>
              </MotionDiv>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
