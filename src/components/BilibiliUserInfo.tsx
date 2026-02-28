import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import type { BilibiliUserInfo as BilibiliUserInfoType } from '../types/domain'

const MotionDiv = motion.div
const MotionButton = motion.button

interface BilibiliUserInfoProps {
  userInfo: BilibiliUserInfoType | null
  loading?: boolean
  className?: string
}

/**
 * 用户信息骨架屏。
 */
function BilibiliUserInfoSkeleton() {
  return (
    <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

/**
 * B站用户信息组件，用于在弹窗中显示用户信息条。
 */
export default function BilibiliUserInfo({
  userInfo,
  loading = false,
  className = '',
}: BilibiliUserInfoProps) {
  if (loading) {
    return <BilibiliUserInfoSkeleton />
  }

  if (!userInfo) {
    return (
      <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">未加载到用户信息</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">点击刷新重试</p>
        </div>
      </div>
    )
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center p-4 bg-gradient-to-r from-[#66CCFF] to-[#D3D3D3] dark:from-[#4A90A4] dark:to-[#8A9A9A] rounded-lg border border-[#66CCFF]/30 dark:border-[#4A90A4]/50',
        className,
      )}
    >
      {/* 用户基本信息 */}
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mr-2">{userInfo.name || '未知用户'}</h3>
        </div>

        <div className="flex items-center mt-1">
          <div className="flex items-center space-x-2">
            {userInfo.following !== undefined && (
              <span className="text-xs text-gray-800 dark:text-gray-200">
                <i className="ri-user-add-line mr-1" />
                关注 {userInfo.following}
              </span>
            )}

            {userInfo.followers !== undefined && (
              <span className="text-xs text-gray-800 dark:text-gray-200">
                <i className="ri-user-follow-line mr-1" />
                粉丝 {userInfo.followers}
              </span>
            )}

            {userInfo.archive_count !== undefined && (
              <span className="text-xs text-gray-800 dark:text-gray-200">
                <i className="ri-film-line mr-1" />
                视频 {userInfo.archive_count}
              </span>
            )}
          </div>
        </div>

        {userInfo.sign && (
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-1">{userInfo.sign}</p>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <MotionButton
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 flex items-center"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            window.open(`https://space.bilibili.com/${userInfo.mid || '401175768'}`, '_blank')
          }}
        >
          <i className="ri-home-2-line mr-1.5" />主页
        </MotionButton>
      </div>
    </MotionDiv>
  )
}
