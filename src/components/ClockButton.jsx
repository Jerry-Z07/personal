import { motion } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton.jsx';

/**
 * 时钟按钮组件 - 封装时钟切换功能
 */
export const ClockButton = ({ position = 'top-right' }) => {
  const handleClockButtonClick = () => {
    window.location.href = 'clock.html';
  };

  // 根据位置设置样式
  const getPositionStyles = () => {
    switch (position) {
      case 'top-right':
        return {
          position: 'fixed',
          top: '20px',
          right: '20px'
        };
      case 'top-left':
        return {
          position: 'fixed',
          top: '20px',
          left: '20px'
        };
      case 'bottom-right':
        return {
          position: 'fixed',
          bottom: '20px',
          right: '20px'
        };
      case 'bottom-left':
        return {
          position: 'fixed',
          bottom: '20px',
          left: '20px'
        };
      default:
        return {
          position: 'fixed',
          top: '20px',
          right: '20px'
        };
    }
  };

  return (
    <motion.button
      className="clock-toggle-react"
      onClick={handleClockButtonClick}
      whileHover={{ 
        scale: 1.1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)'
      }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        rotate: [0, 360]
      }}
      transition={{ 
        delay: 2,
        duration: 0.8,
        rotate: {
          duration: 2,
          ease: "easeInOut"
        }
      }}
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        ...getPositionStyles()
      }}
      title="全屏时钟"
    >
      <i className="fas fa-clock"></i>
    </motion.button>
  );
};

export default ClockButton;