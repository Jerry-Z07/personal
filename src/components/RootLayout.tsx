import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

/**
 * 路由切换时自动回到页面顶部。
 */
function ScrollToTop(): null {
  const location = useLocation()

  useEffect(() => {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    } catch {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return null
}

/**
 * 路由根布局：负责统一的滚动恢复逻辑。
 */
export default function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}
