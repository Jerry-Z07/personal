import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将React相关库打包在一起
          'react-vendor': ['react', 'react-dom'],
          // 将i18n相关库打包
          'i18n': ['react-i18next', 'i18next'],
          // 将Fluent UI相关库打包在一起
          'fluent-ui': ['@fluentui/react', '@fluentui/react-components', '@fluentui/react-icons'],
          // 将动画库打包
          'animation': ['framer-motion']
        }
      }
    },
    // 调整chunk大小警告阈值到800KB
    chunkSizeWarningLimit: 800
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://uapis.cn',
        changeOrigin: true,
        rewrite: (path) => path
      },
      '/blog-feed': {
        target: 'https://blog.078465.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/blog-feed/, '/feed')
      }
    }
  }
})
