import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Option 1: If you need all environment variables (less secure)
  define: {
    'process.env': process.env
  },
  
  // Option 2: More secure - only expose specific variables
  // define: {
  //   'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  //   'process.env.VITE_APP_TITLE': JSON.stringify(process.env.VITE_APP_TITLE),
  //   // Add other VITE_ prefixed variables you need
  // },
  
  server: {
    port: 5173,
    open: true, // Automatically open browser
    cors: true,
    proxy: {
      '/api': {
        target: 'https://a2zz02gqz8.execute-api.eu-west-1.amazonaws.com/dev',
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
