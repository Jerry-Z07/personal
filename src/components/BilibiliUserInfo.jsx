import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { cn } from './BentoCard';

/**
 * B站用户信息组件
 * 用于在弹窗中显示B站用户信息条
 */
const BilibiliUserInfo = ({ userInfo, loading, className }) => {
  // 加载中的骨架屏状态
  const Skeleton = () => (
    <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
      <div className="flex-1">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  );

  // 如果正在加载，显示骨架屏
  if (loading) {
    return <Skeleton />;
  }

  // 如果没有用户信息，显示默认信息
  if (!userInfo) {
    return (
      <div className="flex items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">未加载到用户信息</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">点击刷新重试</p>
        </div>
      </div>
    );
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-center p-4 bg-gradient-to-r from-[#66CCFF] to-[#D3D3D3] dark:from-[#4A90A4] dark:to-[#8A9A9A] rounded-lg border border-[#66CCFF]/30 dark:border-[#4A90A4]/50',
        className
      )}
    >
      {/* 用户基本信息 */}
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mr-2">
            {userInfo.name || '未知用户'}
          </h3>
        </div>
        <div className="flex items-center mt-1">
          {/* 性别显示 */}
          {/* 关注数、粉丝数和视频数 */}
          <div className="flex items-center space-x-2">
            {/* 关注数（如果有） */}
            {userInfo.following !== undefined && (
              <span className="text-xs text-gray-800 dark:text-gray-200">
                <i className="ri-user-add-line mr-1"></i>
                关注 {userInfo.following}
              </span>
            )}
            
            {/* 粉丝数 */}
            {userInfo.followers !== undefined && (
              <span className="text-xs text-gray-800 dark:text-gray-200">
                <i className="ri-user-follow-line mr-1"></i>
                粉丝 {userInfo.followers}
              </span>
            )}
            
            {/* 视频数 */}
            {userInfo.archive_count !== undefined && (
              <span className="text-xs text-gray-800 dark:text-gray-200">
                <i className="ri-film-line mr-1"></i>
                视频 {userInfo.archive_count}
              </span>
            )}
          </div>
        </div>
        {/* 用户简介 */}
        {userInfo.sign && (
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-1">
            {userInfo.sign}
          </p>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <motion.button
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 flex items-center"
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // 跳转到B站个人空间，格式为：https://space.bilibili.com/401175768
            window.open(`https://space.bilibili.com/${userInfo.mid || '401175768'}`, '_blank');
          }}
        >
          <i className="ri-home-2-line mr-1.5"></i>主页
        </motion.button>
      </div>
    </motion.div>
  );
};

// 组件属性类型定义
BilibiliUserInfo.propTypes = {
  userInfo: PropTypes.shape({
    face: PropTypes.string,
    name: PropTypes.string,
    level: PropTypes.number,
    sex: PropTypes.string,
    sign: PropTypes.string,
    vip: PropTypes.bool,
    following: PropTypes.number,
    followers: PropTypes.number
  }),
  loading: PropTypes.bool,
  className: PropTypes.string
};

// 默认属性
BilibiliUserInfo.defaultProps = {
  loading: false,
  className: ''
};

export default BilibiliUserInfo;