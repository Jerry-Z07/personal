/**
 * 事件处理模块
 */

import { toggleClockMode, updateClock } from './clock.js';
import { updateClockOverlayOpacity, updateOverlayVisibility } from './overlay.js';
import { loadClockOverlayOpacity, saveClockOverlayOpacity, saveClockOverlayEnabled } from './storage.js';
import { handleVisibilityChange, loadBackgroundImage } from './background.js';
import { typeWriter } from './typing.js';
import { getUserLanguage } from './utils.js';

/**
 * 绑定时钟设置相关事件
 */
export function bindClockSettingsEvents() {
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
        });
    }
    
    // 绑定遮罩开关事件
    const overlayToggle = document.getElementById('overlay-toggle');
    if (overlayToggle) {
        overlayToggle.addEventListener('change', function() {
            updateOverlayVisibility(this.checked);
        });
    }
}



/**
 * 绑定键盘事件
 */
export function bindKeyboardEvents() {
    // 监听ESC键退出时钟模式
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && document.body.classList.contains('clock-mode')) {
            toggleClockMode();
        }
    });
}

/**
 * 绑定窗口事件
 */
export function bindWindowEvents() {
    // 窗口大小变化处理
    window.addEventListener('resize', function() {
        // 可以在这里添加响应式处理的逻辑
    });
}

/**
 * 绑定页面可见性变化事件
 */
export function bindVisibilityEvents() {
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * 绑定所有事件
 */
export function bindAllEvents() {
    bindClockSettingsEvents();
    bindKeyboardEvents();
    bindWindowEvents();
    bindVisibilityEvents();
}