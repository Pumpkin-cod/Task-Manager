import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    port: 5173,
    open: true, // Automatically open browser
    cors: true,
    proxy: {
      '/api': {
        target: 'https://4b1itcns0i.execute-api.eu-west-1.amazonaws.com/tasks',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
