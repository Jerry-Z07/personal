import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://uapis.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/blog-feed': {
        target: 'https://blog.078465.xyz',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/blog-feed/, '/feed')
      }
    }
  }
})
