import React, { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useLocation, Outlet } from 'react-router'
import './index.css'

// 路由级别的代码分割 - 动态导入
const App = React.lazy(() => import('./App.jsx'))
const Live = React.lazy(() => import('./pages/Live.jsx'))

function ScrollToTop() {
  const location = useLocation()
  useEffect(() => {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual'
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    } catch (_) {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])
  return null
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <App /> },
      { path: '/live', element: <Live /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <React.Suspense fallback={
      <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    }>
      <RouterProvider router={router} />
    </React.Suspense>
  </StrictMode>,
)
