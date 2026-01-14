import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 使用 Vite PWA 插件提供的虚拟模块注册 Service Worker
import { registerSW } from 'virtual:pwa-register'

// 注册 Service Worker
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('🔄 发现新内容')
  },
  onOfflineReady() {
    console.log('📴 应用已准备好离线使用')
  },
  onRegistered(registration) {
    console.log('✅ Service Worker 注册成功')
    if (registration) {
      console.log('📱 SW scope:', registration.scope)
    }
  },
  onRegisterError(error) {
    console.error('❌ Service Worker 注册失败:', error)
  },
  immediate: true
})

console.log('🚀 PWA 初始化完成')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
