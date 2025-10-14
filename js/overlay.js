/**
 * 时钟遮罩管理模块
 */

import { saveClockOverlayOpacity, saveClockOverlayEnabled } from './storage.js';

/**
 * 更新时钟遮罩透明度
 */
export function updateClockOverlayOpacity(opacity) {
    const clockOverlay = document.getElementById('clock-overlay');
    if (clockOverlay) {
        // 将百分比转换为小数（0-1）
        const opacityValue = opacity / 100;
        clockOverlay.style.background = `rgba(0, 0, 0, ${opacityValue})`;
        
        // 保存到localStorage
        saveClockOverlayOpacity(opacity);
        
        // 更新显示值
        const opacityValueElement = document.getElementById('opacity-value');
        if (opacityValueElement) {
            opacityValueElement.textContent = `${opacity}%`;
        }
    }
}

/**
 * 更新遮罩显示状态
 */
export function updateOverlayVisibility(enabled) {
    const overlay = document.getElementById('clock-overlay');
    if (overlay) {
        if (enabled) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
    
    // 更新滑条禁用状态
    const opacitySlider = document.getElementById('opacity-slider');
    const opacitySliderContainer = document.querySelector('.opacity-slider-container');
    if (opacitySlider && opacitySliderContainer) {
        if (enabled) {
            opacitySlider.disabled = false;
            opacitySliderContainer.classList.remove('disabled');
        } else {
            opacitySlider.disabled = true;
            opacitySliderContainer.classList.add('disabled');
        }
    }
    
    // 保存到localStorage
    saveClockOverlayEnabled(enabled);
    
    // 更新开关状态
    const overlayToggle = document.getElementById('overlay-toggle');
    if (overlayToggle) {
        overlayToggle.checked = enabled;
    }
}