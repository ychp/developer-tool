import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
            if (id.includes('prettier')) {
              return 'vendor-prettier'
            }
            if (id.includes('xlsx')) {
              return 'vendor-xlsx'
            }
            if (id.includes('crypto-js')) {
              return 'vendor-crypto'
            }
            if (id.includes('js-yaml') || id.includes('yaml')) {
              return 'vendor-yaml'
            }
            if (id.includes('js-tiktoken') || id.includes('tiktoken')) {
              return 'vendor-tiktoken'
            }
            if (id.includes('lunar')) {
              return 'vendor-lunar'
            }
            if (id.includes('qrcode') || id.includes('qr-code') || id.includes('jsqr')) {
              return 'vendor-qr'
            }
            if (id.includes('diff')) {
              return 'vendor-diff'
            }
            if (id.includes('axios')) {
              return 'vendor-axios'
            }
            if (id.includes('dayjs')) {
              return 'vendor-dayjs'
            }
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false,
    target: 'esnext',
  },
})
