/**
 * 语言配置文件
 */
const translations = {
    zh: {
        title: '你好，我是JlyVC',
        subtitle: '也是enKl03B',
        pageTitle: '你来啦？欢迎！',
        buttons: {
            github: 'GitHub',
            blog: '博客',
            bilibili: '哔哩哔哩'
        },
        footer: {
            madeBy: 'Made by enKl03B with ❤️',
            status: '网站状态',
            codingWith: 'Coding with Trae & Kimi-K2'
        },
        consoleMessage: '愿你永远心怀热爱，眼中总有星辰大海。',
        clock: {
            title: '全屏时钟',
            weekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
            settings: {
                maskSettings: '遮罩设置',
                showMask: '显示遮罩'
                // backgroundSwitch: '背景自动切换', // 背景切换功能已移除
                // switchInterval: '切换间隔' // 背景切换功能已移除
            }
        }
    },
    en: {
        title: 'Hello, I am JlyVC',
        subtitle: 'Also known as enKl03B',
        pageTitle: 'Welcome！',
        buttons: {
            github: 'GitHub',
            blog: 'Blog',
            bilibili: 'Bilibili'
        },
        footer: {
            madeBy: 'Made by enKl03B with ❤️',
            status: 'Site Status',
            codingWith: 'Coding with Trae & Kimi-K2'
        },
        consoleMessage: 'May you always hold passion in your heart and see stars and the vast sea in your gaze forever.',
        clock: {
            title: 'Full Screen Clock',
            weekDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            settings: {
                maskSettings: 'Mask Settings',
                showMask: 'Show Mask'
                // backgroundSwitch: 'Auto Background Switch', // 背景切换功能已移除
                // switchInterval: 'Switch Interval' // 背景切换功能已移除
            }
        }
    }
};

/**
 * 获取用户语言偏好
 */
function getUserLanguage() {
    // 检查浏览器语言设置
    const browserLang = navigator.language || navigator.userLanguage;
    
    // 如果是中文环境（包括简体中文和繁体中文）
    if (browserLang.startsWith('zh')) {
        return 'zh';
    }
    
    // 其他情况默认为英文
    return 'en';
}

/**
 * 应用翻译
 */
function applyTranslations(lang) {
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