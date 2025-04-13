import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 確保在生產環境中使用相對路徑
  build: {
    cssCodeSplit: false, // 防止CSS被分割成多個文件
    rollupOptions: {
      output: {
        manualChunks: undefined, // 防止代碼分割
      },
    },
  }
})
