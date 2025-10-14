/**
 * 主入口模块 - 负责初始化和模块协调
 */

import { 
    clockOverlayOpacity,
    clockOverlayEnabled
} from './config.js';

import { optimizeImageLoading } from './utils.js';

import { loadBackgroundImage } from './background.js';
import { loadClockOverlayOpacity } from './storage.js';
import { updateClockOverlayOpacity, updateOverlayVisibility } from './overlay.js';
import { toggleClockMode, updateClock } from './clock.js';
import { typeWriter } from './typing.js';
import { getUserLanguage } from './utils.js';
import { bindAllEvents } from './events.js';

/**
 * 页面加载完成后的初始化函数
 */
export function initialize() {
    // 检查URL参数，如果mode=clock则自动进入时钟模式
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    // 获取用户语言并应用翻译
    const userLang = getUserLanguage();
    const consoleMessage = applyTranslations(userLang);
    
    // 开始打字机效果
    const typingElement = document.getElementById('typing-text');
    const textToType = window.typingText || '你好，我是JlyVC';
    typeWriter(textToType, typingElement, 150);
    
    // 页面加载完成后输出对应语言的消息
    setTimeout(() => {
        console.log(consoleMessage);
    }, 2000);
    
    // 绑定时钟切换按钮事件
    const clockToggle = document.getElementById('clock-toggle');
    if (clockToggle) {
        clockToggle.addEventListener('click', toggleClockMode);
    }
    
    // 如果URL参数为clock，自动进入时钟模式
    if (mode === 'clock') {
        setTimeout(() => {
            toggleClockMode();
            // 显示URL模式提示
            const urlTip = document.getElementById('url-mode-tip');
            if (urlTip) {
                urlTip.classList.remove('hidden');
                // 5秒后自动隐藏提示
                setTimeout(() => {
                    urlTip.classList.add('hidden');
                }, 5000);
            }
        }, 1000); // 延迟1秒进入时钟模式，让页面完全加载
    }
    
    // 绑定所有事件
    bindAllEvents();
    
    // 优化图片加载
    optimizeImageLoading();
    
    // 加载背景图片
    loadBackgroundImage();
    
    // 加载设置（无论是否在时钟模式都需要加载）
    loadSettings();
    
    // 检查是否已经在时钟模式（比如页面刷新时）
    if (document.body.classList.contains('clock-mode')) {
        // 如果已经在时钟模式，加载一次背景图片
        loadBackgroundImage();
    } else {
        // 普通模式下也加载一次背景图片
        loadBackgroundImage();
    }
}

/**
 * 加载所有设置
 */
function loadSettings() {
    // 加载遮罩设置
    const overlaySettings = loadClockOverlayOpacity();
    updateClockOverlayOpacity(overlaySettings.opacity);
    updateOverlayVisibility(overlaySettings.enabled);
}

/**
 * 应用翻译（临时函数，需要从lang.js获取）
 */
function applyTranslations(lang) {
    // 这个函数的实现依赖于lang.js中的全局变量
    // 在模块化重构后，我们需要确保lang.js在main.js之前加载
    if (typeof translations !== 'undefined' && translations[lang]) {
        const t = translations[lang];
        
        // 设置打字机文本
        window.typingText = t.title;
        
        // 设置副标题
        const subtitle = document.getElementById('subtitle');
        if (subtitle) {
            subtitle.textContent = t.subtitle;
        }
        
        // 设置按钮文本
        const githubBtn = document.querySelector('.btn-github');
        if (githubBtn) {
            githubBtn.innerHTML = githubBtn.innerHTML.replace(githubBtn.textContent.trim(), t.buttons.github);
        }
        
        const blogBtn = document.querySelector('.btn-blog');
        if (blogBtn) {
            blogBtn.innerHTML = blogBtn.innerHTML.replace(blogBtn.textContent.trim(), t.buttons.blog);
        }
        
        const bilibiliBtn = document.querySelector('.btn-bilibili');
        if (bilibiliBtn) {
            bilibiliBtn.innerHTML = bilibiliBtn.innerHTML.replace(bilibiliBtn.textContent.trim(), t.buttons.bilibili);
        }
        
        // 设置页脚文本
        const footerInfo = document.querySelector('.footer-info');
        if (footerInfo) {
            footerInfo.innerHTML = footerInfo.innerHTML.replace('Made by enKl03B with ❤️', t.footer.madeBy);
        }
        
        const statusBtn = document.querySelector('.btn-status');
        if (statusBtn) {
            statusBtn.textContent = t.footer.status;
        }
        
        const codingText = document.querySelector('.footer-content p:last-child');
        if (codingText) {
            codingText.textContent = t.footer.codingWith;
        }
        
        // 设置页面标题
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) {
            pageTitle.textContent = t.pageTitle;
        }
        
        // 设置时钟设置文本（背景切换功能已移除）
        // const backgroundSwitchLabel = document.querySelector('.background-toggle-container .toggle-text');
        // if (backgroundSwitchLabel) {
        //     backgroundSwitchLabel.textContent = t.clock.settings.backgroundSwitch;
        // }
        
        // const switchIntervalLabel = document.querySelector('.interval-slider-container label');
        // if (switchIntervalLabel) {
        //     switchIntervalLabel.textContent = t.clock.settings.switchInterval;
        // }
        
        // 返回控制台消息
        return t.consoleMessage;
    }
    
    return '愿你永远心怀热爱，眼中总有星辰大海。';
}