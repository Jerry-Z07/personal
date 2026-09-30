import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { motion } from 'framer-motion'
import { cn } from '../utils/cn'
import { CARD_ENTRANCE_TRANSITION, MICRO_INTERACTION_TRANSITION } from './motionPresets'

const MotionDiv = motion.div

// 全局只创建一次「减弱动态效果」查询，用于把边缘高光退化为静态镜面高光。
let reduceMotionQuery: MediaQueryList | null = null

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  if (!reduceMotionQuery) {
    reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  }
  return reduceMotionQuery.matches
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  layoutId?: string
  // 边缘高光颜色（"r, g, b"）：让光效呼应卡片自身的品牌色。
  rimColor?: string
  delay?: number
}

/**
 * 通用 Bento 卡片组件。
 *
 * 悬停反馈参考 Liquid Glass 的分层思路：磨砂底 + 静态高光 + 沿边缘游走的镜面高光。
 * 光只作用在 1px 的圆角边框环上、卡面保持通透——早期版本在卡面上打了一层大范围的
 * 面光源，观感既像手电筒又覆盖面过大，层的位置错了，强度再调也没用。
 */
export default function BentoCard({
  children,
  className,
  onClick,
  layoutId,
  rimColor,
  delay = 0,
}: BentoCardProps) {
  const [isHovering, setIsHovering] = useState<boolean>(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const rimRef = useRef<HTMLDivElement | null>(null)
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

  /**
   * 把指针的视口坐标换算成卡片内坐标，写到 CSS 变量上驱动边缘高光。
   * 开启「减弱动态效果」时直接返回，光会停在 CSS 里预设的顶边位置，
   * 退化成一道静态镜面高光。
   */
  const updateRimPosition = useCallback(
    (clientX: number, clientY: number): void => {
      const rim = rimRef.current
      if (!rim || prefersReducedMotion()) {
        return
      }

      const rect = cardRectRef.current ?? updateCardRect()
      if (!rect) {
        return
      }

      rim.style.setProperty('--rim-x', `${clientX - rect.left}px`)
      rim.style.setProperty('--rim-y', `${clientY - rect.top}px`)
    },
    [updateCardRect],
  )

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLDivElement>): void => {
      if (event.pointerType === 'touch') {
        return
      }
      updateCardRect()
      updateRimPosition(event.clientX, event.clientY)
      setIsHovering(true)
    },
    [updateCardRect, updateRimPosition],
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

      // 一帧内最多写一次样式，避免高频 pointermove 下的重复样式计算。
      pointerFrameRef.current = requestAnimationFrame(() => {
        pointerFrameRef.current = null
        const pendingPointer = pendingPointerRef.current
        if (!pendingPointer) {
          return
        }
        updateRimPosition(pendingPointer.clientX, pendingPointer.clientY)
      })
    },
    [isHovering, updateRimPosition],
  )

  const handlePointerLeave = useCallback((): void => {
    cancelPendingPointerFrame()
    setIsHovering(false)
  }, [cancelPendingPointerFrame])

  useEffect(() => {
    return () => {
      cancelPendingPointerFrame()
    }
  }, [cancelPendingPointerFrame])

  // 滚动 / 尺寸变化后卡片位置变了，需要用最近一次指针坐标重新换算边缘光位置。
  useEffect(() => {
    if (!isHovering) {
      return
    }

    const refreshRim = (): void => {
      updateCardRect()
      const pendingPointer = pendingPointerRef.current
      if (pendingPointer) {
        updateRimPosition(pendingPointer.clientX, pendingPointer.clientY)
      }
    }

    window.addEventListener('resize', refreshRim, { passive: true })
    window.addEventListener('scroll', refreshRim, { capture: true, passive: true })

    return () => {
      window.removeEventListener('resize', refreshRim)
      window.removeEventListener('scroll', refreshRim, { capture: true })
    }
  }, [isHovering, updateCardRect, updateRimPosition])

  return (
    <MotionDiv
      ref={cardRef}
      layoutId={layoutId}
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...CARD_ENTRANCE_TRANSITION,
        delay,
        // 卡片展开成弹窗时仍用弹簧，保证形变连贯。
        layout: {
          type: 'spring',
          stiffness: 220,
          damping: 28,
          delay: 0,
        },
      }}
      whileHover={{
        // 用统一的像素位移而非 scale：scale 是相对值，2 列宽的卡片会比 1 列宽的多涨一倍，
        // 视觉上就是“两张卡抬升高度不一致”。位移不受卡片尺寸影响。
        y: onClick ? -3 : 0,
        transition: MICRO_INTERACTION_TRANSITION,
      }}
      whileTap={{
        // 按下反馈同样压到最小幅度，避免宽卡在按下瞬间收缩得更明显。
        scale: 0.99,
        transition: { ...MICRO_INTERACTION_TRANSITION, duration: 0.08 },
      }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      className={cn(
        'group relative overflow-hidden rounded-3xl p-6 flex flex-col',
        'bg-white/60 dark:bg-zinc-900/60',
        'border border-gray-200/50 dark:border-white/10',
        // 阴影保持即时切换：动 box-shadow 会触发重绘，抬升感交给 whileHover 的 transform 表达。
        'shadow-sm hover:shadow-lg',
        'backdrop-blur-md',
        'cursor-default',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {/* 1. 静态高光层：斜向的一层极淡白光，负责“玻璃”的底色质感 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 transition-opacity duration-200 ease-out group-hover:opacity-80 dark:from-white/5 dark:group-hover:opacity-100" />

      {/* 2. 边缘镜面高光层：光沿圆角边框游走，卡面保持通透 */}
      <div
        ref={rimRef}
        aria-hidden="true"
        style={rimColor ? ({ '--rim-rgb': rimColor } as CSSProperties) : undefined}
        className={cn(
          'card-rim-layer pointer-events-none absolute inset-0 rounded-3xl',
          // 品牌色卡片：颜色由内联 --rim-rgb 提供，高光强度改由该变体控制
          rimColor && 'card-rim-layer--brand',
          'transition-opacity duration-200 ease-out',
          isHovering ? 'opacity-100' : 'opacity-0',
        )}
      />

      {/* 3. 内容层（最顶层）：设为 flex 列，使调用方的 justify-between / mt-auto 生效 */}
      <div className="relative z-10 flex h-full w-full flex-col">{children}</div>
    </MotionDiv>
  )
}