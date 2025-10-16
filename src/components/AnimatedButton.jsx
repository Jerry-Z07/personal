import { motion } from 'framer-motion';

/**
 * Framer Motion动画按钮组件
 * 替代原有的CSS按钮动画，提供更丰富的交互效果
 */
export const AnimatedButton = ({
  children,
  className = '',
  variant = 'primary',
  size = 'medium',
  href,
  target,
  onClick,
  disabled = false,
  icon,
  ...props
}) => {
  // 按钮变体配置
  const variants = {
    primary: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: 'white',
      hover: {
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        scale: 1.05,
        y: -2
      },
      tap: {
        scale: 0.95,
        y: 0
      }
    },
    github: {
      background: 'rgba(36, 41, 47, 0.2)',
      border: '1px solid rgba(36, 41, 47, 0.3)',
      color: 'white',
      hover: {
        background: 'rgba(36, 41, 47, 0.3)',
        border: '1px solid rgba(36, 41, 47, 0.5)',
        scale: 1.05,
        y: -2
      },
      tap: {
        scale: 0.95,
        y: 0
      }
    },
    blog: {
      background: 'rgba(102, 204, 255, 0.2)',
      border: '1px solid rgba(102, 204, 255, 0.3)',
      color: 'white',
      hover: {
        background: 'rgba(102, 204, 255, 0.3)',
        border: '1px solid rgba(102, 204, 255, 0.5)',
        scale: 1.05,
        y: -2,
        boxShadow: '0 6px 25px rgba(102, 204, 255, 0.2)'
      },
      tap: {
        scale: 0.95,
        y: 0
      }
    },
    bilibili: {
      background: 'rgba(0, 161, 214, 0.2)',
      border: '1px solid rgba(0, 161, 214, 0.3)',
      color: 'white',
      hover: {
        background: 'rgba(0, 161, 214, 0.3)',
        border: '1px solid rgba(0, 161, 214, 0.5)',
        scale: 1.05,
        y: -2,
        boxShadow: '0 6px 25px rgba(0, 161, 214, 0.2)'
      },
      tap: {
        scale: 0.95,
        y: 0
      }
    }
  };

  // 尺寸配置
  const sizes = {
    small: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '6px'
    },
    medium: {
      padding: '12px 24px',
      fontSize: '16px',
      borderRadius: '8px'
    },
    large: {
      padding: '16px 32px',
      fontSize: '18px',
      borderRadius: '10px'
    }
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.medium;

  const ButtonContent = () => (
    <>
      {icon && (
        <motion.span
          className="btn-icon"
          style={{ marginRight: '8px' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {icon}
        </motion.span>
      )}
      {children}
    </>
  );

  const buttonProps = {
    className: `animated-btn ${className}`,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      backdropFilter: 'blur(15px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      fontWeight: '500',
      position: 'relative',
      overflow: 'hidden',
      ...currentSize,
      background: currentVariant.background,
      color: currentVariant.color,
      border: currentVariant.border
    },
    whileHover: disabled ? {} : currentVariant.hover,
    whileTap: disabled ? {} : currentVariant.tap,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25
    },
    onClick: disabled ? undefined : onClick,
    ...props
  };

  if (href) {
    return (
      <motion.a href={href} target={target} {...buttonProps}>
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button {...buttonProps}>
      <ButtonContent />
    </motion.button>
  );
};



export default AnimatedButton;