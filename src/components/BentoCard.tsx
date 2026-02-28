import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

const MotionDiv = motion.div

interface MousePosition {
  x: number
  y: number
}

interface CanvasSpotlightProps {
  mousePosition: MousePosition
  isHovering: boolean
  forceWhiteOverlay: boolean
  spotlightColor?: string
}

/**
 * CanvasSpotlight 组件
 * 负责绘制高性能、细腻的鼠标跟随光效。
 */
function CanvasSpotlight({
  mousePosition,
  isHovering,
  forceWhiteOverlay,
  spotlightColor,
}: CanvasSpotlightProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    // 调整 Canvas 尺寸以匹配父容器。
    const resizeCanvas = (): void => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationFrameId = 0

    const render = (): void => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 检测暗色模式（通过 html 标签上的 class="dark" 控制）。
      const isDark = document.documentElement.classList.contains('dark')

      // 深色模式或强制白光时，使用发光模式；浅色模式用阴影模式。
      const useLightEffect = isDark || forceWhiteOverlay
      ctx.globalCompositeOperation = useLightEffect ? 'lighter' : 'multiply'

      const colorRgb = spotlightColor || (useLightEffect ? '255, 255, 255' : '100, 100, 110')
      const opacityMultiplier = forceWhiteOverlay ? 0.8 : 1

      // 层级 A：广域氛围光。
      const radiusHalo = 300
      const alphaHalo = (useLightEffect ? 0.08 : 0.04) * opacityMultiplier
      const haloGradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        radiusHalo,
      )
      haloGradient.addColorStop(0, `rgba(${colorRgb}, ${alphaHalo})`)
      haloGradient.addColorStop(0.5, `rgba(${colorRgb}, ${alphaHalo * 0.5})`)
      haloGradient.addColorStop(1, `rgba(${colorRgb}, 0)`)
      ctx.fillStyle = haloGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // 层级 B：核心聚焦光。
      const radiusCore = 100
      const alphaCore = (useLightEffect ? 0.15 : 0.08) * opacityMultiplier
      const coreGradient = ctx.createRadialGradient(
        mousePosition.x,
        mousePosition.y,
        0,
        mousePosition.x,
        mousePosition.y,
        radiusCore,
      )
      coreGradient.addColorStop(0, `rgba(${colorRgb}, ${alphaCore})`)
      coreGradient.addColorStop(1, `rgba(${colorRgb}, 0)`)
      ctx.fillStyle = coreGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [mousePosition, forceWhiteOverlay, spotlightColor])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ease-in-out',
        isHovering ? 'opacity-100' : 'opacity-0',
      )}
    />
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  layoutId?: string
  forceWhiteOverlay?: boolean
  spotlightColor?: string
  delay?: number
}

/**
 * 通用 Bento 卡片组件。
 */
export default function BentoCard({
  children,
  className,
  onClick,
  layoutId,
  forceWhiteOverlay = false,
  spotlightColor,
  delay = 0,
}: BentoCardProps) {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
    if (!cardRef.current) {
      return
    }
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  return (
    <MotionDiv
      ref={cardRef}
      layoutId={layoutId}
      onClick={onClick}
      initial={{ opacity: 1, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        type: 'spring',
        stiffness: 120,
        damping: 22,
        layout: {
          type: 'spring',
          stiffness: 200,
          damping: 25,
          delay: 0,
        },
      }}
      whileHover={{
        scale: onClick ? 1.02 : 1,
        transition: {
          duration: 0.2,
          type: 'tween',
          ease: 'easeInOut',
        },
      }}
      whileTap={{
        scale: 0.98,
        transition: {
          duration: 0.1,
          type: 'tween',
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={cn(
        'group relative overflow-hidden rounded-3xl p-6 flex flex-col',
        'bg-white/60 dark:bg-zinc-900/60',
        'border border-gray-200/50 dark:border-white/10',
        'shadow-sm hover:shadow-xl transition-shadow duration-300',
        'backdrop-blur-md',
        'cursor-default',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {/* 1. Canvas 光效层（最底层） */}
      <CanvasSpotlight
        mousePosition={mousePosition}
        isHovering={isHovering}
        forceWhiteOverlay={forceWhiteOverlay}
        spotlightColor={spotlightColor}
      />

      {/* 2. 静态高光层（中间层） */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 dark:from-white/5" />

      {/* 3. 内容层（最顶层） */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </MotionDiv>
  )
}
