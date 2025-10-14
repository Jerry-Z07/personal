/**
 * 存储模块 - 处理localStorage相关操作
 */

import {
    CLOCK_OVERLAY_OPACITY_KEY,
    CLOCK_OVERLAY_ENABLED_KEY,
    clockOverlayOpacity,
    clockOverlayEnabled
} from './config.js';

/**
 * 从localStorage加载遮罩透明度设置
 */
export function loadClockOverlayOpacity() {
    const savedOpacity = localStorage.getItem(CLOCK_OVERLAY_OPACITY_KEY);
    if (savedOpacity !== null) {
        window.clockOverlayOpacity = parseInt(savedOpacity);
    } else {
        // 如果没有保存的值，使用默认值
        window.clockOverlayOpacity = clockOverlayOpacity;
    }
    
    // 加载遮罩开关状态
    const savedEnabled = localStorage.getItem(CLOCK_OVERLAY_ENABLED_KEY);
    if (savedEnabled !== null) {
        window.clockOverlayEnabled = savedEnabled === 'true';
    } else {
        // 如果没有保存的值，使用默认值
        window.clockOverlayEnabled = clockOverlayEnabled;
    }
    
    // 更新滑块值
    const opacitySlider = document.getElementById('opacity-slider');
    if (opacitySlider) {
        opacitySlider.value = window.clockOverlayOpacity;
    }
    
    // 更新开关状态
    const overlayToggle = document.getElementById('overlay-toggle');
    if (overlayToggle) {
        overlayToggle.checked = window.clockOverlayEnabled;
    }
    
    // 更新显示值
    const opacityValueElement = document.getElementById('opacity-value');
    if (opacityValueElement) {
        opacityValueElement.textContent = `${window.clockOverlayOpacity}%`;
    }
    
    return {
        opacity: window.clockOverlayOpacity,
        enabled: window.clockOverlayEnabled
    };
}



/**
 * 保存遮罩透明度设置
 */
export function saveClockOverlayOpacity(opacity) {
    localStorage.setItem(CLOCK_OVERLAY_OPACITY_KEY, opacity);
    window.clockOverlayOpacity = opacity;
}

/**
 * 保存遮罩开关状态
 */
export function saveClockOverlayEnabled(enabled) {
    localStorage.setItem(CLOCK_OVERLAY_ENABLED_KEY, enabled);
    window.clockOverlayEnabled = enabled;
}