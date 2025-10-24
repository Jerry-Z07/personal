import { defineConfig } from 'vite'
import { resolve } from 'path'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 插件配置
  plugins: [
    react({
      // React插件配置
      jsxRuntime: 'automatic'
    }),
    legacy({
      // 设置目标浏览器
      targets: ['defaults', 'not IE 11'],
      // 为传统浏览器生成polyfills
      polyfills: ['es/global-this', 'es/promise'],
      // 生成现代和传统浏览器的双包
      modernPolyfills: ['es/global-this']
    })
  ],
  
  // 根目录配置
  root: '.',
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    host: true,
    cors: true
  },
  
  // 构建配置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  
  // 路径别名配置
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@js': resolve(__dirname, './js'),
      '@styles': resolve(__dirname, './styles'),
      '@img': resolve(__dirname, './img')
    }
  },
  
  // CSS配置
  css: {
    devSourcemap: true
  },
  
  // 优化配置
  optimizeDeps: {
    include: ['@fortawesome/fontawesome-free']
  }
})