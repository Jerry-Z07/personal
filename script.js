/**
 * 模块化重构后的主脚本文件
 * 保持向后兼容性
 */

// 导入所有模块功能
import { initialize } from './js/main.js';

// 为了保持向后兼容性，将一些函数暴露到全局作用域
import { toggleClockMode } from './js/clock.js';
import { loadBackgroundImage } from './js/background.js';
import { updateClockOverlayOpacity, updateOverlayVisibility } from './js/overlay.js';
// import { updateBackgroundSwitchSettings } from './js/overlay.js'; // 背景切换功能已移除
import { typeWriter } from './js/typing.js';
import { updateClock } from './js/clock.js';

// 将关键函数暴露到全局作用域以保持兼容性
window.toggleClockMode = toggleClockMode;
window.loadBackgroundImage = loadBackgroundImage;
window.updateClockOverlayOpacity = updateClockOverlayOpacity;
window.updateOverlayVisibility = updateOverlayVisibility;
// window.updateBackgroundSwitchSettings = updateBackgroundSwitchSettings; // 背景切换功能已移除
window.typeWriter = typeWriter;
window.updateClock = updateClock;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initialize);

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const backgroundImage = document.getElementById('background-image');
        if (!backgroundImage.src || backgroundImage.src === '') {
            loadBackgroundImage();
        }
        
        // 背景自动切换功能已移除，不再启动定时器
    } else {
        // 背景自动切换功能已移除，无需清理定时器
    }
});

// 窗口大小变化处理
window.addEventListener('resize', function() {
    // 可以在这里添加响应式处理的逻辑
});