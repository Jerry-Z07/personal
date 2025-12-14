import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 合并Tailwind类名的工具函数
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * CanvasSpotlight 组件
 * 负责绘制高性能、细腻的鼠标跟随光效
 */
const CanvasSpotlight = ({ 
  mousePosition, 
  isHovering, 
  forceWhiteOverlay,
  spotlightColor 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 调整 Canvas 尺寸以匹配父容器
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId;

    const render = () => {
      if (!ctx || !canvas) return;

      // 清除每一帧
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 检测暗色模式 (假设通过 html 标签上的 class="dark" 控制)
      const isDark = document.documentElement.classList.contains("dark");

      // --- 1. 确定渲染策略 ---
      // 如果是暗色模式，或者是深色背景强制开启白光模式，则使用“发光”逻辑
      const useLightEffect = isDark || forceWhiteOverlay;

      // --- 2. 设置混合模式 ---
      // lighter (加色混合): 适合深色背景，光叠加变亮，产生发光感
      // multiply (正片叠底): 适合浅色背景，光叠加变暗，产生阴影感
      ctx.globalCompositeOperation = useLightEffect ? "lighter" : "multiply";

      // --- 3. 确定光晕颜色 ---
      let colorRgb;
      if (spotlightColor) {
        // 如果用户指定了颜色 (例如 "190, 24, 93")，优先使用
        colorRgb = spotlightColor;
      } else {
        // 默认逻辑：
        // 发光模式 -> 纯白 (255, 255, 255)
        // 阴影模式 -> 蓝灰深色 (100, 100, 110) - 在白底上比纯黑更自然
        colorRgb = useLightEffect ? "255, 255, 255" : "100, 100, 110";
      }

      // --- 4. 透明度系数 ---
      // 如果强制开启了白光(通常意味着背景有色)，稍微降低透明度防止过曝
      const opacityMultiplier = forceWhiteOverlay ? 0.8 : 1;

      // --- 5. 绘制双层光效 ---
      
      // 层级 A: 广域氛围光 (Halo) - 半径大，极淡
      const radiusHalo = 300; 
      const alphaHalo = (useLightEffect ? 0.08 : 0.04) * opacityMultiplier;
      
      const haloGradient = ctx.createRadialGradient(
        mousePosition.x, mousePosition.y, 0,
        mousePosition.x, mousePosition.y, radiusHalo
      );
      haloGradient.addColorStop(0, `rgba(${colorRgb}, ${alphaHalo})`);
      haloGradient.addColorStop(0.5, `rgba(${colorRgb}, ${alphaHalo * 0.5})`);
      haloGradient.addColorStop(1, `rgba(${colorRgb}, 0)`);

      ctx.fillStyle = haloGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 层级 B: 核心聚焦光 (Core) - 半径小，较亮
      const radiusCore = 100;
      const alphaCore = (useLightEffect ? 0.15 : 0.08) * opacityMultiplier;

      const coreGradient = ctx.createRadialGradient(
        mousePosition.x, mousePosition.y, 0,
        mousePosition.x, mousePosition.y, radiusCore
      );
      coreGradient.addColorStop(0, `rgba(${colorRgb}, ${alphaCore})`);
      coreGradient.addColorStop(1, `rgba(${colorRgb}, 0)`);

      ctx.fillStyle = coreGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 循环调用
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition, forceWhiteOverlay, spotlightColor]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ease-in-out",
        // 通过 opacity 控制显隐
        isHovering ? "opacity-100" : "opacity-0"
      )}
    />
  );
};

const BentoCard = ({
  children,
  className,
  onClick,
  layoutId,
  // 新增属性：
  forceWhiteOverlay = false, // 为 true 时，强制使用亮光模式
  spotlightColor,            // 可选：自定义光晕颜色 RGB 字符串 (如 "59, 130, 246")
  delay = 0,                 // 可选：入场动画延迟时间 (秒)
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      layoutId={layoutId}
      onClick={onClick}
      
      // --- 入场动画优化（保留动画且避免不可见） ---
      initial={{ opacity: 1, y: 40, scale: 0.98 }} // 初始可见，仅位移+缩放
      animate={{ opacity: 1, y: 0, scale: 1 }}     // 回到正常位置
      transition={{
        duration: 0.6,
        delay: delay,
        type: "spring",
        stiffness: 120,
        damping: 22,
        layout: {
          type: "spring",
          stiffness: 200,
          damping: 25,
          delay: 0,
        }
      }}
      
      // --- 交互动画 ---
    whileHover={{ 
    scale: onClick ? 1.02 : 1.0,
    transition: {
      duration: 0.2,    
      type: "tween", 
      ease: "easeInOut"
    }
  }}
   whileTap={{ 
    scale: 0.98,
    transition: {
      duration: 0.1,  
      type: "tween"
    }
  }}
      
      // --- 事件监听 ---
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      
      className={cn(
        "group relative overflow-hidden rounded-3xl p-6 flex flex-col",
        "bg-white/60 dark:bg-zinc-900/60", // 默认背景色
        "border border-gray-200/50 dark:border-white/10",
        "shadow-sm hover:shadow-xl transition-shadow duration-300",
        "backdrop-blur-md",
        "cursor-default",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* 1. Canvas 光效层 (最底层) */}
      <CanvasSpotlight 
        mousePosition={mousePosition} 
        isHovering={isHovering} 
        forceWhiteOverlay={forceWhiteOverlay}
        spotlightColor={spotlightColor}
      />

      {/* 2. 静态高光层 (中间层) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 dark:from-white/5" />

      {/* 3. 内容层 (最顶层) */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.div>
  );
};

export default BentoCard;