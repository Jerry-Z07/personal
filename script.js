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

// 全局函数暴露已移除 - React应用已接管所有功能

// 遗留初始化逻辑已移除 - React应用已接管初始化