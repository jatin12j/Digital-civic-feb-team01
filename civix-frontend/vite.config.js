import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react', 'react-router-dom', 'react-toastify', '@react-oauth/google']
  },
  server: {
    force: true
  }
})
