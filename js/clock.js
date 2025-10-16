/**
 * 时钟功能模块
 */

import { getUserLanguage } from './utils.js';

// 定义翻译对象，避免在独立时钟页面中出现未定义错误
const translations = {
    zh: {
        clock: {
            weekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        }
    },
    en: {
        clock: {
            weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        }
    }
};

/**
 * 数字时钟更新函数
 */
export function updateClock() {
    const now = new Date();
    const timeElement = document.getElementById('clock-time');
    const secondsElement = document.getElementById('clock-seconds');
    const dateElement = document.getElementById('clock-date');
    
    if (timeElement && secondsElement && dateElement) {
        // 获取用户语言
        const userLang = getUserLanguage();
        const weekDays = translations[userLang].clock.weekDays;
        
        // 格式化时间
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // 格式化日期
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const weekDay = weekDays[now.getDay()];
        
        timeElement.textContent = `${hours}:${minutes}`;
        secondsElement.textContent = `:${seconds}`;
        
        if (userLang === 'zh') {
            dateElement.textContent = `${year}年${month}月${day}日 ${weekDay}`;
        } else {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
            dateElement.textContent = `${monthNames[now.getMonth()]} ${day}, ${year} ${weekDay}`;
        }
    }
}

/**
 * 时钟模式切换函数
 */
export function toggleClockMode() {
    const body = document.body;
    const digitalClock = document.getElementById('digital-clock');
    const mainContent = document.querySelector('.main-content');
    const footer = document.querySelector('.footer');
    
    if (body.classList.contains('clock-mode')) {
        // 退出时钟模式
        exitClockMode(body, digitalClock, mainContent, footer);
    } else {
        // 进入时钟模式
        enterClockMode(body, digitalClock, mainContent, footer);
    }
}

/**
 * 进入时钟模式
 */
function enterClockMode(body, digitalClock, mainContent, footer) {
    body.classList.add('clock-mode');
    
    // 隐藏主内容和页脚
    mainContent.classList.add('hidden');
    footer.classList.add('hidden');
    
    digitalClock.classList.remove('hidden');
    
    // 延迟显示时钟，让动画更流畅
    setTimeout(() => {
        digitalClock.classList.add('visible');
        updateClock(); // 立即更新一次
        // 每秒更新时钟
        window.clockInterval = setInterval(updateClock, 1000);
        
        // 更改网页标题为"网页时钟"
        document.title = '网页时钟';
    }, 300);
}

/**
 * 退出时钟模式
 */
function exitClockMode(body, digitalClock, mainContent, footer) {
    body.classList.remove('clock-mode');
    digitalClock.classList.remove('visible');
    digitalClock.classList.add('hidden');
    
    // 显示主内容和页脚
    mainContent.classList.remove('hidden');
    footer.classList.remove('hidden');
    
    // 清除时钟更新定时器
    if (window.clockInterval) {
        clearInterval(window.clockInterval);
        window.clockInterval = null;
    }
    
    // 恢复原始标题
    const currentLang = getUserLanguage();
    document.title = translations[currentLang].pageTitle;
}