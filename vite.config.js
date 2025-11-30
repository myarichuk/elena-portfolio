import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use repository subpath so assets resolve correctly on GitHub Pages
  base: '/',
})
