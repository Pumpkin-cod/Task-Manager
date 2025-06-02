import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // Required for correct asset loading on Amplify
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})


