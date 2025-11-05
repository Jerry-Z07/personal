// 缓存管理器 - 用于管理 Bilibili 和 Blog 数据缓存

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  // 设置缓存，可指定有效期（默认5分钟）
  set(key, data, duration = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration
    });
  }

  // 获取缓存，如果过期则自动删除并返回null
  get(key) {
    const cached = this.cache.get(key);
    if (cached) {
      const now = Date.now();
      const isExpired = now - cached.timestamp > cached.duration;
      
      if (isExpired) {
        // 缓存已过期，删除并返回null
        this.cache.delete(key);
        return null;
      }
      
      return cached.data;
    }
    return null;
  }

  // 检查缓存是否存在且未过期
  has(key) {
    const cached = this.cache.get(key);
    if (!cached) {
      return false;
    }
    
    const now = Date.now();
    const isExpired = now - cached.timestamp > cached.duration;
    
    if (isExpired) {
      // 缓存已过期，删除
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // 清除特定缓存
  clear(key) {
    this.cache.delete(key);
  }

  // 清除所有缓存
  clearAll() {
    this.cache.clear();
  }
}

// 导出单例
export default new CacheManager();
