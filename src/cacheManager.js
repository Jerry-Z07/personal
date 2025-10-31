// 全局缓存管理器
// 用于管理API数据的缓存，支持短时间缓存和后台预加载

const CACHE_DURATION = 5 * 60 * 1000; // 缓存有效期：5分钟

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map(); // 用于跟踪正在进行的请求
  }

  /**
   * 设置缓存数据
   * @param {string} key - 缓存键
   * @param {any} data - 要缓存的数据
   */
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * 获取缓存数据
   * @param {string} key - 缓存键
   * @returns {any|null} 缓存的数据，如果不存在或已过期则返回null
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // 检查缓存是否过期
    const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 检查缓存是否存在且有效
   * @param {string} key - 缓存键
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * 清除指定缓存
   * @param {string} key - 缓存键
   */
  clear(key) {
    this.cache.delete(key);
    this.loadingPromises.delete(key);
  }

  /**
   * 清除所有缓存
   */
  clearAll() {
    this.cache.clear();
    this.loadingPromises.clear();
  }

  /**
   * 获取或加载数据（防止重复请求）
   * @param {string} key - 缓存键
   * @param {Function} fetchFn - 获取数据的函数
   * @returns {Promise<any>}
   */
  async getOrFetch(key, fetchFn) {
    // 先检查缓存
    const cachedData = this.get(key);
    if (cachedData !== null) {
      return cachedData;
    }

    // 检查是否已有正在进行的请求
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    // 创建新的请求
    const promise = fetchFn()
      .then(data => {
        this.set(key, data);
        this.loadingPromises.delete(key);
        return data;
      })
      .catch(error => {
        this.loadingPromises.delete(key);
        throw error;
      });

    this.loadingPromises.set(key, promise);
    return promise;
  }
}

// 导出单例实例
export const cacheManager = new CacheManager();

// 缓存键常量
export const CACHE_KEYS = {
  BILIBILI_USER: 'bilibili_user',
  BILIBILI_VIDEOS: 'bilibili_videos',
  BLOG_FEED: 'blog_feed'
};
