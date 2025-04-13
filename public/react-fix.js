/**
 * 瀏覽器端的 React 修復腳本
 * 解決動態導入問題
 */

(function() {
  console.log('[React 修復] 初始化');
  
  // 確保全局 React 和 ReactDOM 對象存在
  if (typeof window !== 'undefined') {
    if (!window.React) {
      console.log('[React 修復] 創建全局 React 對象');
      window.React = {};
    }
    
    if (!window.ReactDOM) {
      console.log('[React 修復] 創建全局 ReactDOM 對象');
      window.ReactDOM = {};
    }
  }
  
  // 常用 React hooks 和 API 列表
  const reactHooks = [
    'useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 
    'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 
    'useDebugValue', 'useTransition', 'useDeferredValue', 'useId'
  ];
  
  const reactAPIs = [
    'createElement', 'Fragment', 'StrictMode', 'Component', 'PureComponent', 
    'memo', 'forwardRef', 'createContext', 'createRef', 'Children',
    'cloneElement', 'isValidElement', 'createFactory', 'Suspense'
  ];
  
  // 提供空實現
  const noop = function() { return null; };
  const noopArray = function() { return [null, function() {}]; };
  
  // 添加所有缺失的 React hooks
  reactHooks.forEach(function(hook) {
    if (!window.React[hook]) {
      console.log(`[React 修復] 添加缺失的 hook: ${hook}`);
      window.React[hook] = hook.includes('State') ? noopArray : noop;
    }
  });
  
  // 添加所有缺失的 React API
  reactAPIs.forEach(function(api) {
    if (!window.React[api]) {
      console.log(`[React 修復] 添加缺失的 API: ${api}`);
      if (api === 'Fragment' || api === 'StrictMode' || api === 'Suspense') {
        window.React[api] = 'div';
      } else {
        window.React[api] = noop;
      }
    }
  });
  
  // 添加 ReactDOM 方法
  if (!window.ReactDOM.render) {
    window.ReactDOM.render = function(element, container) {
      console.log('[React 修復] 使用替代 render 方法');
      if (container) {
        container.innerHTML = '組件無法渲染，請檢查控制台錯誤';
      }
      return null;
    };
  }
  
  if (!window.ReactDOM.createRoot) {
    window.ReactDOM.createRoot = function(container) {
      console.log('[React 修復] 使用替代 createRoot 方法');
      return {
        render: function(element) {
          if (container) {
            // 嘗試使用舊的 render 方法作為備用
            if (window.ReactDOM.render) {
              window.ReactDOM.render(element, container);
            } else {
              container.innerHTML = '組件無法渲染，請檢查控制台錯誤';
            }
          }
        }
      };
    };
  }
  
  // 移除載入中訊息
  setTimeout(function() {
    const loadingEl = document.getElementById('loading-container');
    if (loadingEl) {
      // 檢查是否已經有內容渲染
      const rootEl = document.getElementById('root');
      if (rootEl && rootEl.children && rootEl.children.length > 0) {
        loadingEl.style.display = 'none';
      } else {
        loadingEl.innerHTML = '應用程序載入中...<br>如長時間未顯示，請刷新頁面';
      }
    }
  }, 3000);
  
  console.log('[React 修復] 瀏覽器端修復腳本已完成');
})();
