/**
 * 缓存管理器 - 轻量级包装层
 * 仅提供基础接口，完全依赖React Query管理缓存
 */
import queryClient from './query';

class CacheManager {
  /**
   * 设置缓存 - 使用React Query
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   */
  set(key, value) {
    try {
      const queryKey = ['legacy', key];
      queryClient.setQueriesData(queryKey, value);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * 获取缓存 - 从React Query获取
   * @param {string} key - 缓存键
   * @returns {*} 缓存值
   */
  get(key) {
    try {
      const queryKey = ['legacy', key];
      const data = queryClient.getQueriesData(queryKey);
      if (data && data.length > 0 && data[0][1] !== undefined) {
        return data[0][1];
      }
      return null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * 检查缓存是否存在
   * @param {string} key - 缓存键
   * @returns {boolean} 是否存在有效缓存
   */
  has(key) {
    try {
      const queryKey = ['legacy', key];
      const data = queryClient.getQueriesData(queryKey);
      return data && data.length > 0 && data[0][1] !== undefined;
    } catch (error) {
      console.error('Cache has error:', error);
      return false;
    }
  }

  /**
   * 清除指定缓存
   * @param {string} key - 缓存键
   */
  clear(key) {
    try {
      const queryKey = ['legacy', key];
      queryClient.removeQueries(queryKey);
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * 清除所有缓存
   */
  clearAll() {
    try {
      queryClient.removeQueries();
    } catch (error) {
      console.error('Cache clearAll error:', error);
    }
  }
}

export default new CacheManager();
