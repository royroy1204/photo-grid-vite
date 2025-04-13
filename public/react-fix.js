/**
 * 瀏覽器端的 React 修復腳本
 * 解決動態導入問題
 */

(function() {
  // 如果 React 在全局範圍中不可用，創建一個空對象
  if (typeof window !== 'undefined' && !window.React) {
    window.React = {};
  }

  // 如果 ReactDOM 在全局範圍中不可用，創建一個空對象
  if (typeof window !== 'undefined' && !window.ReactDOM) {
    window.ReactDOM = {};
  }

  // 確保這些方法在真正的 React 模塊加載前存在
  const noop = function() { return null; };
  const react = window.React;
  
  // 基本 React hooks
  ['useState', 'useEffect', 'useContext', 'useReducer', 'useCallback', 
   'useMemo', 'useRef', 'useImperativeHandle', 'useLayoutEffect', 
   'useDebugValue'].forEach(function(hook) {
    if (!react[hook]) react[hook] = noop;
  });
  
  // 基本 React 組件
  ['createElement', 'Fragment', 'StrictMode', 'Component', 'memo', 
   'forwardRef', 'createContext'].forEach(function(api) {
    if (!react[api]) react[api] = noop;
  });
  
  console.log('[React Fix] 瀏覽器端修復腳本已加載');
})();
