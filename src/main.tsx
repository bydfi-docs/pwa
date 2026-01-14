import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UpdatePrompt from './components/UpdatePrompt.tsx'

// 使用 Vite PWA 插件提供的虚拟模块注册 Service Worker
import { registerSW } from 'virtual:pwa-register'

function Root() {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null)

  // 注册 Service Worker
  const update = registerSW({
    onNeedRefresh() {
      console.log('🔄 发现新版本')
      setNeedRefresh(true)
      setUpdateSW(() => async () => {
        await update()
        window.location.reload()
      })
    },
    onOfflineReady() {
      console.log('📴 应用已准备好离线使用')
    },
    onRegistered(registration) {
      console.log('✅ Service Worker 注册成功')
      if (registration) {
        console.log('📱 SW scope:', registration.scope)
        // 每小时检查一次更新
        setInterval(() => {
          console.log('🔍 检查更新...')
          registration.update()
        }, 60 * 60 * 1000) // 1 小时
      }
    },
    onRegisterError(error) {
      console.error('❌ Service Worker 注册失败:', error)
    },
    immediate: true
  })

  console.log('🚀 PWA 初始化完成')

  const handleUpdate = async () => {
    if (updateSW) {
      await updateSW()
    }
  }

  return (
    <StrictMode>
      <App />
      {needRefresh && updateSW && <UpdatePrompt onUpdate={handleUpdate} />}
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
