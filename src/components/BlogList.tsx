import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import { cardMotionPreset } from './motionPresets'
import type { BlogPost } from '../types/domain'

const MotionDiv = motion.div

/**
 * 文章列表骨架屏。
 */
function BlogListSkeleton() {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <div
        key={`blog-skeleton-${index}`}
        className="relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-4 animate-pulse shadow-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    ))
}

interface BlogItemProps {
  post: BlogPost
}

/**
 * 单个文章条目。
 */
function BlogItem({ post }: BlogItemProps) {
  const handleClick = (): void => {
    if (post.link) {
      window.open(post.link, '_blank')
    }
  }

  return (
    <MotionDiv
      {...cardMotionPreset}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-4 shadow-sm hover:shadow-xl cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <i className="ri-article-line" />
          </div>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-gray-900 dark:text-white hover:text-orange-600"
            onClick={(event) => event.stopPropagation()}
          >
            {post.title || '未命名文章'}
          </a>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.description || '暂无摘要'}
          </p>
        </div>
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <i className="ri-external-link-line" />
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}

interface BlogListProps {
  posts?: BlogPost[]
  loading?: boolean
  error?: string | null
  className?: string
}

/**
 * 博客文章列表组件。
 */
export default function BlogList({
  posts = [],
  loading = false,
  error = null,
  className = '',
}: BlogListProps) {
  if (loading) {
    return <div className={cn('space-y-3', className)}>{BlogListSkeleton()}</div>
  }

  if (error) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="text-4xl mb-4 text-red-500">
          <i className="ri-error-warning-line" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">加载失败</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="text-4xl mb-4 text-gray-400">
          <i className="ri-article-line" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">暂无文章</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">RSS 暂未返回内容</p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {posts.map((post, idx) => (
        <BlogItem key={`${post.link || post.title || idx}-${idx}`} post={post} />
      ))}
    </div>
  )
}
