import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import BentoCard from './components/BentoCard'
import Modal from './components/Modal'
import { MICRO_INTERACTION_TRANSITION } from './components/motionPresets'
import { useBilibiliData, useBlogFeed } from './hooks/useData'
import { useThemeMode, type ThemeMode } from './hooks/useThemeMode'
import { fetchDailyPoemText, formatCompactCount, formatPublishTime } from './utils/api'
import type { BilibiliVideo, ModalSelectedId } from './types/domain'

const MotionDiv = motion.div

interface SocialLink {
  name: string
  icon: string
  url: string
  color: string
}

interface ProjectItem {
  name: string
  description: string
  icon?: string
  // 图标展示形态：默认圆形；矩形图标可设置为 rect，避免被圆形裁切。
  iconShape?: 'circle' | 'rect'
  color: string
  url: string
}

interface ToolItem {
  name: string
  icon: string
  color: string
  url: string
}

interface ThemeModeOption {
  mode: ThemeMode
  label: string
  icon: string
}

const DEFAULT_POEM_TEXT = '热衷于创造简洁、优雅的代码艺术。'

// 卡片入场阶梯间隔：配合 0.35s 的入场时长，整屏在 0.7s 内完成落位。
const CARD_ENTRANCE_STAGGER = 0.06

// 链接数据
const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    icon: 'ri-github-fill',
    url: 'https://github.com/Jerry-Z07',
    color: 'bg-gray-800 text-white',
  },
  {
    name: 'Blog',
    icon: 'ri-article-line',
    url: 'https://blog.078465.xyz/',
    color: 'bg-orange-500/20 text-orange-500',
  },
  {
    name: 'RSS',
    icon: 'ri-rss-line',
    url: 'https://blog.078465.xyz/feed/',
    color: 'bg-amber-500/20 text-amber-600',
  },
]

// 项目数据
const PROJECTS: ProjectItem[] = [
  {
    name: 'Mixi',
    description: 'Mix Inteligence.一个多功能的QQ机器人',
    icon: 'https://q.qlogo.cn/headimg_dl?dst_uin=3834216037&spec=640',
    color: 'bg-blue-500/20 text-blue-500',
    url: 'https://mh.078465.xyz',
  },
  {
    name: '轻风白板',
    description: '开源、简洁、易上手的电子白板',
    icon: 'https://edgeone.gh-proxy.org/https://github.com/Jerry-Z07/WindBoard/blob/main/WindBoard/Assets/icon.ico',
    iconShape: 'rect',
    color: 'bg-emerald-500/20 text-emerald-500',
    url: 'https://github.com/Jerry-Z07/WindBoard',
  },
]

// 工具数据（当前为空，保留类型以便后续扩展）
const TOOLS: ToolItem[] = []

const THEME_MODE_OPTIONS: ThemeModeOption[] = [
  { mode: 'system', label: '跟随系统', icon: 'ri-computer-line' },
  { mode: 'light', label: '浅色模式', icon: 'ri-sun-line' },
  { mode: 'dark', label: '深色模式', icon: 'ri-moon-clear-line' },
]

/**
 * 统一文本归一化，避免 API 返回空值或非字符串导致渲染异常。
 */
function normalizeText(text: unknown): string {
  const normalized = typeof text === 'string' ? text.trim() : String(text ?? '').trim()
  return normalized || DEFAULT_POEM_TEXT
}

/**
 * 生成视频外链；缺少 bvid / aid 时返回 null，交由调用方降级展示。
 */
function resolveVideoUrl(video: BilibiliVideo | null): string | null {
  if (!video) {
    return null
  }
  if (video.bvid) {
    return `https://www.bilibili.com/video/${video.bvid}`
  }
  if (video.aid !== undefined && video.aid !== null) {
    return `https://www.bilibili.com/video/av${video.aid}`
  }
  return null
}

/**
 * 打字机文案。
 * 独立成组件，避免逐字符 setState 时连带重渲染整页卡片与弹层。
 */
function TypewriterText() {
  // 打字机相关状态
  const [typedText, setTypedText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  // 当前文案（完整目标文本）：作为不可见占位撑开高度，避免打字换行导致页面抖动
  const [poemText, setPoemText] = useState<string>(DEFAULT_POEM_TEXT)
  const typingTimerRef = useRef<number | null>(null)

  // 打字动画：逐字符追加显示
  const typeText = useCallback((text: string): void => {
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current)
    }

    const normalized = normalizeText(text)
    // 先同步占位文本，使排版高度在打字开始前即确定
    setPoemText(normalized)
    setTypedText('')

    if (!normalized.length) {
      setIsTyping(false)
      setTypedText(DEFAULT_POEM_TEXT)
      return
    }

    setIsTyping(true)
    let index = 0

    typingTimerRef.current = window.setInterval(() => {
      if (index < normalized.length) {
        const char = normalized.charAt(index)
        setTypedText((prev) => prev + char)
        index += 1
        return
      }

      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current)
        typingTimerRef.current = null
      }

      setIsTyping(false)
    }, 60)
  }, [])

  // 初始加载：立即请求一次并执行打字动画
  useEffect(() => {
    let mounted = true

    const bootstrapPoem = async (): Promise<void> => {
      try {
        const text = await fetchDailyPoemText()
        if (!mounted) {
          return
        }
        typeText(normalizeText(text))
      } catch (error) {
        if (!mounted) {
          return
        }
        console.error('初始化诗词加载失败，使用默认文案:', error)
        typeText(DEFAULT_POEM_TEXT)
      }
    }

    void bootstrapPoem()

    return () => {
      mounted = false
      if (typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current)
      }
    }
  }, [typeText])

  return (
    // 网格重叠：不可见占位（完整文案）与打字文本占据同一格，行数变化不再影响布局高度
    <p className="mt-2 grid min-h-14 content-center text-lg text-gray-500 dark:text-gray-400">
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {poemText}
        {/* 与打字光标等宽，保证临界行宽时占位高度不低于可见内容 */}
        <span className="ml-1 inline-block w-px" />
      </span>
      <span className="col-start-1 row-start-1">
        {typedText}
        {isTyping && <span className="typing-cursor ml-1" />}
      </span>
    </p>
  )
}

interface LatestItemProps {
  href: string | null
  icon: string
  iconClassName: string
  title: string
  label: string
}

/**
 * 「最新动态」条目：有链接时可点击，无数据时降级为静态占位。
 */
function LatestItem({ href, icon, iconClassName, title, label }: LatestItemProps) {
  const body = (
    <>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}>
        <i className={`${icon} text-lg`} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </>
  )

  if (!href) {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-white/50 p-3 dark:bg-white/5">{body}</div>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group/latest flex items-center gap-3 rounded-xl bg-white/50 p-3 transition-colors hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
    >
      {body}
      <i
        className="ri-arrow-right-up-line text-gray-400 opacity-0 transition-opacity group-hover/latest:opacity-100"
        aria-hidden="true"
      />
    </a>
  )
}

/**
 * 首页主组件。
 */
export default function App() {
  // 状态：记录当前哪个卡片被选中了 (null | 'bilibili' | 'blog')
  const [selectedId, setSelectedId] = useState<ModalSelectedId>(null)
  const { mode: themeMode, resolvedMode, setMode: setThemeMode } = useThemeMode()
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false)
  const themeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const themeMenuRef = useRef<HTMLDivElement | null>(null)

  // 数据在首页统一请求：卡片与弹层共用同一份结果，避免重复发起请求。
  const bilibiliData = useBilibiliData()
  const blogFeed = useBlogFeed(5)

  const latestPost = blogFeed.posts[0] ?? null
  const latestVideo = bilibiliData.videos[0] ?? null
  const latestVideoUrl = resolveVideoUrl(latestVideo)
  const followerCount = bilibiliData.userInfo?.followers
  const archiveCount = bilibiliData.userInfo?.archive_count || bilibiliData.total
  const followerText = typeof followerCount === 'number' && followerCount > 0
    ? formatCompactCount(followerCount)
    : '—'
  const archiveText = archiveCount > 0 ? formatCompactCount(archiveCount) : '—'

  // 处理主题菜单交互：点击外部区域或按 Esc 时自动收起菜单。
  useEffect(() => {
    if (!isThemeMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent): void => {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }

      if (themeMenuRef.current?.contains(target) || themeTriggerRef.current?.contains(target)) {
        return
      }

      setIsThemeMenuOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return
      }

      setIsThemeMenuOpen(false)
      themeTriggerRef.current?.focus()
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isThemeMenuOpen])

  const currentThemeIcon = (() => {
    if (themeMode === 'system') {
      return 'ri-computer-line'
    }
    return themeMode === 'dark' ? 'ri-moon-clear-line' : 'ri-sun-line'
  })()

  const resolvedThemeLabel = resolvedMode === 'dark' ? '深色' : '浅色'

  const handleThemeModeChange = useCallback(
    (mode: ThemeMode): void => {
      setThemeMode(mode)
      setIsThemeMenuOpen(false)
    },
    [setThemeMode],
  )

  return (
    // reducedMotion="user"：系统开启「减弱动态效果」时自动关闭 transform / layout 动画，保留透明度过渡。
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-gray-100 px-4 py-12 text-zinc-800 dark:bg-[#0a0a0a] dark:text-gray-100">
        {/* 布局容器：自适应屏幕宽度的大布局 */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:max-w-5xl md:max-w-6xl lg:max-w-7xl md:grid-cols-3 md:auto-rows-[minmax(200px,auto)] lg:auto-rows-[minmax(220px,auto)]">
          {/* 1. 主卡片：个人信息 (占 2x2) */}
          <BentoCard className="md:col-span-2 md:row-span-2" delay={0}>
            <div className="relative h-full flex flex-col">
              <div className="absolute right-0 top-0 z-20">
                <button
                  ref={themeTriggerRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-controls="theme-mode-menu"
                  aria-expanded={isThemeMenuOpen}
                  aria-label="切换颜色模式"
                  onClick={() => {
                    setIsThemeMenuOpen((prev) => !prev)
                  }}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/80 to-white/40 text-gray-500 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gray-300/60 hover:text-zinc-700 hover:shadow-lg hover:shadow-gray-200/50 active:scale-95 dark:border-white/10 dark:from-zinc-800/80 dark:to-zinc-900/60 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-200 dark:hover:shadow-zinc-900/50"
                >
                  <i className={`${currentThemeIcon} text-base`} aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <MotionDiv
                      id="theme-mode-menu"
                      ref={themeMenuRef}
                      role="menu"
                      aria-label="颜色模式"
                      initial={{ opacity: 0, scale: 0.96, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -4, transition: { ...MICRO_INTERACTION_TRANSITION, duration: 0.1 } }}
                      transition={MICRO_INTERACTION_TRANSITION}
                      className="absolute right-0 mt-2 w-44 origin-top-right rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/95 to-white/80 p-1.5 shadow-xl shadow-gray-200/30 backdrop-blur-xl dark:border-white/10 dark:from-zinc-900/95 dark:to-zinc-800/80 dark:shadow-zinc-900/30"
                    >
                      <p className="px-3 py-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
                        当前生效：{resolvedThemeLabel}
                      </p>

                      {THEME_MODE_OPTIONS.map((option) => {
                        const isActive = option.mode === themeMode
                        return (
                          <button
                            key={option.mode}
                            type="button"
                            role="menuitemradio"
                            aria-checked={isActive}
                            onClick={() => {
                              handleThemeModeChange(option.mode)
                            }}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-gray-100/80 active:scale-[0.98] dark:hover:bg-white/10"
                          >
                            <span className="flex items-center gap-2.5">
                              <i className={`${option.icon} text-base`} aria-hidden="true" />
                              <span className="font-medium">{option.label}</span>
                            </span>
                            {isActive ? (
                              <i className="ri-check-line text-sm font-bold text-zinc-600 dark:text-gray-200" aria-hidden="true" />
                            ) : null}
                          </button>
                        )
                      })}
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center text-center">
                <div className="relative">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl">
                    <img src="/psg.jpg" alt="Avatar" className="h-full w-full object-cover" />
                  </div>
                </div>

                <h1 className="mt-6 text-3xl font-bold tracking-tight">Jerry.Z</h1>
                <TypewriterText />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-white/10">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Links / 相关链接
                </h3>
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
                  {SOCIAL_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link flex items-center gap-2 rounded-xl bg-white/50 p-3 transition-colors hover:bg-white dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${link.color}`}>
                        <i className={`${link.icon} text-lg`} aria-hidden="true" />
                      </div>
                      <span className="font-medium text-sm">{link.name}</span>
                      <i
                        className="ri-arrow-right-up-line ml-auto text-gray-400 opacity-0 transition-opacity group-hover/link:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </BentoCard>

          {/* 2. PROJECT卡片：个人项目 (占 1x2) */}
          <BentoCard className="md:col-span-1 md:row-span-2 flex flex-col" delay={CARD_ENTRANCE_STAGGER}>
            <div className="mb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <i className="ri-rocket-line text-3xl text-purple-500" aria-hidden="true" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-center">PROJECT / 个人项目</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
              <div className="flex flex-col gap-3">
                {PROJECTS.map((project) => {
                  const isRectIcon = project.iconShape === 'rect'
                  const iconContainerClassName = isRectIcon
                    ? 'h-10 w-10 rounded-none bg-transparent'
                    : `h-10 w-10 rounded-full ${project.color}`
                  const imageClassName = isRectIcon
                    ? 'h-full w-full object-contain'
                    : 'h-full w-full rounded-full object-cover'

                  return (
                    <a
                      key={project.name}
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/project flex items-center gap-4 p-3 rounded-xl transition-colors hover:bg-white/10 dark:hover:bg-white/5"
                    >
                      <div className={`${iconContainerClassName} flex shrink-0 items-center justify-center overflow-hidden`}>
                        {project.icon && (project.icon.startsWith('http://') || project.icon.startsWith('https://')) ? (
                          <img
                            src={project.icon}
                            alt={`${project.name} icon`}
                            className={imageClassName}
                          />
                        ) : (
                          <i className={`${project.icon} text-xl`} aria-hidden="true" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-zinc-800 dark:text-gray-100 truncate">{project.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {project.description}
                        </p>
                      </div>

                      <i
                        className="ri-arrow-right-up-line project-card-arrow-icon text-gray-400 opacity-0 group-hover/project:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </a>
                  )
                })}
              </div>
            </div>
          </BentoCard>

          {/* 3. 最新动态卡片 (占 3x1)：复用首页已请求的博客 / 视频数据 */}
          <BentoCard className="md:col-span-3 md:row-span-1" delay={CARD_ENTRANCE_STAGGER * 2}>
            <div className="h-full flex flex-col">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Latest / 最新动态
              </h3>

              <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
                <LatestItem
                  href={latestPost?.link || null}
                  icon="ri-article-line"
                  iconClassName="bg-orange-500/15 text-orange-500"
                  title={latestPost?.title || '暂无文章'}
                  label={latestPost ? '最新文章' : 'RSS 暂未返回内容'}
                />
                <LatestItem
                  href={latestVideoUrl}
                  icon="ri-film-line"
                  iconClassName="bg-[#00aeec]/15 text-[#00aeec]"
                  title={latestVideo?.title || '暂无视频'}
                  label={
                    latestVideo?.publish_time
                      ? `最新视频 · ${formatPublishTime(latestVideo.publish_time)}`
                      : '最新视频'
                  }
                />
              </div>
            </div>
          </BentoCard>

          {/* 4. 工具集卡片 (占 3x1, 长条形)：仅在配置了工具时才占位，避免出现整行空白 */}
          {TOOLS.length > 0 && (
            <BentoCard className="md:col-span-3 md:row-span-1" delay={CARD_ENTRANCE_STAGGER * 3}>
              <div className="h-full flex flex-col">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Tools / 工具集</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {TOOLS.map((tool) => (
                    <Link
                      key={tool.name}
                      to={tool.url}
                      className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-colors hover:bg-white/10 dark:hover:bg-white/5"
                    >
                      <div className={`w-10 h-10 rounded-full ${tool.color} flex items-center justify-center`}>
                        <i className={`${tool.icon} text-xl`} aria-hidden="true" />
                      </div>
                      <span className="text-xs font-medium text-center truncate max-w-full">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </BentoCard>
          )}

          {/* 5. Bilibili 卡片 (占 2x1, 可点击) */}
          <BentoCard
            className="md:col-span-2 md:row-span-1 group justify-between bg-[#00aeec]/10 dark:bg-[#00aeec]/20 border-[#00aeec]/20"
            onClick={() => setSelectedId('bilibili')}
            layoutId="card-bilibili"
            rimColor="0, 174, 236"
            delay={CARD_ENTRANCE_STAGGER * 3}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 text-[#00aeec]">
                <i className="ri-bilibili-fill text-3xl" aria-hidden="true" />
                <span className="font-bold text-xl">Bilibili / 哔哩哔哩</span>
              </div>
            </div>
            <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <i className="ri-user-heart-line text-[#00aeec]" aria-hidden="true" />
                粉丝 <span className="font-semibold">{followerText}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <i className="ri-film-line text-[#00aeec]" aria-hidden="true" />
                投稿 <span className="font-semibold">{archiveText}</span>
              </span>
            </div>
          </BentoCard>

          {/* 6. Blog 卡片 (占 1x1, 可点击) */}
          <BentoCard
            className="md:col-span-1 md:row-span-1 group justify-between bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/20"
            onClick={() => setSelectedId('blog')}
            layoutId="card-blog"
            rimColor="255, 115, 0"
            delay={CARD_ENTRANCE_STAGGER * 4}
          >
            <div className="flex items-center gap-2 text-orange-500">
              <i className="ri-article-fill text-2xl" aria-hidden="true" />
              <span className="font-bold text-lg">Blog / 博客</span>
            </div>
            <p className="mt-auto truncate text-xs text-gray-500 dark:text-gray-400">
              {latestPost?.title || '随心随记'}
            </p>
          </BentoCard>
        </div>

        <Modal
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          bilibiliData={bilibiliData}
          blogFeed={blogFeed}
        />

        <footer className="mt-10 pt-6 border-t border-gray-200/50 dark:border-white/10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                By <span className="font-semibold">JerryZ</span> with <span className="align-middle">❤️</span>
              </p>
              <a
                href="https://stats.uptimerobot.com/bYVW2cRJ5T"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-white/50 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-white hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
              >
                <i className="ri-server-line text-gray-500 dark:text-gray-400" aria-hidden="true" />
                网站状态
                <i className="ri-arrow-right-up-line text-gray-400" aria-hidden="true" />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}