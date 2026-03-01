import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'

const THEME_MODE_STORAGE_KEY = 'personal-theme-mode'
const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export type ThemeMode = 'system' | 'light' | 'dark'
type ResolvedThemeMode = 'light' | 'dark'

/**
 * 判断字符串是否是受支持的主题模式。
 */
function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'system' || value === 'light' || value === 'dark'
}

/**
 * 获取系统当前的深浅色偏好。
 */
function getSystemThemeMode(): ResolvedThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? 'dark' : 'light'
}

/**
 * 订阅系统主题变化，用于 useSyncExternalStore。
 */
function subscribeSystemTheme(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    console.error('当前环境不支持 matchMedia，无法监听系统主题变化')
    return () => {}
  }

  const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY)
  const handleMediaChange = (): void => {
    onStoreChange()
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleMediaChange)
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    }
  }

  mediaQuery.addListener(handleMediaChange)
  return () => {
    mediaQuery.removeListener(handleMediaChange)
  }
}

/**
 * 从本地存储读取主题模式，读失败时兜底为 system。
 */
function readStoredThemeMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'system'
  }

  try {
    const storedMode = window.localStorage.getItem(THEME_MODE_STORAGE_KEY)
    if (isThemeMode(storedMode)) {
      return storedMode
    }

    if (storedMode !== null) {
      console.error('读取主题模式失败，发现不受支持的值，已回退为跟随系统:', storedMode)
    }
  } catch (error) {
    console.error('读取主题模式失败，已回退为跟随系统:', error)
  }

  return 'system'
}

/**
 * 将解析后的主题同步到 html 标签，供 Tailwind dark: 与运行时逻辑共同使用。
 */
function applyResolvedTheme(mode: ResolvedThemeMode): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.classList.toggle('dark', mode === 'dark')
  root.style.colorScheme = mode
}

/**
 * 主题模式管理 Hook。
 * - 支持 light / dark / system 三种模式
 * - 支持 localStorage 持久化
 * - 在 system 模式下监听系统主题变化
 */
export function useThemeMode(): {
  mode: ThemeMode
  resolvedMode: ResolvedThemeMode
  setMode: (mode: ThemeMode) => void
} {
  const [mode, setMode] = useState<ThemeMode>(() => readStoredThemeMode())
  const systemMode = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeMode,
    (): ResolvedThemeMode => 'light',
  )

  const resolvedMode = useMemo<ResolvedThemeMode>(() => {
    return mode === 'system' ? systemMode : mode
  }, [mode, systemMode])

  // 将最终主题应用到 DOM。
  useEffect(() => {
    applyResolvedTheme(resolvedMode)
  }, [resolvedMode])

  // 持久化用户选择，失败时保留运行态并记录日志。
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(THEME_MODE_STORAGE_KEY, mode)
    } catch (error) {
      console.error('写入主题模式失败，本次会话将仅保留内存状态:', error)
    }
  }, [mode])

  return { mode, resolvedMode, setMode }
}
