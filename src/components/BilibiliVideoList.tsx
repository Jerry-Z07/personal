import { motion } from 'framer-motion'
import type { MouseEvent } from 'react'
import { cn } from '../utils/cn'
import { formatPlayCount, formatDuration, formatPublishTime } from '../utils/api'
import { cardMotionPreset } from './motionPresets'
import type { BilibiliVideo } from '../types/domain'

const MotionDiv = motion.div
const MotionButton = motion.button

interface VideoCardProps {
  video: BilibiliVideo
  onClick?: (video: BilibiliVideo) => void
}

/**
 * 单个视频卡片组件。
 */
function VideoCard({ video, onClick }: VideoCardProps) {
  if (!video) {
    return null
  }

  const handleClick = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault()
    if (video.bvid) {
      window.open(`https://www.bilibili.com/video/${video.bvid}`, '_blank')
      return
    }

    if (onClick) {
      onClick(video)
    }
  }

  return (
    <MotionDiv
      {...cardMotionPreset}
      className="relative overflow-hidden rounded-2xl flex flex-col h-full cursor-pointer bg-white/60 dark:bg-zinc-900/60 border border-gray-200/50 dark:border-white/10 shadow-sm hover:shadow-xl backdrop-blur-md ring-1 ring-transparent hover:ring-[#00aeec]/30 transition-all duration-300"
      onClick={handleClick}
    >
      {/* 顶部品牌高光 */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00aeec]/40 to-transparent" />

      <div className="relative">
        <img
          src={video.cover}
          alt={video.title || '视频封面'}
          className="w-full aspect-video object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md backdrop-blur-sm">
          {formatDuration(video.duration || 0)}
        </div>

        <MotionDiv
          className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/10">
            <i className="ri-play-fill text-black" />
          </div>
        </MotionDiv>
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2 flex-1">
          {video.title || '无标题'}
        </h3>

        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 space-x-4">
          <span className="flex items-center">
            <i className="ri-play-circle-line text-[#00aeec] mr-1" />
            {formatPlayCount(video.play_count || 0)}
          </span>
          <span className="flex items-center">
            <i className="ri-calendar-line text-[#00aeec] mr-1" />
            {video.publish_time ? formatPublishTime(video.publish_time) : '未知时间'}
          </span>
        </div>
      </div>
    </MotionDiv>
  )
}

/**
 * 视频列表骨架屏组件。
 */
function VideoListSkeleton() {
  return Array(4)
    .fill(0)
    .map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="bg-white/60 dark:bg-zinc-900/60 rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 dark:border-white/10 animate-pulse flex flex-col h-full backdrop-blur-md"
      >
        <div className="w-full aspect-video bg-gray-200/50 dark:bg-white/10" />
        <div className="p-3 flex-1">
          <div className="h-4 bg-gray-200/60 dark:bg-white/10 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200/60 dark:bg-white/10 rounded w-3/4" />
          <div className="flex space-x-4 mt-3">
            <div className="h-3 bg-gray-200/60 dark:bg-white/10 rounded w-16" />
            <div className="h-3 bg-gray-200/60 dark:bg-white/10 rounded w-20" />
          </div>
        </div>
      </div>
    ))
}

interface BilibiliVideoListProps {
  videos?: BilibiliVideo[]
  loading?: boolean
  error?: string | null
  onVideoClick?: (video: BilibiliVideo) => void
  className?: string
}

/**
 * 根据视频对象生成稳定 key，避免 render 期不纯函数。
 */
function getVideoKey(video: BilibiliVideo, index: number): string {
  if (video.aid !== undefined && video.aid !== null) {
    return String(video.aid)
  }
  if (video.bvid) {
    return video.bvid
  }
  return `video-${index}`
}

/**
 * B站视频列表组件。
 */
export default function BilibiliVideoList({
  videos = [],
  loading = false,
  error = null,
  onVideoClick,
  className = '',
}: BilibiliVideoListProps) {
  if (loading) {
    return <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4', className)}>{VideoListSkeleton()}</div>
  }

  if (error) {
    return (
      <div
        className={cn(
          'p-8 text-center rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md',
          className,
        )}
      >
        <div className="text-4xl mb-4 text-[#00aeec]">
          <i className="ri-error-warning-line" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">加载失败</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{error}</p>
        <MotionButton
          className="px-4 py-2 bg-[#00aeec] text-white rounded-full hover:bg-[#00aeec]/90 shadow-sm"
          whileTap={{ scale: 0.95 }}
        >
          重试
        </MotionButton>
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div
        className={cn(
          'p-8 text-center rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md',
          className,
        )}
      >
        <div className="text-4xl mb-4 text-[#00aeec]">
          <i className="ri-film-line" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">暂无视频</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">该用户还没有上传视频</p>
      </div>
    )
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4', className)}>
      {videos.map((video, index) => (
        <div key={getVideoKey(video, index)}>
          <VideoCard
            video={video}
            onClick={(currentVideo) => {
              if (onVideoClick) {
                onVideoClick(currentVideo)
              }
            }}
          />
        </div>
      ))}
    </div>
  )
}
