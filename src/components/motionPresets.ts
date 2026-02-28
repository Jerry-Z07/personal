import type { MotionProps } from 'framer-motion'

/**
 * Framer Motion 公共预设。
 */
export const cardMotionPreset: MotionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  whileHover: { y: -3 },
  transition: { duration: 0.1 },
}
