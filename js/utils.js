/**
 * 工具函数模块
 */

/**
 * 检测设备类型和屏幕尺寸
 * 用于优化图片加载策略
 */
export function getDeviceInfo() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    return {
        width: screenWidth,
        height: screenHeight,
        pixelRatio: devicePixelRatio,
        isMobile: screenWidth <= 768,
        isRetina: devicePixelRatio > 1
    };
}

/**
 * 根据设备类型优化图片加载
 */
export function optimizeImageLoading() {
    const deviceInfo = getDeviceInfo();
    
    // 根据设备类型调整图片质量或尺寸（如果API支持）
    // 这里可以根据需要添加更多的优化逻辑
}

/**
 * 获取用户语言偏好
 */
export function getUserLanguage() {
    // 检查浏览器语言设置
    const browserLang = navigator.language || navigator.userLanguage;
    
    // 如果是中文环境（包括简体中文和繁体中文）
    if (browserLang.startsWith('zh')) {
        return 'zh';
    }
    
    // 其他情况默认为英文
    return 'en';
}