import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingMask.css';

const LoadingMask = ({ isVisible, onHide }) => {
  const [shouldShow, setShouldShow] = useState(isVisible);

  // 5秒超时机制
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (shouldShow) {
        setShouldShow(false);
        onHide();
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [shouldShow, onHide]);

  // 当外部状态改变时更新内部状态
  useEffect(() => {
    if (isVisible !== shouldShow) {
      setShouldShow(isVisible);
    }
  }, [isVisible, shouldShow]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="loading-mask"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 3,
            transition: {
              duration: 0.8,
              ease: "easeInOut"
            }
          }}
          style={{
            transformOrigin: 'center center'
          }}
        >
          <motion.div 
            className="loading-content"
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: {
                duration: 0.6,
                ease: "easeInOut"
              }
            }}
          >
            <div className="loading-spinner"></div>
            <p className="loading-text">加载中</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingMask;