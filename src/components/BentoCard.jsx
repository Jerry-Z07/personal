import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const BentoCard = ({ 
  children, 
  className, 
  onClick, 
  layoutId // 新增：用于弹窗动画的唯一ID 
}) => {
  return (
    <motion.div 
      layoutId={layoutId} // 关键：如果有ID，Framer Motion会自动处理从卡片到弹窗的形变 
      onClick={onClick} 
      initial={{ opacity: 0, scale: 0.9 }} 
      whileInView={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.4, type: "spring" }} 
      viewport={{ once: true }} 
      whileHover={{ scale: onClick ? 1.02 : 1.0 }} // 只有可点击的卡片才有缩放效果 
      whileTap={{ scale: 0.98 }} 
      className={cn( 
        "relative overflow-hidden rounded-3xl p-6 flex flex-col", 
        "bg-white/60 dark:bg-zinc-900/60", // 灰色调背景 
        "border border-gray-200/50 dark:border-white/10", 
        "shadow-sm hover:shadow-xl transition-shadow duration-300", 
        "backdrop-blur-md", // 亚克力模糊 
        "cursor-default", 
        onClick && "cursor-pointer", // 如果有点击事件，显示手型 
        className 
      )} 
    > 
      {/* 内部高光层 */} 
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 dark:from-white/5" /> 
      <div className="relative z-10 h-full w-full">{children}</div> 
    </motion.div>
  );
};

export default BentoCard;