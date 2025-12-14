import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), legacy()],
  build: {
    // 配置rollup选项进行代码分割优化
    rollupOptions: {
      output: {
        // 手动配置chunk分割策略
        manualChunks: {
          // React相关依赖单独打包
          'react-vendor': ['react', 'react-dom'],
          
          // React Router相关依赖单独打包
          'router-vendor': ['react-router'],
          
          // Framer Motion动画库单独打包
          'motion-vendor': ['framer-motion'],
          
          // Tailwind CSS工具函数
          'utility-vendor': ['clsx', 'tailwind-merge'],
          
          // UI组件和图标库
          'ui-vendor': [],
          
          // API和数据处理相关
          'data-vendor': []
        }
      }
    },
    
    // 调整chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
    
    // 启用源代码映射（生产环境可选择性启用）
    sourcemap: false,
    
    // 压缩选项优化
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console语句
        drop_debugger: true, // 移除debugger语句
      },
    },
  },
  
  // 依赖优化选项
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'framer-motion'
    ]
  }
})
