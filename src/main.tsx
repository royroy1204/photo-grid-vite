import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// 引入 Cropper CSS，從 public 資料夾
import '/cropper.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
