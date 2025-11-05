// 缓存管理器 - 用于管理 Bilibili 和 Blog 数据缓存

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  // 设置缓存
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // 获取缓存
  get(key) {
    const cached = this.cache.get(key);
    if (cached) {
      return cached.data;
    }
    return null;
  }

  // 检查缓存是否存在
  has(key) {
    return this.cache.has(key);
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
