import type {
  ApiEnvelope,
  BilibiliArchivesResponse,
  BilibiliUserInfo,
  BilibiliVideo,
  BlogPost,
} from '../types/domain'

// B站数据API工具函数

// B站用户信息API基础URL
const BILIBILI_USERINFO_API = 'https://uapis.cn/api/v1/social/bilibili/userinfo'

// B站视频列表API基础URL
const BILIBILI_ARCHIVES_API = 'https://uapis.cn/api/v1/social/bilibili/archives'

// 博客 RSS 地址
const BLOG_RSS_URL = 'https://blog.078465.xyz/feed/'

// CORS 代理地址
const CORS_PROXY = 'https://cors1.078465.xyz/v1/proxy/?quest='

// 用户 UID
const USER_UID = '401175768'

/**
 * 将未知错误统一转换为 Error，避免丢失可读信息。
 */
function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error(String(error ?? '未知错误'))
}

/**
 * 运行时判断：是否为普通对象。
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * 通过直连或代理请求目标地址。
 */
async function requestByEnv(targetUrl: string, accept: string): Promise<Response> {
  const requestUrl = import.meta.env.PROD
    ? `${CORS_PROXY}${encodeURIComponent(targetUrl)}`
    : targetUrl

  return fetch(requestUrl, {
    headers: {
      Accept: accept,
    },
  })
}

/**
 * 强制使用代理请求目标地址。
 */
async function requestByProxy(targetUrl: string, accept: string): Promise<Response> {
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`
  return fetch(proxyUrl, {
    headers: {
      Accept: accept,
    },
  })
}

/**
 * 获取 B 站用户信息。
 */
export async function fetchBilibiliUserInfo(): Promise<ApiEnvelope<BilibiliUserInfo> | BilibiliUserInfo> {
  try {
    const apiUrl = `${BILIBILI_USERINFO_API}?uid=${USER_UID}`
    const response = await requestByEnv(apiUrl, 'application/json, */*')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: unknown = await response.json()
    if (!isRecord(data)) {
      throw new Error('B站用户信息响应格式异常')
    }

    return data as ApiEnvelope<BilibiliUserInfo> | BilibiliUserInfo
  } catch (error) {
    const normalizedError = toError(error)
    console.error('获取B站用户信息失败:', normalizedError)
    throw normalizedError
  }
}

/**
 * 获取 B 站视频列表。
 */
export async function fetchBilibiliArchives(
  ps = 8,
  orderby = 'pubdate',
): Promise<BilibiliArchivesResponse | BilibiliVideo[]> {
  try {
    const apiUrl = `${BILIBILI_ARCHIVES_API}?ps=${ps}&mid=${USER_UID}&orderby=${orderby}`
    const response = await requestByEnv(apiUrl, 'application/json, */*')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: unknown = await response.json()
    if (!isRecord(data) && !Array.isArray(data)) {
      throw new Error('B站视频列表响应格式异常')
    }

    return data as BilibiliArchivesResponse | BilibiliVideo[]
  } catch (error) {
    const normalizedError = toError(error)
    console.error('获取B站视频列表失败:', normalizedError)
    throw normalizedError
  }
}

/**
 * 格式化播放量数字。
 */
export function formatPlayCount(count: number): string {
  const safeCount = Number.isFinite(count) ? count : 0
  if (safeCount >= 10000) {
    return `${(safeCount / 10000).toFixed(1)}万`
  }
  return String(Math.max(0, Math.floor(safeCount)))
}

/**
 * 格式化时长（秒 -> mm:ss）。
 */
export function formatDuration(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const minutes = Math.floor(safeSeconds / 60)
  const remainingSeconds = safeSeconds % 60
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
}

/**
 * 格式化发布时间。
 * 约定入参为 Unix 秒级时间戳。
 */
export function formatPublishTime(timestamp: number): string {
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return '未知时间'
  }

  const now = Date.now()
  const diff = now - timestamp * 1000
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))

  if (days === 0) {
    return '今天'
  }
  if (days === 1) {
    return '昨天'
  }
  if (days < 7) {
    return `${days}天前`
  }

  const date = new Date(timestamp * 1000)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

/**
 * 获取今日诗词纯文本（通过 CORS 代理）。
 */
export async function fetchDailyPoemText(): Promise<string> {
  try {
    const targetUrl = 'https://v1.jinrishici.com/all.txt'
    const response = await requestByProxy(targetUrl, 'text/plain, */*')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    return text.trim()
  } catch (error) {
    const normalizedError = toError(error)
    console.error('获取今日诗词失败:', normalizedError)
    throw normalizedError
  }
}

/**
 * 获取博客 RSS 并解析为文章列表。
 */
export async function fetchBlogFeed(): Promise<BlogPost[]> {
  try {
    const response = await requestByProxy(BLOG_RSS_URL, 'application/rss+xml, application/xml, text/xml, */*')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlText = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'application/xml')

    // 解析失败时，浏览器通常会插入 parsererror 节点。
    if (doc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('博客 RSS XML 解析失败')
    }

    const itemNodes = Array.from(doc.getElementsByTagName('item'))
    let items: BlogPost[] = itemNodes.map((node) => {
      const title = node.getElementsByTagName('title')[0]?.textContent?.trim() || ''
      const link = node.getElementsByTagName('link')[0]?.textContent?.trim() || ''
      const description = node.getElementsByTagName('description')[0]?.textContent?.trim() || ''
      return { title, link, description }
    })

    if (!items.length) {
      const entryNodes = Array.from(doc.getElementsByTagName('entry'))
      items = entryNodes.map((node) => {
        const title = node.getElementsByTagName('title')[0]?.textContent?.trim() || ''
        const linkElement = node.getElementsByTagName('link')[0]
        const link = linkElement?.getAttribute('href')?.trim() || ''
        const description =
          node.getElementsByTagName('summary')[0]?.textContent?.trim() ||
          node.getElementsByTagName('content')[0]?.textContent?.trim() ||
          ''

        return { title, link, description }
      })
    }

    return items
  } catch (error) {
    const normalizedError = toError(error)
    console.error('获取博客RSS失败:', normalizedError)
    throw normalizedError
  }
}
