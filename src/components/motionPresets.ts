import type { MotionProps, Transition } from 'framer-motion'

/**
 * 统一动效预算。
 * 缓动曲线取 Material 3 的 standard：cubic-bezier(0.2, 0, 0, 1)；
 * 时长参考 M3 建议值：进入屏幕的元素 250~400ms，屏幕内的状态变化 300ms 以内。
 * 全站动画都应基于这里的常量，避免各组件各写一套时长导致观感不一致。
 */
export const MOTION_EASE_STANDARD: [number, number, number, number] = [0.2, 0, 0, 1]

// 卡片入场：只做小幅位移 + 淡入，避免大幅位移与缩放叠加带来的“重”感。
export const CARD_ENTRANCE_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.35,
  ease: MOTION_EASE_STANDARD,
}

// 悬停 / 按下等微观反馈：控制在 200ms 以内，保证手感干脆。
export const MICRO_INTERACTION_TRANSITION: Transition = {
  type: 'tween',
  duration: 0.15,
  ease: MOTION_EASE_STANDARD,
}

/**
 * 列表项（文章 / 视频）的公共动效预设。
 */
export const cardMotionPreset: MotionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  whileHover: { y: -3 },
  transition: MICRO_INTERACTION_TRANSITION,
}