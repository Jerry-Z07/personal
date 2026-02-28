import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RootLayout from './components/RootLayout'
import './index.css'

// 路由级别的代码分割 - 动态导入
const App = lazy(() => import('./App'))

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{ path: '/', element: <App /> }],
  },
])

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('未找到根节点 #root')
}

createRoot(rootElement).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        </div>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>,
)
