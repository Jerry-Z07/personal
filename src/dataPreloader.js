/**
 * 数据预加载器 - 使用统一的API工具模块
 * 
 * 重构说明：
 * - 移除了重复的数据获取逻辑，统一使用 apiUtils.js
 * - 简化了函数，专注于预加载逻辑
 * - 保持向后兼容性，导出相同的接口
 * 
 * @author Assistant  
 * @date 2025-01-01
 */

import queryClient from './query';
import { 
  fetchBilibiliData, 
  fetchBlogData, 
  CACHE_DURATION 
} from './utils/apiUtils';

/**
 * 预加载Bilibili数据
 * 使用React Query的预加载功能，避免重复数据获取
 */
export const preloadBilibiliData = async () => {
  // 检查React Query缓存
  const hasCached = queryClient.getQueryData(['bilibiliData']) !== undefined;
  if (hasCached) {
    return;
  }

  try {
    // 使用React Query的预加载功能
    await queryClient.prefetchQuery({
      queryKey: ['bilibiliData'],
      queryFn: fetchBilibiliData,
      staleTime: CACHE_DURATION,
      gcTime: CACHE_DURATION,
      retry: 1
    });
  } catch (err) {
    console.error('预加载Bilibili数据失败:', err);
    // 静默失败，不影响用户体验
  }
};

/**
 * 预加载Blog数据
 * 使用React Query的预加载功能，避免重复数据获取
 */
export const preloadBlogData = async () => {
  // 检查React Query缓存
  const hasCached = queryClient.getQueryData(['blogData']) !== undefined;
  if (hasCached) {
    return;
  }

  try {
    // 使用React Query的预加载功能
    await queryClient.prefetchQuery({
      queryKey: ['blogData'],
      queryFn: fetchBlogData,
      staleTime: CACHE_DURATION,
      gcTime: CACHE_DURATION,
      retry: 1
    });
  } catch (err) {
    console.error('预加载Blog数据失败:', err);
    // 静默失败，不影响用户体验
  }
};

/**
 * 预加载所有数据
 * 并行执行所有预加载任务，提高效率
 */
export const preloadAllData = async () => {
  await Promise.all([
    preloadBilibiliData(),
    preloadBlogData()
  ]);
};

// 兼容性导出 - 保留原有API以确保向后兼容
export { fetchBilibiliData, fetchBlogData };
