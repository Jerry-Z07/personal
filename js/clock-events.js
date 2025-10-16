/**
 * 时钟相关事件处理模块
 * 专门处理时钟页面的事件绑定
 */

import { updateClockOverlayOpacity, updateOverlayVisibility } from './overlay.js';
import { loadClockOverlayOpacity, saveClockOverlayOpacity, saveClockOverlayEnabled } from './storage.js';
import { handleVisibilityChange, loadBackgroundImage } from './background.js';

/**
 * 绑定时钟设置相关事件
 */
export function bindClockEvents() {
    // 绑定时钟设置按钮事件
    const clockSettings = document.getElementById('clock-settings');
    const opacityPanel = document.getElementById('opacity-panel');
    const closeOpacity = document.getElementById('close-opacity');
    const opacitySlider = document.getElementById('opacity-slider');
    
    if (clockSettings && opacityPanel) {
        clockSettings.addEventListener('click', function() {
            opacityPanel.classList.toggle('hidden');
        });
    }
    
    if (closeOpacity && opacityPanel) {
        closeOpacity.addEventListener('click', function() {
            opacityPanel.classList.add('hidden');
        });
    }
    
    if (opacitySlider) {
        opacitySlider.addEventListener('input', function() {
            const opacity = parseInt(this.value);
            updateClockOverlayOpacity(opacity);
            // 保存设置
            saveClockOverlayOpacity(opacity);
        });
    }
    
    // 绑定遮罩开关事件
    const overlayToggle = document.getElementById('overlay-toggle');
    if (overlayToggle) {
        overlayToggle.addEventListener('change', function() {
            updateOverlayVisibility(this.checked);
            // 保存设置
            saveClockOverlayEnabled(this.checked);
        });
    }
}

/**
 * 绑定键盘事件（时钟页面专用）
 */
export function bindClockKeyboardEvents() {
    // 监听F11键全屏
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F11') {
            event.preventDefault();
            toggleFullscreen();
        }
    });
}

/**
 * 切换全屏模式
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // 进入全屏
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

/**
 * 绑定窗口事件
 */
export function bindClockWindowEvents() {
    // 窗口大小变化处理
    window.addEventListener('resize', function() {
        // 可以在这里添加响应式处理的逻辑
    });
}

/**
 * 绑定页面可见性变化事件
 */
export function bindClockVisibilityEvents() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * 绑定时钟页面的所有事件
 */
export function bindAllClockEvents() {
    bindClockEvents();
    bindClockKeyboardEvents();
    bindClockWindowEvents();
    bindClockVisibilityEvents();
}