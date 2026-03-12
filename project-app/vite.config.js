import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 plugins : [react(), tailwindcss()],
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
