/**
 * 事件处理模块
 */

import { handleVisibilityChange } from './background.js';

/**
 * 绑定所有事件
 */
export function bindAllEvents() {
    // 主页面只需要页面可见性变化事件
    document.addEventListener('visibilitychange', handleVisibilityChange);
}