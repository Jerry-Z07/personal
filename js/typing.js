/**
 * 打字机效果模块
 */

/**
 * 打字机效果函数
 */
export function typeWriter(text, element, speed = 100) {
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