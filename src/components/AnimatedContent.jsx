import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './AnimatedContent.css';

/**
 * AnimatedContent - 通用内容动画组件
 * 提供统一的动画配置和布局，减少重复的动画代码
 * 
 * @param {Object} props - 组件属性
 * @param {string} props.title - 页面标题
 * @param {React.ReactNode} props.children - 子组件内容
 * @param {string} props.titleKey - i18n翻译键，用于动态获取标题
 * @param {Object} props.customVariants - 自定义动画变体
 * @param {Object} props.motionProps - 自定义motion属性
 */
const AnimatedContent = ({ 
  children, 
  title, 
  titleKey, 
  customVariants,
  motionProps = {},
  className = '',
  ...rest 
}) => {
  const { t } = useTranslation();
  
  // 默认动画变体 - 可以被自定义覆盖
  const defaultVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 }
  };
  
  // 合并默认和自定义变体
  const variants = customVariants || defaultVariants;
  
  // 默认motion属性 - 可以被自定义覆盖
  const defaultMotionProps = {
    className: `content-block ${className}`,
    initial: "hidden",
    animate: "visible",
    variants,
    transition: { duration: 0.5, ease: "easeOut" },
    ...motionProps
  };

  return (
    <motion.div {...defaultMotionProps} {...rest}>
      {/* 渲染标题 - 支持静态标题或i18n键 */}
      {title || titleKey ? (
        <h2 className="content-block-title">
          {titleKey ? t(titleKey) : title}
        </h2>
      ) : null}
      
      {/* 渲染内容 */}
      <div className="content-block-body">
        {children}
      </div>
    </motion.div>
  );
};

export default AnimatedContent;