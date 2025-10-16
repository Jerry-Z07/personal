/**
 * 独立时钟页面主入口模块
 * 专门处理时钟页面的初始化和功能
 */

import { 
    clockOverlayOpacity,
    clockOverlayEnabled
} from './config.js';

import { optimizeImageLoading, getUserLanguage } from './utils.js';
import { loadBackgroundImage } from './background.js';
import { loadClockOverlayOpacity } from './storage.js';
import { updateClockOverlayOpacity, updateOverlayVisibility } from './overlay.js';
import { updateClock } from './clock.js';
import { bindAllClockEvents } from './clock-events.js';
import { translations } from '../lang.js';

/**
 * 时钟页面初始化函数
 */
export function initializeClockPage() {
    // 应用翻译
    applyClockTranslations();
    
    // 立即更新一次时钟
    updateClock();
    
    // 每秒更新时钟
    window.clockInterval = setInterval(updateClock, 1000);
    
    // 绑定时钟相关事件
    bindAllClockEvents();
    
    // 优化图片加载
    optimizeImageLoading();
    
    // 加载背景图片
    loadBackgroundImage();
    
    // 加载遮罩设置
    loadClockSettings();
    
    // 显示初始提示
    showInitialTip();
}

/**
 * 加载时钟设置
 */
function loadClockSettings() {
    // 加载遮罩设置
    const overlaySettings = loadClockOverlayOpacity();
    updateClockOverlayOpacity(overlaySettings.opacity);
    updateOverlayVisibility(overlaySettings.enabled);
}

/**
 * 显示初始提示
 */
function showInitialTip() {
    // 显示操作提示
    const tipElement = document.getElementById('operation-tip');
    if (tipElement) {
        // 3秒后自动隐藏提示
        setTimeout(() => {
            tipElement.classList.add('hidden');
        }, 3000);
    }
}

/**
 * 应用时钟页面翻译
 */
function applyClockTranslations() {
    const userLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const t = translations[userLang];
    
    if (t && t.clock) {
        // 设置页面标题
        document.title = '网页时钟';
        
        // 设置提示文本
        const tipElement = document.getElementById('operation-tip');
        if (tipElement) {
            const tipSpan = tipElement.querySelector('span');
            if (tipSpan) {
                tipSpan.textContent = userLang === 'zh' ? '按F11键全屏' : 'Press F11 for fullscreen';
            }
        }
        
        // 设置遮罩面板文本
        const opacityHeader = document.querySelector('.opacity-header span');
        if (opacityHeader) {
            opacityHeader.textContent = t.clock.settings ? t.clock.settings.maskSettings || '遮罩设置' : '遮罩设置';
        }
        
        const overlayText = document.querySelector('.overlay-toggle-container .toggle-text');
        if (overlayText) {
            overlayText.textContent = t.clock.settings ? t.clock.settings.showMask || '显示遮罩' : '显示遮罩';
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializeClockPage);