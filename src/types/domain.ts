/**
 * 领域模型：B 站用户信息
 */
export interface BilibiliUserInfo {
  mid?: string | number
  face?: string
  name?: string
  level?: number
  sex?: string
  sign?: string
  vip?: boolean
  following?: number
  followers?: number
  archive_count?: number
  follower?: number
  videos?: number
}

/**
 * 领域模型：B 站视频信息
 */
export interface BilibiliVideo {
  aid?: string | number
  bvid?: string
  title?: string
  cover?: string
  duration?: number
  play_count?: number
  publish_time?: number
}

/**
 * 领域模型：博客文章
 */
export interface BlogPost {
  title: string
  link: string
  description: string
}

/**
 * 领域模型：通用 API 包装结构
 */
export interface ApiEnvelope<T> {
  code?: number
  data?: T
}

/**
 * 领域模型：B 站视频列表响应
 */
export interface BilibiliArchivesResponse {
  videos: BilibiliVideo[]
  total?: number
  size?: number
  page?: number
}

/**
 * 领域模型：弹窗选择状态
 */
export type ModalSelectedId = 'bilibili' | 'blog' | null
