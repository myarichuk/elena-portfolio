import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: change "elena-portfolio" → your repo name
export default defineConfig({
  plugins: [react()],
  base: '/elena-portfolio/', 
})
