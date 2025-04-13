import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// 不直接引入 public 目錄中的文件
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
