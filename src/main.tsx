import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
// 不直接引入 public 目錄中的文件
import App from './App.tsx'

// 全局共享 React 實例，確保 ESM/CJS 相容性
if (typeof window !== 'undefined') {
  window.React = React;
}

const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
