/**
 * 背景图片管理模块
 */

import { BACKGROUND_API_URL } from './config.js';
import { optimizeImageLoading } from './utils.js';

/**
 * 设置备用背景方案
 * 当API图片加载失败时使用CSS渐变背景
 */
function setFallbackBackground() {
    const backgroundContainer = document.querySelector('.background-container');
    const backgroundImage = document.getElementById('background-image');
    
    if (!backgroundContainer || !backgroundImage) {
        console.warn('背景容器或图片元素不存在，跳过备用背景设置');
        return;
    }
    
    // 隐藏图片元素
    backgroundImage.style.display = 'none';
    
    // 设置CSS渐变背景作为备用方案
    backgroundContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    backgroundContainer.style.backgroundSize = 'cover';
    backgroundContainer.style.backgroundPosition = 'center';
    backgroundContainer.style.backgroundAttachment = 'fixed';
}

/**
 * 加载背景图片
 * 从API获取图片并设置为背景
 */
export async function loadBackgroundImage() {
    const backgroundImage = document.getElementById('background-image');
    
    if (!backgroundImage) {
        console.warn('背景图片元素不存在，跳过背景加载');
        return;
    }
    
    try {
        // 显示加载状态
        // console.log('正在加载背景图片...');
        
        // 创建图片对象进行预加载
        const img = new Image();
        
        // 设置图片源地址
        img.src = BACKGROUND_API_URL;
        
        // 图片加载成功时的处理
        img.onload = function() {
            backgroundImage.src = BACKGROUND_API_URL;
            
            // 添加淡入效果
            backgroundImage.style.opacity = '0';
            backgroundImage.style.transition = 'opacity 1s ease-in-out';
            
            // 延迟设置透明度以实现淡入效果
            setTimeout(() => {
                backgroundImage.style.opacity = '1';
            }, 100);
        };
        
        // 图片加载失败时的处理
        img.onerror = function() {
            console.error('背景图片加载失败，使用备用方案');
            setFallbackBackground();
        };
        
    } catch (error) {
        console.error('加载背景图片时发生错误:', error);
        setFallbackBackground();
    }
}



/**
 * 页面可见性变化时的背景处理
 */
export function handleVisibilityChange() {
    // 页面可见性变化时的处理逻辑
    if (document.hidden) {
    //    console.log('页面已隐藏');
    } else {
    //    console.log('页面已显示');
    }
}