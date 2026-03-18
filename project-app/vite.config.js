import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true,  // ← 추가 (F5 새로고침 문제 해결)
    proxy: {
      '/api/chat': 'http://localhost:3001',
      '/api': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080',
      // '/img': 'http://localhost:8080',
      '/noticeup/': 'http://localhost:8080',
      '/noticedelete': 'http://localhost:8080',  
      // '/pet': 'http://localhost:8080',
    }
  }
})