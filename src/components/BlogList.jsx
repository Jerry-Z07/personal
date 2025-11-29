import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { cn } from './BentoCard';
import { cardMotionPreset } from './motionPresets';

/**
 * 文章列表骨架屏
 */
const BlogListSkeleton = () => {
  return Array(5).fill(0).map((_, index) => (
    <div
      key={index}
      className="relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-4 animate-pulse shadow-sm"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  ));
};

/**
 * 单个文章条目
 */
const BlogItem = ({ post }) => {
  const handleClick = () => {
    if (post.link) window.open(post.link, '_blank');
  };

  return (
    <motion.div
      {...cardMotionPreset}
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl border border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-4 shadow-sm hover:shadow-xl cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <i className="ri-article-line"></i>
          </div>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-gray-900 dark:text-white hover:text-orange-600"
            onClick={(e) => e.stopPropagation()}
          >
            {post.title || '未命名文章'}
          </a>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.description || '暂无摘要'}
          </p>
        </div>
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
            <i className="ri-external-link-line"></i>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

BlogItem.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    link: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

/**
 * 博客文章列表组件
 */
const BlogList = ({ posts = [], loading, error, className }) => {
  if (loading) {
    return <div className={cn('space-y-3', className)}><BlogListSkeleton /></div>;
  }

  if (error) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="text-4xl mb-4 text-red-500">
          <i className="ri-error-warning-line"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">加载失败</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={cn('p-8 text-center', className)}>
        <div className="text-4xl mb-4 text-gray-400">
          <i className="ri-article-line"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">暂无文章</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">RSS 暂未返回内容</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {posts.map((post, idx) => (
        <BlogItem key={`${post.link || post.title || idx}-${idx}`} post={post} />
      ))}
    </div>
  );
};

BlogList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      link: PropTypes.string,
      description: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
};

BlogList.defaultProps = {
  posts: [],
  loading: false,
  error: null,
  className: '',
};

export default BlogList;
