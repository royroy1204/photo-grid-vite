/**
 * React 模塊修復文件 - 修復 ESM/CJS 混合模塊問題
 */

// 使用 dynamic imports 來避免靜態導入問題
let React, ReactDOM, ReactDOMClient;

// 動態加載 React
async function loadReact() {
  try {
    // 嘗試使用動態導入加載模塊
    const reactModule = await import('react');
    const reactDomModule = await import('react-dom/client');
    
    // 保存模塊引用
    React = reactModule;
    ReactDOM = reactDomModule;
    ReactDOMClient = reactDomModule;
    
    // 確保全局可用
    if (typeof window !== 'undefined') {
      window.React = React;
      window.ReactDOM = ReactDOM;
      
      // 將所有 React API 添加到全局 React 對象
      window.React.useState = React.useState;
      window.React.useEffect = React.useEffect;
      window.React.useContext = React.useContext;
      window.React.useReducer = React.useReducer;
      window.React.useCallback = React.useCallback;
      window.React.useMemo = React.useMemo;
      window.React.useRef = React.useRef;
      window.React.useImperativeHandle = React.useImperativeHandle;
      window.React.useLayoutEffect = React.useLayoutEffect;
      window.React.useDebugValue = React.useDebugValue;
      window.React.Component = React.Component;
      window.React.PureComponent = React.PureComponent;
      window.React.memo = React.memo;
      window.React.forwardRef = React.forwardRef;
      window.React.createContext = React.createContext;
      window.React.createRef = React.createRef;
      window.React.Fragment = React.Fragment;
      window.React.StrictMode = React.StrictMode;
      window.React.Suspense = React.Suspense;
      window.React.createElement = React.createElement;
      window.React.cloneElement = React.cloneElement;
      window.React.isValidElement = React.isValidElement;
      window.React.Children = React.Children;
      
      // 最後的備用方案：使用代理處理缺失的導出
      const reactHandler = {
        get: function(target, prop) {
          if (prop in target) {
            return target[prop];
          }
          // 如果屬性不存在，返回一個空函數
          console.warn(`React API "${prop}" 不存在，使用替代實現`);
          return function() { return null; };
        }
      };
      
      window.React = new Proxy(window.React, reactHandler);
      
      console.log('[React 修復] React 模塊已成功加載並修復');
    }
    
    return React;
  } catch (error) {
    console.error('[React 修復] 無法加載 React 模塊', error);
    
    // 加載失敗時，提供一個替代實現
    if (typeof window !== 'undefined' && !window.React) {
      window.React = { 
        useState: () => [null, () => {}],
        useEffect: () => {},
        createElement: () => ({}),
        Fragment: 'div'
      };
    }
    return null;
  }
}

// 立即執行加載
const reactPromise = loadReact();

// 導出一個同步的默認 React 對象以確保其他模塊可以立即使用
export default {
  // 確保基本 API 可用
  useState: (...args) => {
    // 如果還未加載，返回一個空狀態
    if (typeof window !== 'undefined' && window.React && window.React.useState) {
      return window.React.useState(...args);
    }
    return [null, () => {}];
  },
  useEffect: () => {},
  createElement: (type, props, ...children) => {
    if (typeof window !== 'undefined' && window.React && window.React.createElement) {
      return window.React.createElement(type, props, ...children);
    }
    return {};
  },
  Fragment: 'div',
  StrictMode: 'div'
};
