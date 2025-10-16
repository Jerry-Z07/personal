import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * Framer Motion打字机动画组件
 * 替代原有的CSS+JS打字机效果，提供更流畅的动画体验
 */
export const AnimatedText = ({ 
  text, 
  speed = 50, 
  className = '', 
  onComplete,
  cursor = true,
  cursorChar = '▊'
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(cursor);

  useEffect(() => {
    if (isInView && text) {
      startTyping();
    }
  }, [isInView, text]);

  const startTyping = async () => {
    setDisplayText('');
    setShowCursor(true);
    
    for (let i = 0; i <= text.length; i++) {
      setDisplayText(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    setShowCursor(false);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          style={{ marginLeft: '2px' }}
        >
          {cursorChar}
        </motion.span>
      )}
    </motion.div>
  );
};

/**
 * 打字机效果变体 - 支持多行文本
 */
export const AnimatedMultilineText = ({ 
  lines, 
  speed = 50, 
  lineDelay = 200,
  className = '',
  onComplete 
}) => {
  const [completedLines, setCompletedLines] = useState(0);

  const handleLineComplete = () => {
    setCompletedLines(prev => {
      const newCount = prev + 1;
      if (newCount === lines.length && onComplete) {
        onComplete();
      }
      return newCount;
    });
  };

  return (
    <div className={className}>
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: completedLines >= index ? 1 : 0,
            y: completedLines >= index ? 0 : 20
          }}
          transition={{ duration: 0.3 }}
        >
          {completedLines >= index && (
            <AnimatedText
              text={line}
              speed={speed}
              onComplete={() => {
                setTimeout(() => handleLineComplete(), lineDelay);
              }}
              cursor={index === lines.length - 1}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedText;