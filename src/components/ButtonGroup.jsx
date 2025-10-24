import { motion } from 'framer-motion';
import { AnimatedButton } from './AnimatedButton.jsx';

/**
 * 按钮组组件 - 封装按钮列表的渲染逻辑
 */
export const ButtonGroup = ({ 
  buttons, 
  className = '', 
  delay = 0.5,
  stagger = 0.1,
  direction = 'row',
  justify = 'center',
  align = 'center',
  gap = '1rem'
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      style={{ marginTop: '2rem' }}
      className={className}
    >
      <motion.div 
        style={{ 
          display: 'flex', 
          flexDirection: direction, 
          gap,
          justifyContent: justify,
          alignItems: align,
          flexWrap: 'wrap'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.4 }}
      >
        {buttons.map((button, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: delay + (index * stagger),
              duration: 0.5,
              ease: 'easeOut'
            }}
          >
            <AnimatedButton
              variant={button.variant}
              size={button.size || 'medium'}
              href={button.href}
              target={button.target}
              icon={button.icon}
              onClick={button.onClick}
            >
              {button.text}
            </AnimatedButton>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ButtonGroup;