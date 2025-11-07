import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'copy-redirects',
      closeBundle() {
        try {
          copyFileSync('public/_redirects', 'dist/_redirects')
        } catch (err) {
          console.warn('Could not copy _redirects:', err)
        }
      },
    },
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})