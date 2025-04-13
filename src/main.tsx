// 首先導入 React 修復文件確保模塊兼容性
import './react-fix.js';

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
// 不直接引入 public 目錄中的文件
import App from './App.tsx'

// 全局共享 React 實例，確保 ESM/CJS 相容性
if (typeof window !== 'undefined') {
  window.React = React;
}

// 嘗試使用 CDN 導入的全局 React
// 確保即使模塊導入失敗，頁面仍然可以顯示

// 聲明 window 上的 React 和 ReactDOM 類型，避免 TypeScript 錯誤
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
  }
}

(() => {
  try {
    console.log('[應用初始化] 開始載入應用');
    
    const startApp = () => {
      try {
        // 獲取 root 元素
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          throw new Error('找不到 root 元素');
        }
        
        // 嘗試獲取全局 React 和 ReactDOM 對象
        const React = window.React;
        const ReactDOM = window.ReactDOM;
        
        if (!React || !ReactDOM) {
          throw new Error('React 或 ReactDOM 未定義');
        }
        
        // 清除載入指示器
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
          loadingContainer.style.display = 'none';
        }
        
        // 創建一個簡單的 App 組件
        const SimpleApp = () => {
          return React.createElement('div', { className: 'app-container' }, 
            React.createElement('h1', null, 'SLAVIA｜PHOTO GRID APP'),
            React.createElement('p', null, '正在加載照片網格應用...')
          );
        };
        
        try {
          // 嘗試使用 React 18 的方式渲染
          if (ReactDOM.createRoot) {
            const root = ReactDOM.createRoot(rootElement);
            root.render(React.createElement(SimpleApp));
            console.log('[應用初始化] 使用 React 18 createRoot 成功');
          } else {
            // 備用方案: 使用舊版 React 方式渲染
            ReactDOM.render(React.createElement(SimpleApp), rootElement);
            console.log('[應用初始化] 使用 React 舊版 render 成功');
          }
          
          // 告訴用戶頁面加載中
          setTimeout(() => {
            // 導入真正的應用
            import('./App.tsx').then(({ default: App }) => {
              try {
                if (ReactDOM.createRoot) {
                  const root = ReactDOM.createRoot(rootElement);
                  root.render(React.createElement(React.StrictMode, null, React.createElement(App)));
                } else {
                  ReactDOM.render(React.createElement(React.StrictMode, null, React.createElement(App)), rootElement);
                }
                console.log('[應用初始化] 完整應用載入成功');
              } catch (appError: any) {
                console.error('[應用初始化] 載入完整應用時發生錯誤:', appError);
                showError('載入完整應用時發生錯誤: ' + (appError?.message || '未知錯誤'));
              }
            }).catch(importError => {
              console.error('[應用初始化] 導入 App 時發生錯誤:', importError);
              showError('無法導入應用: ' + (importError?.message || '未知錯誤'));
            });
          }, 100);
        } catch (renderError: any) {
          console.error('[應用初始化] 渲染時發生錯誤:', renderError);
          showError('渲染應用時發生錯誤: ' + (renderError?.message || '未知錯誤'));
        }
      } catch (error: any) {
        console.error('[應用初始化] 初始化應用時發生錯誤:', error);
        showError('初始化應用時發生錯誤: ' + (error?.message || '未知錯誤'));
      }
    };
    
    // 顯示錯誤信息
    const showError = (message: string) => {
      const errorContainer = document.getElementById('error-container');
      const errorDetails = document.getElementById('error-details');
      const loadingContainer = document.getElementById('loading-container');
      
      if (errorContainer) {
        errorContainer.style.display = 'block';
      }
      
      if (errorDetails) {
        errorDetails.textContent = message;
      }
      
      if (loadingContainer) {
        loadingContainer.style.display = 'none';
      }
    };
    
    // 等待文檔加載完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startApp);
    } else {
      startApp();
    }
  } catch (criticalError: any) {
    console.error('[嚴重錯誤] 啟動應用時發生嚴重錯誤:', criticalError);
    // 嘗試顯示錯誤信息
    try {
      const errorContainer = document.getElementById('error-container');
      const errorDetails = document.getElementById('error-details');
      const loadingContainer = document.getElementById('loading-container');
      
      if (errorContainer) {
        errorContainer.style.display = 'block';
      }
      
      if (errorDetails) {
        errorDetails.textContent = '啟動應用時發生嚴重錯誤: ' + (criticalError?.message || '未知錯誤');
      }
      
      if (loadingContainer) {
        loadingContainer.style.display = 'none';
      }
    } catch (e) {
      // 最後的嘗試：如果一切都失敗了，直接寫入文檔
      document.body.innerHTML = '<div style="color: red; padding: 20px;"><h1>應用程序無法啟動</h1><p>發生了嚴重錯誤。請刷新頁面或聯繫支持。</p></div>';
    }
  }
})();
