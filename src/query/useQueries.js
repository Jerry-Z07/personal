/**
 * React Query自定义Hooks
 * 使用统一的API工具模块，确保数据获取的一致性和可维护性
 * 
 * 重构说明：
 * - 移除了重复的数据获取逻辑，统一使用 apiUtils.js
 * - 使用统一的查询配置对象
 * - 保持相同的接口，确保持向后兼容性
 * 
 * @author Assistant
 * @date 2025-01-01
 */

import { useQuery } from '@tanstack/react-query';
import { 
  fetchBilibiliData, 
  fetchBlogData, 
  queryConfig 
} from '../utils/apiUtils';

/**
 * 获取Bilibili数据的自定义Hook
 * 使用统一的API工具和配置，确保数据获取的一致性
 * 
 * @returns {Object} useQuery返回对象，包含data、isLoading、error等状态
 */
export const useBilibiliData = () => {
  return useQuery({
    queryKey: ['bilibiliData'],
    queryFn: fetchBilibiliData,
    ...queryConfig // 展开统一的查询配置
  });
};

/**
 * 获取Blog数据的自定义Hook  
 * 使用统一的API工具和配置，确保数据获取的一致性
 * 
 * @returns {Object} useQuery返回对象，包含data、isLoading、error等状态
 */
export const useBlogData = () => {
  return useQuery({
    queryKey: ['blogData'],
    queryFn: fetchBlogData,
    ...queryConfig // 展开统一的查询配置
  });
};

/**
 * 预加载所有数据的Hook
 * 用于手动触发数据预加载
 * 
 * @returns {Object} 包含preloadAll函数的对象
 */
export const usePreloadAllData = () => {
  // 使用现有的hooks获取refetch函数
  const { refetch: refetchBilibili } = useBilibiliData();
  const { refetch: refetchBlog } = useBlogData();

  /**
   * 预加载所有数据
   * 并行执行所有数据获取任务
   */
  const preloadAll = async () => {
    try {
      await Promise.all([
        refetchBilibili(),
        refetchBlog()
      ]);
    } catch (error) {
      console.error('预加载数据失败:', error);
      // 静默失败，不影响用户体验
    }
  };

  return { preloadAll };
};