import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      // ✅ 챗봇만 Node.js 서버(3001)로 분기 - 반드시 /api 보다 위에 있어야 함
      '/api/chat': 'http://localhost:3001',

      // 기존 Spring Boot 프록시 (그대로 유지)
      '/api': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080',
      '/img': 'http://localhost:8080',
       '/noticeup/': 'http://localhost:8080',
      '/noticedelete': 'http://localhost:8080',  
    }
  }
})