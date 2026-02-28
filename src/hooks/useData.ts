import { useCallback, useEffect, useState } from 'react'
import {
  fetchBilibiliUserInfo,
  fetchBilibiliArchives,
  fetchBlogFeed,
} from '../utils/api'
import type {
  ApiEnvelope,
  BilibiliArchivesResponse,
  BilibiliUserInfo,
  BilibiliVideo,
  BlogPost,
} from '../types/domain'

/**
 * 运行时判断：是否为普通对象。
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * 将未知错误提取为可展示消息。
 */
function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return '发生未知错误'
}

/**
 * 安全提取数字。
 */
function toNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

/**
 * 标准化 B 站用户信息。
 */
function normalizeUserInfo(data: Partial<BilibiliUserInfo> | null): BilibiliUserInfo | null {
  if (!data) {
    return null
  }

  const followers =
    toNumber(data.followers, Number.NaN) || toNumber(data.follower, Number.NaN) || 0

  const archiveCount =
    toNumber(data.archive_count, Number.NaN) || toNumber(data.videos, Number.NaN) || 0

  return {
    ...data,
    followers,
    archive_count: archiveCount,
  }
}

/**
 * 从不确定响应中提取用户信息。
 */
function extractUserInfo(data: unknown): BilibiliUserInfo | null {
  if (!isRecord(data)) {
    return null
  }

  const envelope = data as ApiEnvelope<Partial<BilibiliUserInfo>>
  if (isRecord(envelope.data)) {
    return normalizeUserInfo(envelope.data)
  }

  return normalizeUserInfo(data as Partial<BilibiliUserInfo>)
}

/**
 * 从不确定响应中提取视频列表信息。
 */
function extractVideos(data: unknown): { videos: BilibiliVideo[]; total: number; page: number } {
  if (Array.isArray(data)) {
    const videos = data.filter(isRecord) as BilibiliVideo[]
    return {
      videos,
      total: videos.length,
      page: 1,
    }
  }

  if (isRecord(data)) {
    const archives = data as Partial<BilibiliArchivesResponse>
    const videos = Array.isArray(archives.videos)
      ? (archives.videos.filter(isRecord) as BilibiliVideo[])
      : []

    return {
      videos,
      total: toNumber(archives.total, Number.NaN) || toNumber(archives.size, 0),
      page: toNumber(archives.page, 1),
    }
  }

  return {
    videos: [],
    total: 0,
    page: 1,
  }
}

/**
 * 获取 B 站用户信息的 Hook。
 */
export function useBilibiliUserInfo(): {
  userInfo: BilibiliUserInfo | null
  loading: boolean
  error: string | null
  refreshUserInfo: () => Promise<void>
} {
  const [userInfo, setUserInfo] = useState<BilibiliUserInfo | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const loadUserInfo = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchBilibiliUserInfo()
      const normalized = extractUserInfo(data)
      setUserInfo(normalized)
    } catch (err) {
      const errorMessage = toErrorMessage(err)
      setError(errorMessage)
      console.error('加载用户信息失败:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadUserInfo()
  }, [loadUserInfo])

  return {
    userInfo,
    loading,
    error,
    refreshUserInfo: loadUserInfo,
  }
}

/**
 * 获取 B 站视频列表的 Hook。
 */
export function useBilibiliArchives(
  { ps = 8, orderby = 'pubdate' }: { ps?: number; orderby?: string } = {},
): {
  videos: BilibiliVideo[]
  loading: boolean
  error: string | null
  total: number
  page: number
  refreshVideos: () => Promise<void>
  changeOrderBy: (newOrderBy: string) => void
} {
  const [videos, setVideos] = useState<BilibiliVideo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [page, setPage] = useState<number>(1)

  const loadVideos = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchBilibiliArchives(ps, orderby)
      const normalized = extractVideos(data)
      setVideos(normalized.videos)
      setTotal(normalized.total)
      setPage(normalized.page)
    } catch (err) {
      const errorMessage = toErrorMessage(err)
      setError(errorMessage)
      console.error('加载视频列表失败:', err)
    } finally {
      setLoading(false)
    }
  }, [ps, orderby])

  useEffect(() => {
    void loadVideos()
  }, [loadVideos])

  const changeOrderBy = useCallback(
    (newOrderBy: string): void => {
      if (newOrderBy !== orderby) {
        // 该 Hook 的排序参数由调用方传入，提醒调用方通过参数变更触发刷新。
        console.info('请通过更新 useBilibiliArchives 的 orderby 参数来切换排序', {
          from: orderby,
          to: newOrderBy,
        })
      }
    },
    [orderby],
  )

  return {
    videos,
    loading,
    error,
    total,
    page,
    refreshVideos: loadVideos,
    changeOrderBy,
  }
}

/**
 * 组合获取 B 站用户信息和视频列表的 Hook。
 */
export function useBilibiliData(): {
  userInfo: BilibiliUserInfo | null
  videos: BilibiliVideo[]
  total: number
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  refreshUserInfo: () => Promise<void>
  refreshVideos: () => Promise<void>
  changeOrderBy: (newOrderBy: string) => void
} {
  const userInfoHook = useBilibiliUserInfo()
  const videosHook = useBilibiliArchives()

  const refreshAll = useCallback(async (): Promise<void> => {
    await Promise.all([userInfoHook.refreshUserInfo(), videosHook.refreshVideos()])
  }, [userInfoHook, videosHook])

  return {
    userInfo: userInfoHook.userInfo,
    videos: videosHook.videos,
    total: videosHook.total,
    loading: userInfoHook.loading || videosHook.loading,
    error: userInfoHook.error || videosHook.error,
    refresh: refreshAll,
    refreshUserInfo: userInfoHook.refreshUserInfo,
    refreshVideos: videosHook.refreshVideos,
    changeOrderBy: videosHook.changeOrderBy,
  }
}

/**
 * 获取博客 RSS 列表的 Hook（默认只返回前 limit 条）。
 */
export function useBlogFeed(limit = 5): {
  posts: BlogPost[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
} {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      const items = await fetchBlogFeed()
      setPosts(Array.isArray(items) ? items.slice(0, limit) : [])
    } catch (err) {
      const errorMessage = toErrorMessage(err)
      setError(errorMessage)
      setPosts([])
      console.error('加载博客列表失败:', err)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    void load()
  }, [load])

  const refresh = useCallback(async (): Promise<void> => {
    await load()
  }, [load])

  return {
    posts,
    loading,
    error,
    refresh,
  }
}
