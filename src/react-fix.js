/**
 * React 模塊修復文件
 * 解決 React ESM/CJS 模塊不兼容問題
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as ReactDOMClient from 'react-dom/client';

// 將所有 React hooks 和工具函數明確地導出到全局 React 對象
Object.assign(React, {
  useState: React.useState,
  useEffect: React.useEffect,
  useContext: React.useContext,
  useReducer: React.useReducer,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useImperativeHandle: React.useImperativeHandle,
  useLayoutEffect: React.useLayoutEffect,
  useDebugValue: React.useDebugValue,
  useDeferredValue: React.useDeferredValue,
  useTransition: React.useTransition,
  useId: React.useId,
  Component: React.Component,
  PureComponent: React.PureComponent,
  memo: React.memo,
  forwardRef: React.forwardRef,
  createContext: React.createContext,
  createRef: React.createRef,
  Fragment: React.Fragment,
  StrictMode: React.StrictMode,
  Suspense: React.Suspense,
  createElement: React.createElement,
  cloneElement: React.cloneElement,
  createFactory: React.createFactory,
  isValidElement: React.isValidElement,
  Children: React.Children
});

// 為 ReactDOM 添加 unstable_batchedUpdates
if (ReactDOM && !ReactDOM.unstable_batchedUpdates && ReactDOMClient.unstable_batchedUpdates) {
  ReactDOM.unstable_batchedUpdates = ReactDOMClient.unstable_batchedUpdates;
}

// 確保全局訪問
if (typeof window !== 'undefined') {
  window.React = React;
  window.ReactDOM = ReactDOM;
}

export default React;
