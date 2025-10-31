// 资源加载管理器
// 用于跟踪字体、背景图片等关键资源的加载状态

class ResourceLoader {
  constructor() {
    this.resources = {
      font: false,
      background: false
    };
    this.listeners = [];
  }

  /**
   * 标记某个资源已加载完成
   * @param {string} resourceName - 资源名称
   */
  markLoaded(resourceName) {
    if (this.resources.hasOwnProperty(resourceName)) {
      this.resources[resourceName] = true;
      console.log(`✓ ${resourceName} 加载完成`);
      this.checkAllLoaded();
    }
  }

  /**
   * 检查所有资源是否已加载完成
   */
  checkAllLoaded() {
    const allLoaded = Object.values(this.resources).every(status => status === true);
    
    if (allLoaded) {
      console.log('✓ 所有关键资源加载完成');
      this.notifyListeners();
    }
  }

  /**
   * 添加监听器，当所有资源加载完成时触发
   * @param {Function} callback - 回调函数
   */
  onAllLoaded(callback) {
    // 如果已经全部加载完成，立即执行回调
    if (this.isAllLoaded()) {
      callback();
    } else {
      this.listeners.push(callback);
    }
  }

  /**
   * 检查是否所有资源都已加载
   * @returns {boolean}
   */
  isAllLoaded() {
    return Object.values(this.resources).every(status => status === true);
  }

  /**
   * 通知所有监听器
   */
  notifyListeners() {
    this.listeners.forEach(callback => callback());
    this.listeners = [];
  }

  /**
   * 重置加载状态
   */
  reset() {
    Object.keys(this.resources).forEach(key => {
      this.resources[key] = false;
    });
    this.listeners = [];
  }
}

// 导出单例实例
export const resourceLoader = new ResourceLoader();

/**
 * 检测字体是否加载完成
 * @param {string} fontFamily - 字体名称
 * @returns {Promise<void>}
 */
export const waitForFont = (fontFamily = 'LXGW WenKai') => {
  return new Promise((resolve) => {
    // 检查是否支持 FontFaceSet API
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        // 检查指定字体是否已加载
        document.fonts.forEach((font) => {
          if (font.family.includes(fontFamily) && font.status === 'loaded') {
            console.log(`字体 "${fontFamily}" 已加载`);
          }
        });
        resolve();
      });
    } else {
      // 降级方案：使用延迟
      setTimeout(resolve, 100);
    }
  });
};
