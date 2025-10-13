/**
 * 页面操作相关脚本
 */

// 背景图片API地址
const BACKGROUND_API_URL = 'https://t.alcy.cc/ycy';

// 背景图片切换定时器
let backgroundSwitchInterval = null;
const BACKGROUND_SWITCH_INTERVAL = 5 * 60 * 1000; // 5分钟（毫秒）

// 时钟遮罩透明度设置
let clockOverlayOpacity = 50; // 默认50%透明度
const CLOCK_OVERLAY_OPACITY_KEY = 'clockOverlayOpacity'; // localStorage键名
const CLOCK_OVERLAY_ENABLED_KEY = 'clockOverlayEnabled'; // 开关状态键名
let clockOverlayEnabled = true; // 默认开启遮罩

// 背景图片切换设置
const BACKGROUND_SWITCH_ENABLED_KEY = 'backgroundSwitchEnabled'; // 背景切换开关键名
const BACKGROUND_SWITCH_INTERVAL_KEY = 'backgroundSwitchInterval'; // 切换间隔键名
let backgroundSwitchEnabled = true; // 默认开启自动切换
let backgroundSwitchIntervalMinutes = 5; // 默认5分钟切换一次

/**
 * 加载背景图片
 * 从API获取图片并设置为背景
 */
async function loadBackgroundImage() {
    const backgroundImage = document.getElementById('background-image');
    
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
 * 设置备用背景方案
 * 当API图片加载失败时使用CSS渐变背景
 */
function setFallbackBackground() {
    const backgroundContainer = document.querySelector('.background-container');
    const backgroundImage = document.getElementById('background-image');
    
    // 隐藏图片元素
    backgroundImage.style.display = 'none';
    
    // 设置CSS渐变背景作为备用方案
    backgroundContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    backgroundContainer.style.backgroundSize = 'cover';
    backgroundContainer.style.backgroundPosition = 'center';
    backgroundContainer.style.backgroundAttachment = 'fixed';
}

/**
 * 检测设备类型和屏幕尺寸
 * 用于优化图片加载策略
 */
function getDeviceInfo() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    return {
        width: screenWidth,
        height: screenHeight,
        pixelRatio: devicePixelRatio,
        isMobile: screenWidth <= 768,
        isRetina: devicePixelRatio > 1
    };
}

/**
 * 根据设备类型优化图片加载
 */
function optimizeImageLoading() {
    const deviceInfo = getDeviceInfo();
    
    // 根据设备类型调整图片质量或尺寸（如果API支持）
    // 这里可以根据需要添加更多的优化逻辑
}

/**
 * 更新时钟遮罩透明度
 */
function updateClockOverlayOpacity(opacity) {
    const clockOverlay = document.getElementById('clock-overlay');
    if (clockOverlay) {
        // 将百分比转换为小数（0-1）
        const opacityValue = opacity / 100;
        clockOverlay.style.background = `rgba(0, 0, 0, ${opacityValue})`;
        
        // 保存到localStorage
        localStorage.setItem(CLOCK_OVERLAY_OPACITY_KEY, opacity);
        
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
function updateOverlayVisibility(enabled) {
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
    localStorage.setItem(CLOCK_OVERLAY_ENABLED_KEY, enabled);
    clockOverlayEnabled = enabled;
    
    // 更新开关状态
    const overlayToggle = document.getElementById('overlay-toggle');
    if (overlayToggle) {
        overlayToggle.checked = enabled;
    }
}

/**
 * 更新背景切换设置
 */
function updateBackgroundSwitchSettings(enabled, intervalMinutes) {
    backgroundSwitchEnabled = enabled;
    backgroundSwitchIntervalMinutes = intervalMinutes;
    
    // 保存到localStorage
    localStorage.setItem(BACKGROUND_SWITCH_ENABLED_KEY, enabled);
    localStorage.setItem(BACKGROUND_SWITCH_INTERVAL_KEY, intervalMinutes);
    
    // 更新开关状态
    const backgroundToggle = document.getElementById('background-toggle');
    if (backgroundToggle) {
        backgroundToggle.checked = enabled;
    }
    
    // 更新间隔显示
    const intervalValue = document.getElementById('interval-value');
    if (intervalValue) {
        intervalValue.textContent = `${intervalMinutes}分钟`;
    }
    
    // 重新设置定时器
    resetBackgroundSwitchTimer();
}

/**
 * 重置背景切换定时器
 */
function resetBackgroundSwitchTimer() {
    // 清除现有定时器
    if (backgroundSwitchInterval) {
        clearInterval(backgroundSwitchInterval);
        backgroundSwitchInterval = null;
    }
    
    // 如果启用了自动切换且在当前时钟模式下
    if (backgroundSwitchEnabled && document.body.classList.contains('clock-mode')) {
        // 立即加载一次背景图片
        loadBackgroundImage();
        
        // 设置新的定时器
        const intervalMs = backgroundSwitchIntervalMinutes * 60 * 1000;
        backgroundSwitchInterval = setInterval(() => {
            console.log(`切换背景图片... (${backgroundSwitchIntervalMinutes}分钟间隔)`);
            loadBackgroundImage();
        }, intervalMs);
        
        //console.log(`背景图片自动切换已启用，间隔：${backgroundSwitchIntervalMinutes}分钟`);
    } else {
        console.log('背景图片自动切换已禁用');
    }
}

/**
 * 从localStorage加载遮罩透明度设置
 */
function loadClockOverlayOpacity() {
    const savedOpacity = localStorage.getItem(CLOCK_OVERLAY_OPACITY_KEY);
    if (savedOpacity !== null) {
        clockOverlayOpacity = parseInt(savedOpacity);
    }
    
    // 加载遮罩开关状态
    const savedEnabled = localStorage.getItem(CLOCK_OVERLAY_ENABLED_KEY);
    if (savedEnabled !== null) {
        clockOverlayEnabled = savedEnabled === 'true';
    }
    
    // 更新滑块值
    const opacitySlider = document.getElementById('opacity-slider');
    if (opacitySlider) {
        opacitySlider.value = clockOverlayOpacity;
    }
    
    // 更新开关状态
    const overlayToggle = document.getElementById('overlay-toggle');
    if (overlayToggle) {
        overlayToggle.checked = clockOverlayEnabled;
    }
    
    // 应用透明度和显示状态
    updateClockOverlayOpacity(clockOverlayOpacity);
    updateOverlayVisibility(clockOverlayEnabled);
}

/**
 * 从localStorage加载背景切换设置
 */
function loadBackgroundSwitchSettings() {
    // 加载背景切换开关状态
    const savedSwitchEnabled = localStorage.getItem(BACKGROUND_SWITCH_ENABLED_KEY);
    if (savedSwitchEnabled !== null) {
        backgroundSwitchEnabled = savedSwitchEnabled === 'true';
    }
    
    // 加载切换间隔设置
    const savedInterval = localStorage.getItem(BACKGROUND_SWITCH_INTERVAL_KEY);
    if (savedInterval !== null) {
        backgroundSwitchIntervalMinutes = parseInt(savedInterval);
    }
    
    // 更新UI状态
    const backgroundToggle = document.getElementById('background-toggle');
    if (backgroundToggle) {
        backgroundToggle.checked = backgroundSwitchEnabled;
    }
    
    const intervalSlider = document.getElementById('interval-slider');
    if (intervalSlider) {
        intervalSlider.value = backgroundSwitchIntervalMinutes;
    }
    
    const intervalValue = document.getElementById('interval-value');
    if (intervalValue) {
        intervalValue.textContent = `${backgroundSwitchIntervalMinutes}分钟`;
    }
}

function typeWriter(text, element, speed = 100) {
    let i = 0;
    element.textContent = '';
    element.classList.add('typing');
    
    function typeChar() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeChar, speed);
        } else {
            // 打字完成，停止光标闪动
            element.classList.remove('typing');
            element.classList.add('finished');
            
            // 打字完成后显示副标题
            setTimeout(() => {
                const subtitle = document.getElementById('subtitle');
                subtitle.classList.remove('hidden');
                setTimeout(() => {
                    subtitle.classList.add('visible');
                }, 50);
            }, 500);
        }
    }
    
    typeChar();
}

/**
 * 数字时钟更新函数
 */
function updateClock() {
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
function toggleClockMode() {
    const body = document.body;
    const digitalClock = document.getElementById('digital-clock');
    const clockToggle = document.getElementById('clock-toggle');
    const mainContent = document.querySelector('.main-content');
    const footer = document.querySelector('.footer');
    const urlTip = document.getElementById('url-mode-tip');
    
    if (body.classList.contains('clock-mode')) {
        // 退出时钟模式
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
        
        // 清除背景图片切换定时器
        if (backgroundSwitchInterval) {
            clearInterval(backgroundSwitchInterval);
            backgroundSwitchInterval = null;
        }
        
        // 隐藏URL模式提示
        if (urlTip) {
            urlTip.classList.add('hidden');
        }
        
        // 恢复原始标题
        const currentLang = getUserLanguage();
        document.title = translations[currentLang].pageTitle;
    } else {
        // 进入时钟模式
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
            
            // 立即加载一次背景图片
            loadBackgroundImage();
            
            // 启动背景图片切换定时器（根据设置的时间间隔）
            resetBackgroundSwitchTimer();
            
            // 加载并应用遮罩透明度设置
            loadClockOverlayOpacity();
        }, 300);
        
        // 更改网页标题为"网页时钟"
        document.title = '网页时钟';
    }
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
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
    

    
    // 监听ESC键退出时钟模式
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && document.body.classList.contains('clock-mode')) {
            toggleClockMode();
        }
    });
    
    // 优化图片加载
    optimizeImageLoading();
    
    // 加载背景图片
    loadBackgroundImage();
    
    // 检查是否已经在时钟模式（比如页面刷新时）
        if (document.body.classList.contains('clock-mode')) {
            // 如果已经在时钟模式，根据设置启动背景图片切换定时器
            resetBackgroundSwitchTimer();
            
            // 加载遮罩透明度设置
            loadClockOverlayOpacity();
        }
        
        // 加载背景切换设置
        loadBackgroundSwitchSettings();
        
        // 绑定背景切换设置事件
        const backgroundToggle = document.getElementById('background-toggle');
        const intervalSlider = document.getElementById('interval-slider');
        
        if (backgroundToggle) {
            backgroundToggle.addEventListener('change', function() {
                updateBackgroundSwitchSettings(this.checked, backgroundSwitchIntervalMinutes);
            });
        }
        
        if (intervalSlider) {
            intervalSlider.addEventListener('input', function() {
                const minutes = parseInt(this.value);
                updateBackgroundSwitchSettings(backgroundSwitchEnabled, minutes);
            });
        }
    window.addEventListener('resize', function() {
        // 可以在这里添加响应式处理的逻辑
    });
});

/**
 * 页面可见性变化处理
 * 当页面从后台切换到前台时重新检查图片
 * 如果在时钟模式下，重新启动背景图片切换定时器
 */
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const backgroundImage = document.getElementById('background-image');
        if (!backgroundImage.src || backgroundImage.src === '') {
            loadBackgroundImage();
        }
        
        // 如果在时钟模式下且定时器未运行，重新启动定时器
        if (document.body.classList.contains('clock-mode') && !backgroundSwitchInterval) {
            backgroundSwitchInterval = setInterval(() => {
                console.log('切换背景图片...');
                loadBackgroundImage();
            }, BACKGROUND_SWITCH_INTERVAL);
            
            // 重新加载遮罩透明度设置
            loadClockOverlayOpacity();
        }
    } else {
        // 页面进入后台时，清除背景图片切换定时器以节省资源
        if (backgroundSwitchInterval) {
            clearInterval(backgroundSwitchInterval);
            backgroundSwitchInterval = null;
        }
    }
});