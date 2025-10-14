/**
 * 配置模块 - 存储所有配置常量和全局变量
 */

// 背景图片API地址
export const BACKGROUND_API_URL = 'https://t.alcy.cc/ycy';


// 时钟遮罩相关配置
export const CLOCK_OVERLAY_OPACITY_KEY = 'clockOverlayOpacity'; // localStorage键名
export const CLOCK_OVERLAY_ENABLED_KEY = 'clockOverlayEnabled'; // 开关状态键名

// 全局状态变量
// 背景切换定时器已移除
export let clockOverlayOpacity = 50; // 默认50%透明度
export let clockOverlayEnabled = true; // 默认开启遮罩