import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'

const MotionDiv = motion.div

interface MousePosition {
  x: number
  y: number
}

interface CanvasSpotlightProps {
  hostRef: MutableRefObject<HTMLDivElement | null>
  mousePositionRef: MutableRefObject<MousePosition>
  isHovering: boolean
  forceWhiteOverlay: boolean
  spotlightColor?: string
}

/**
 * CanvasSpotlight 组件
 * 负责绘制高性能、细腻的鼠标跟随光效。
 */
function CanvasSpotlight({
  hostRef,
  mousePositionRef,
  isHovering,
  forceWhiteOverlay,
  spotlightColor,
}: CanvasSpotlightProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = hostRef.current
    if (!canvas || !host) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.error('获取 Canvas 2D 上下文失败')
      return
    }

    if (!isHovering) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotionQuery.matches) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    let animationFrameId = 0
    let width = 0
    let height = 0

    // 仅在尺寸发生变化时重设画布，降低布局读取与重绘开销。
    const syncCanvasSize = (): void => {
      const rect = host.getBoundingClientRect()
      const nextWidth = Math.max(1, Math.round(rect.width))
      const nextHeight = Math.max(1, Math.round(rect.height))
      if (nextWidth === width && nextHeight === height) {
        return
      }

      const dpr = window.devicePixelRatio || 1
      width = nextWidth
      height = nextHeight
      canvas.width = Math.max(1, Math.round(nextWidth * dpr))
      canvas.height = Math.max(1, Math.round(nextHeight * dpr))
      canvas.style.width = `${nextWidth}px`
      canvas.style.height = `${nextHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const clearCanvas = (): void => {
      if (width <= 0 || height <= 0) {
        return
      }
      ctx.clearRect(0, 0, width, height)
    }

    const render = (): void => {
      if (!isHovering) {
        clearCanvas()
        return
      }

      clearCanvas()

      // 检测暗色模式（通过 html 标签上的 class="dark" 控制）。
      const isDark = document.documentElement.classList.contains('dark')

      // 深色模式或强制白光时，使用发光模式；浅色模式用阴影模式。
      const useLightEffect = isDark || forceWhiteOverlay
      ctx.globalCompositeOperation = useLightEffect ? 'lighter' : 'multiply'

      const colorRgb = spotlightColor || (useLightEffect ? '255, 255, 255' : '100, 100, 110')
      const opacityMultiplier = forceWhiteOverlay ? 0.8 : 1
      const { x, y } = mousePositionRef.current

      // 层级 A：广域氛围光。
      const radiusHalo = 300
      const alphaHalo = (useLightEffect ? 0.08 : 0.04) * opacityMultiplier
      const haloGradient = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radiusHalo,
      )
      haloGradient.addColorStop(0, `rgba(${colorRgb}, ${alphaHalo})`)
      haloGradient.addColorStop(0.5, `rgba(${colorRgb}, ${alphaHalo * 0.5})`)
      haloGradient.addColorStop(1, `rgba(${colorRgb}, 0)`)
      ctx.fillStyle = haloGradient
      ctx.fillRect(0, 0, width, height)

      // 层级 B：核心聚焦光。
      const radiusCore = 100
      const alphaCore = (useLightEffect ? 0.15 : 0.08) * opacityMultiplier
      const coreGradient = ctx.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radiusCore,
      )
      coreGradient.addColorStop(0, `rgba(${colorRgb}, ${alphaCore})`)
      coreGradient.addColorStop(1, `rgba(${colorRgb}, 0)`)
      ctx.fillStyle = coreGradient
      ctx.fillRect(0, 0, width, height)

      animationFrameId = requestAnimationFrame(render)
    }

    syncCanvasSize()

    let resizeObserver: ResizeObserver | null = null
    let useWindowResizeFallback = false
    try {
      resizeObserver = new ResizeObserver(() => {
        syncCanvasSize()
      })
      resizeObserver.observe(host)
    } catch (error) {
      useWindowResizeFallback = true
      console.error('注册 ResizeObserver 失败，回退到 window.resize 监听:', error)
      window.addEventListener('resize', syncCanvasSize)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      if (useWindowResizeFallback) {
        window.removeEventListener('resize', syncCanvasSize)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      clearCanvas()
    }
  }, [forceWhiteOverlay, hostRef, isHovering, mousePositionRef, spotlightColor])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-500 ease-in-out card-spotlight-canvas',
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
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const cardRectRef = useRef<DOMRect | null>(null)
  const pendingPointerRef = useRef<{ clientX: number; clientY: number } | null>(null)
  const pointerFrameRef = useRef<number | null>(null)

  const cancelPendingPointerFrame = useCallback((): void => {
    if (pointerFrameRef.current === null) {
      return
    }
    cancelAnimationFrame(pointerFrameRef.current)
    pointerFrameRef.current = null
  }, [])

  const updateCardRect = useCallback((): DOMRect | null => {
    if (!cardRef.current) {
      return null
    }
    const rect = cardRef.current.getBoundingClientRect()
    cardRectRef.current = rect
    return rect
  }, [])

  const syncMousePosition = useCallback(
    (clientX: number, clientY: number): void => {
      let rect = cardRectRef.current
      if (!rect) {
        rect = updateCardRect()
      }
      if (!rect) {
        return
      }
      mousePositionRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }
    },
    [updateCardRect],
  )

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      if (event.pointerType === 'touch') {
        return
      }
      updateCardRect()
      syncMousePosition(event.clientX, event.clientY)
      setIsHovering(true)
    },
    [syncMousePosition, updateCardRect],
  )

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      if (!isHovering || event.pointerType === 'touch') {
        return
      }

      pendingPointerRef.current = { clientX: event.clientX, clientY: event.clientY }
      if (pointerFrameRef.current !== null) {
        return
      }

      pointerFrameRef.current = requestAnimationFrame(() => {
        pointerFrameRef.current = null
        const pendingPointer = pendingPointerRef.current
        if (!pendingPointer) {
          return
        }
        syncMousePosition(pendingPointer.clientX, pendingPointer.clientY)
      })
    },
    [isHovering, syncMousePosition],
  )

  const handlePointerLeave = useCallback((): void => {
    pendingPointerRef.current = null
    cancelPendingPointerFrame()
    setIsHovering(false)
  }, [cancelPendingPointerFrame])

  useEffect(() => {
    return () => {
      cancelPendingPointerFrame()
    }
  }, [cancelPendingPointerFrame])

  useEffect(() => {
    if (!isHovering) {
      return
    }

    const refreshRect = (): void => {
      updateCardRect()
    }

    window.addEventListener('resize', refreshRect, { passive: true })
    window.addEventListener('scroll', refreshRect, { capture: true, passive: true })

    return () => {
      window.removeEventListener('resize', refreshRect)
      window.removeEventListener('scroll', refreshRect, { capture: true })
    }
  }, [isHovering, updateCardRect])

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
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
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
        hostRef={cardRef}
        mousePositionRef={mousePositionRef}
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
