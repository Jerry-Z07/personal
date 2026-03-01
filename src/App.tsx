import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import BentoCard from './components/BentoCard'
import Modal from './components/Modal'
import { useThemeMode, type ThemeMode } from './hooks/useThemeMode'
import { fetchDailyPoemText } from './utils/api'
import type { ModalSelectedId } from './types/domain'

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

// 链接数据
const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    icon: 'ri-github-fill',
    url: 'https://github.com/Jerry-Z07',
    color: 'bg-gray-800 text-white',
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
 * 首页主组件。
 */
export default function App() {
  // 状态：记录当前哪个卡片被选中了 (null | 'bilibili' | 'blog')
  const [selectedId, setSelectedId] = useState<ModalSelectedId>(null)
  const { mode: themeMode, resolvedMode, setMode: setThemeMode } = useThemeMode()
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false)
  const themeTriggerRef = useRef<HTMLButtonElement | null>(null)
  const themeMenuRef = useRef<HTMLDivElement | null>(null)

  // 打字机相关状态
  const [typedText, setTypedText] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const typingTimerRef = useRef<number | null>(null)
  const deletingTimerRef = useRef<number | null>(null)
  const refreshTimerRef = useRef<number | null>(null)

  // 使用 ref 保存最新刷新函数，避免定时器闭包引用过期函数。
  const refreshCallbackRef = useRef<() => Promise<void>>(async () => {})

  // 删除动画：逐字符从末尾删除
  const deleteText = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (deletingTimerRef.current) {
        window.clearInterval(deletingTimerRef.current)
      }

      let current = ''
      setTypedText((prev) => {
        current = prev
        return prev
      })

      if (!current.length) {
        resolve()
        return
      }

      deletingTimerRef.current = window.setInterval(() => {
        current = current.slice(0, -1)
        setTypedText(current)

        if (!current.length) {
          if (deletingTimerRef.current) {
            window.clearInterval(deletingTimerRef.current)
            deletingTimerRef.current = null
          }
          resolve()
        }
      }, 40)
    })
  }, [])

  // 打字动画：逐字符追加显示
  const typeText = useCallback((text: string): void => {
    if (typingTimerRef.current) {
      window.clearInterval(typingTimerRef.current)
    }

    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    const normalized = normalizeText(text)
    setTypedText('')

    if (!normalized.length) {
      setIsTyping(false)
      setTypedText(DEFAULT_POEM_TEXT)
      refreshTimerRef.current = window.setTimeout(() => {
        void refreshCallbackRef.current()
      }, 15000)
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
      refreshTimerRef.current = window.setTimeout(() => {
        void refreshCallbackRef.current()
      }, 15000)
    }, 60)
  }, [])

  // 删除后请求新文本并执行打字动画
  const startDeletionThenRefresh = useCallback(async (): Promise<void> => {
    if (refreshTimerRef.current) {
      window.clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    await deleteText()

    try {
      const text = await fetchDailyPoemText()
      typeText(normalizeText(text))
    } catch (error) {
      // 失败回退为默认文案，同时输出错误日志。
      console.error('刷新诗词失败，使用默认文案:', error)
      typeText(DEFAULT_POEM_TEXT)
    }
  }, [deleteText, typeText])

  useEffect(() => {
    refreshCallbackRef.current = startDeletionThenRefresh
  }, [startDeletionThenRefresh])

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
      if (deletingTimerRef.current) {
        window.clearInterval(deletingTimerRef.current)
      }
      if (refreshTimerRef.current) {
        window.clearTimeout(refreshTimerRef.current)
      }
    }
  }, [typeText])

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
    <div className="min-h-screen bg-gray-100 px-4 py-12 text-zinc-800 dark:bg-[#0a0a0a] dark:text-gray-100">
      {/* 布局容器：自适应屏幕宽度的大布局 */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:max-w-5xl md:max-w-6xl lg:max-w-7xl md:grid-cols-3 md:auto-rows-[220px] lg:auto-rows-[240px]">
        {/* 1. 主卡片：个人信息 (占 2x2) */}
        <BentoCard className="md:col-span-2 md:row-span-2" delay={0.1}>
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

              {isThemeMenuOpen && (
                <div
                  id="theme-mode-menu"
                  ref={themeMenuRef}
                  role="menu"
                  aria-label="颜色模式"
                  className="absolute right-0 mt-2 w-44 origin-top-right animate-in fade-in-0 zoom-in-95 rounded-2xl border border-gray-200/50 bg-gradient-to-br from-white/95 to-white/80 p-1.5 shadow-xl shadow-gray-200/30 backdrop-blur-xl duration-200 dark:border-white/10 dark:from-zinc-900/95 dark:to-zinc-800/80 dark:shadow-zinc-900/30"
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
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl">
                  <img src="/psg.jpg" alt="Avatar" className="h-full w-full object-cover" />
                </div>
              </div>

              <h1 className="mt-6 text-3xl font-bold tracking-tight">Jerry.Z</h1>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <span>{typedText}</span>
                {isTyping && <span className="typing-cursor ml-1" />}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-white/10">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
                Links / 相关链接
              </h3>
              <div className={`grid gap-3 ${SOCIAL_LINKS.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-xl bg-white/50 p-3 transition-all hover:bg-white hover:scale-105 hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${link.color}`}>
                      <i className={`${link.icon} text-lg`} />
                    </div>
                    <span className="font-medium text-sm">{link.name}</span>
                    <i className="ri-arrow-right-up-line ml-auto text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 2. PROJECT卡片：个人项目 (占 1x2) */}
        <BentoCard className="md:col-span-1 md:row-span-2 flex flex-col" delay={0.2}>
          <div className="mb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <i className="ri-rocket-line text-3xl text-purple-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">PROJECT / 个人项目</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
            <div className="flex flex-col gap-3">
              {PROJECTS.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${project.color} flex items-center justify-center overflow-hidden`}
                  >
                    {project.icon && (project.icon.startsWith('http://') || project.icon.startsWith('https://')) ? (
                      <img
                        src={project.icon}
                        alt={`${project.name} icon`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <i className={`${project.icon} text-xl`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-zinc-800 dark:text-gray-100 truncate">{project.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <i
                    className="ri-arrow-right-up-line project-card-arrow-icon text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* 3. 工具集卡片 (占 3x1, 长条形) */}
        <BentoCard className="md:col-span-3 md:row-span-1" delay={0.3}>
          <div className="h-full flex flex-col">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Tools / 工具集</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.name}
                  to={tool.url}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5"
                >
                  <div className={`w-10 h-10 rounded-full ${tool.color} flex items-center justify-center`}>
                    <i className={`${tool.icon} text-xl`} />
                  </div>
                  <span className="text-xs font-medium text-center truncate max-w-full">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* 4. Bilibili 卡片 (占 2x1, 可点击) */}
        <BentoCard
          className="md:col-span-2 md:row-span-1 group justify-between bg-[#00aeec]/10 dark:bg-[#00aeec]/20 border-[#00aeec]/20"
          onClick={() => setSelectedId('bilibili')}
          layoutId="card-bilibili"
          spotlightColor="0, 174, 236"
          delay={0.4}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-[#00aeec]">
              <i className="ri-bilibili-fill text-3xl" />
              <span className="font-bold text-xl">Bilibili / 哔哩哔哩</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-auto">我的B站账号</p>
        </BentoCard>

        {/* 5. Blog 卡片 (占 1x1, 可点击) */}
        <BentoCard
          className="md:col-span-1 md:row-span-1 group justify-between bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/20"
          onClick={() => setSelectedId('blog')}
          layoutId="card-blog"
          spotlightColor="255, 115, 0"
          delay={0.5}
        >
          <div className="flex items-center gap-2 text-orange-500">
            <i className="ri-article-fill text-2xl" />
            <span className="font-bold text-lg">Blog / 博客</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">随心随记</p>
        </BentoCard>
      </div>

      <Modal selectedId={selectedId} setSelectedId={setSelectedId} />

      <footer className="mt-10 pt-6 border-t border-gray-200/50 dark:border-white/10">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              By <span className="font-semibold">JerryZ</span> with <span className="align-middle">❤️</span>
            </p>
            <a
              href="https://uptime.078465.xyz/status/default"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white/50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
            >
              <i className="ri-server-line text-gray-500 dark:text-gray-400" />
              网站状态
              <i className="ri-arrow-right-up-line text-gray-400" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
