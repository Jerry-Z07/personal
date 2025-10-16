/**
 * 主入口模块 - 负责初始化和模块协调
 */

import { optimizeImageLoading } from './utils.js';
import { loadBackgroundImage } from './background.js';
import { typeWriter } from './typing.js';
import { getUserLanguage } from './utils.js';
import { bindAllEvents } from './events.js';
import { translations } from './translations.js';

/**
 * 页面加载完成后的初始化函数
 */
export function initialize() {
    // 检查是否存在React应用，如果存在则跳过传统初始化
    const reactRoot = document.getElementById('react-root');
    if (reactRoot && reactRoot.hasChildNodes()) {
        console.log('检测到React应用，跳过传统初始化');
        return;
    }
    
    // 获取用户语言并应用翻译
    const userLang = getUserLanguage();
    const consoleMessage = applyTranslations(userLang);
    
    // 开始打字机效果
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const textToType = window.typingText || '你好，我是JlyVC';
        typeWriter(textToType, typingElement, 150);
    }
    
    // 页面加载完成后输出对应语言的消息
    setTimeout(() => {
        console.log(consoleMessage);
    }, 2000);
    
    // 绑定时钟切换按钮事件
    const clockToggle = document.getElementById('clock-toggle');
    if (clockToggle) {
        clockToggle.addEventListener('click', toggleClockMode);
    }
    
    // 绑定时钟页面按钮事件
    const clockButton = document.getElementById('clock-button');
    if (clockButton) {
        clockButton.addEventListener('click', function() {
            window.location.href = 'clock.html';
        });
    }
    
    // 绑定所有事件
    bindAllEvents();
    
    // 优化图片加载
    optimizeImageLoading();
    
    // 背景图片加载
    loadBackgroundImage();
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
 * 应用翻译
 */
function applyTranslations(lang) {
    if (translations[lang]) {
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
            githubBtn.textContent = t.buttons.github;
        }
        
        const blogBtn = document.querySelector('.btn-blog');
        if (blogBtn) {
            blogBtn.textContent = t.buttons.blog;
        }
        
        const bilibiliBtn = document.querySelector('.btn-bilibili');
        if (bilibiliBtn) {
            bilibiliBtn.textContent = t.buttons.bilibili;
        }
        
        // 设置页脚文本
        const footerInfo = document.querySelector('.footer-info');
        if (footerInfo) {
            footerInfo.textContent = t.footer.madeBy;
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
        
        // 返回控制台消息
        return t.consoleMessage;
    }
    
    return '愿你永远心怀热爱，眼中总有星辰大海。';
}