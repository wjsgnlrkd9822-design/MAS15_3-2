import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/logout': 'http://localhost:8080',
      '/join': 'http://localhost:8080',
      '/mypage': 'http://localhost:8080',
      '/admin': 'http://localhost:8080',
      '/noticelist': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080',
      '/img': 'http://localhost:8080',
      '/pet': 'http://localhost:8080',
    }
  }
})