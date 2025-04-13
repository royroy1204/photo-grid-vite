import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // 避免 JSX 運行時注入問題
      jsxRuntime: 'automatic',
    })
  ],
  base: './', // 確保在生產環境中使用相對路徑
  build: {
    cssCodeSplit: false, // 防止CSS被分割成多個文件
    rollupOptions: {
      output: {
        manualChunks: {
          // 將 React 相關代碼單獨打包
          vendor: ['react', 'react-dom'],
          // 其他依賴單獨打包
          deps: [
            'react-cropper',
            'react-dropzone',
            'react-icons',
            'react-beautiful-dnd'
          ]
        }
      },
    },
    // 避免 ESM/CJS 混合模塊問題
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    // 生成 sourcemap 以便調試問題
    sourcemap: true
  }
})
