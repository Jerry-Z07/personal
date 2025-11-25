import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { cn } from './BentoCard';
import { formatPlayCount, formatDuration, formatPublishTime } from '../utils/api';

/**
 * 单个视频卡片组件
 */
const VideoCard = ({ video, onClick }) => {
  if (!video) return null;

  // 处理视频点击事件，跳转到B站视频页面
  const handleClick = (e) => {
    e.preventDefault();
    // 优先使用bvid构建链接，格式为：https://www.bilibili.com/video/BVxxx
    if (video.bvid) {
      window.open(`https://www.bilibili.com/video/${video.bvid}`, '_blank');
    } else if (onClick) {
      onClick(video);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={handleClick}
    >
      {/* 视频封面和时长 */}
      <div className="relative">
        <img
          src={video.cover}
          alt={video.title || '视频封面'}
          className="w-full aspect-video object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* 时长标签 */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
          {formatDuration(video.duration || 0)}
        </div>
        {/* 播放按钮覆盖层 */}
        <motion.div
          className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <i className="ri-play-fill text-black"></i>
          </div>
        </motion.div>
      </div>

      {/* 视频信息 */}
      <div className="p-3 flex-1 flex flex-col">
        {/* 视频标题 */}
        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 flex-1">
          {video.title || '无标题'}
        </h3>

        {/* 视频统计信息 */}
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
          <span className="flex items-center">
            <i className="ri-play-circle-line mr-1"></i>
            {formatPlayCount(video.play_count || 0)}
          </span>
          <span className="flex items-center">
            <i className="ri-calendar-line mr-1"></i>
            {video.publish_time ? formatPublishTime(video.publish_time) : '未知时间'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

VideoCard.propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string,
    cover: PropTypes.string,
    duration: PropTypes.number,
    play_count: PropTypes.number,
    publish_time: PropTypes.number,
    bvid: PropTypes.string,
    aid: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func
};

VideoCard.defaultProps = {
  onClick: null
};

/**
 * 视频列表骨架屏组件
 */
const VideoListSkeleton = () => {
  return Array(4).fill(0).map((_, index) => (
    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md animate-pulse flex flex-col h-full">
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700"></div>
      <div className="p-3 flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        <div className="flex space-x-3 mt-3">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  ));
};

/**
 * B站视频列表组件
 * 用于在弹窗中展示B站视频列表
 */
const BilibiliVideoList = ({ videos = [], loading, error, onVideoClick, className }) => {
  // 如果正在加载，显示骨架屏
  if (loading) {
    return (
      <div className={cn('grid gap-4', className)}>
        <VideoListSkeleton />
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="text-4xl mb-4 text-red-500">
          <i className="ri-error-warning-line"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          加载失败
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {error}
        </p>
        <motion.button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          whileTap={{ scale: 0.95 }}
        >
          重试
        </motion.button>
      </div>
    );
  }

  // 如果没有视频，显示空状态
  if (!videos || videos.length === 0) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="text-4xl mb-4 text-gray-400">
          <i className="ri-film-line"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          暂无视频
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          该用户还没有上传视频
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, staggerChildren: 0.1 }}
      className={cn('grid gap-4', className)}
    >
      {videos.map((video) => (
        <motion.div
          key={video.aid || video.bvid || Math.random()}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          whileHover={{ y: -4 }}
        >
          <VideoCard
            video={video}
            onClick={() => onVideoClick && onVideoClick(video)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

// 组件属性类型定义
BilibiliVideoList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      cover: PropTypes.string,
      duration: PropTypes.number,
      play_count: PropTypes.number,
      publish_time: PropTypes.number,
      bvid: PropTypes.string,
      aid: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onVideoClick: PropTypes.func,
  className: PropTypes.string
};

// 默认属性
BilibiliVideoList.defaultProps = {
  videos: [],
  loading: false,
  error: null,
  className: ''
};

export default BilibiliVideoList;