import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { cn } from './BentoCard';
import { formatPlayCount, formatDuration, formatPublishTime } from '../utils/api';
import { cardMotionPreset } from './motionPresets';

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
      {...cardMotionPreset}
      className="relative overflow-hidden rounded-2xl flex flex-col h-full cursor-pointer bg-white/60 dark:bg-zinc-900/60 border border-gray-200/50 dark:border-white/10 shadow-sm hover:shadow-xl backdrop-blur-md ring-1 ring-transparent hover:ring-[#00aeec]/30 transition-all duration-300"
      onClick={handleClick}
    >
      {/* 顶部品牌高光 */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00aeec]/40 to-transparent" />
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
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md backdrop-blur-sm">
          {formatDuration(video.duration || 0)}
        </div>
        {/* 播放按钮覆盖层 */}
        <motion.div
          className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200"
          whileHover={{ scale: 1.1 }}
        >
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg ring-1 ring-black/10">
            <i className="ri-play-fill text-black"></i>
          </div>
        </motion.div>
      </div>

      {/* 视频信息 */}
      <div className="p-3 flex-1 flex flex-col">
        {/* 视频标题 */}
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-2 flex-1">
          {video.title || '无标题'}
        </h3>

        {/* 视频统计信息 */}
        <div className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 space-x-4">
          <span className="flex items-center">
            <i className="ri-play-circle-line text-[#00aeec] mr-1"></i>
            {formatPlayCount(video.play_count || 0)}
          </span>
          <span className="flex items-center">
            <i className="ri-calendar-line text-[#00aeec] mr-1"></i>
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
    <div key={index} className="bg-white/60 dark:bg-zinc-900/60 rounded-2xl overflow-hidden shadow-sm border border-gray-200/50 dark:border-white/10 animate-pulse flex flex-col h-full backdrop-blur-md">
      <div className="w-full aspect-video bg-gray-200/50 dark:bg-white/10"></div>
      <div className="p-3 flex-1">
        <div className="h-4 bg-gray-200/60 dark:bg-white/10 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200/60 dark:bg-white/10 rounded w-3/4"></div>
        <div className="flex space-x-4 mt-3">
          <div className="h-3 bg-gray-200/60 dark:bg-white/10 rounded w-16"></div>
          <div className="h-3 bg-gray-200/60 dark:bg-white/10 rounded w-20"></div>
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
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4', className)}>
        <VideoListSkeleton />
      </div>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className={cn('p-8 text-center rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md', className)}>
        <div className="text-4xl mb-4 text-[#00aeec]">
          <i className="ri-error-warning-line"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
          加载失败
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {error}
        </p>
        <motion.button
          className="px-4 py-2 bg-[#00aeec] text-white rounded-full hover:bg-[#00aeec]/90 shadow-sm"
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
      <div className={cn('p-8 text-center rounded-2xl border border-gray-200/50 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md', className)}>
        <div className="text-4xl mb-4 text-[#00aeec]">
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
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4', className)}>
      {videos.map((video) => (
        <div key={video.aid || video.bvid || Math.random()}>
          <VideoCard
            video={video}
            onClick={() => onVideoClick && onVideoClick(video)}
          />
        </div>
      ))}
    </div>
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