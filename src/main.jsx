import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/**
 * React + Framer Motion 主入口文件
 * 替代原有的纯JavaScript实现
 */

// 创建根元素（如果不存在）
let rootElement = document.getElementById('react-root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'react-root';
  document.body.appendChild(rootElement);
}

// 创建React根实例
const root = ReactDOM.createRoot(rootElement);

// 渲染应用
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 为了保持向后兼容性，导出一些全局函数
window.ReactApp = {
  // 可以在这里添加需要全局访问的方法
};

export default root;