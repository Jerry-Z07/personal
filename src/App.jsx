import { useState } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full"
      >
        {/* Framer Motion + Tailwind CSS 验证标题 */}
        <motion.h1 
          className="text-3xl font-bold text-center text-gray-800 mb-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          🚀 开发环境验证
        </motion.h1>
        
        <motion.p 
          className="text-gray-600 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Framer Motion + Tailwind CSS 已成功配置！
        </motion.p>

        {/* 计数器卡片 */}
        <motion.div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white text-center mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <h2 className="text-xl font-semibold mb-2">动画计数器</h2>
          <motion.div
            key={count}
            initial={{ scale: 1.2, color: "#fbbf24" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold"
          >
            {count}
          </motion.div>
        </motion.div>

        {/* 按钮组 */}
        <div className="flex gap-3 justify-center">
          <motion.button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCount(count + 1)}
          >
            +1
          </motion.button>
          
          <motion.button 
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCount(0)}
          >
            重置
          </motion.button>
        </div>

        {/* Tailwind CSS 实用类验证 */}
        <motion.div 
          className="mt-8 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-semibold text-gray-700 mb-2">✅ 已配置的库：</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Tailwind CSS v4.1.17</li>
            <li>• Framer Motion</li>
            <li>• Vite + React 19</li>
            <li>• PostCSS + Autoprefixer</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
