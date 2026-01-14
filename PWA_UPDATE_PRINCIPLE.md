# PWA 自动更新原理详解

## 🔬 核心原理

PWA 的更新机制基于 **Service Worker 生命周期** 和 **浏览器缓存策略**。

## 📊 完整更新流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    1. 用户访问应用                           │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  2. Service Worker 开始工作                                  │
│     - 已有旧版本 SW 在控制页面                               │
│     - 浏览器自动检查 sw.js 是否有更新                        │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
              ┌────────┴────────┐
              │  sw.js 有变化？  │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          │ 否                      │ 是
          ↓                         ↓
    ┌─────────┐          ┌──────────────────────┐
    │ 使用旧版 │          │ 3. 下载新版本 SW      │
    │ 继续运行 │          │    - 后台静默下载     │
    └─────────┘          │    - 不影响用户使用   │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ 4. 新 SW 进入"等待"   │
                         │    waiting 状态       │
                         │    - 旧 SW 仍在控制   │
                         │    - 新 SW 准备就绪   │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ 5. 触发 onNeedRefresh│
                         │    事件回调           │
                         │    - 显示更新提示     │
                         │    - 等待用户决定     │
                         └──────────┬───────────┘
                                    ↓
                    ┌───────────────┴───────────────┐
                    │ 用户点击"立即更新"             │
                    └───────────────┬───────────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ 6. 调用 skipWaiting() │
                         │    - 新 SW 跳过等待   │
                         │    - 立即激活         │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ 7. 新 SW 接管控制     │
                         │    - 旧 SW 被替换     │
                         │    - 页面自动刷新     │
                         └──────────┬───────────┘
                                    ↓
                         ┌──────────────────────┐
                         │ 8. 应用运行新版本 ✅  │
                         └──────────────────────┘
```

## 🧩 关键组件

### 1. Service Worker 文件检查

```javascript
// 浏览器每次访问时的自动检查逻辑（浏览器内置）
if (currentSW.scriptURL !== cachedSW.scriptURL) {
  // sw.js 文件的 hash 或内容改变了
  downloadNewSW()
} else if (24小时内没检查过) {
  // 强制检查一次
  checkForUpdates()
}
```

**检查依据：**
- 文件 URL 的 hash 值变化
- HTTP 缓存头（`Cache-Control`, `ETag`）
- 24 小时强制检查机制

### 2. Service Worker 生命周期

```
[下载] → [安装] → [等待] → [激活] → [控制页面]
                     ↑
                  skipWaiting()
                  跳过等待
```

#### 状态详解：

**① Installing（安装中）**
```javascript
self.addEventListener('install', (event) => {
  console.log('新版本正在安装...')
  // 下载并缓存新资源
  event.waitUntil(
    caches.open('v2').then(cache => {
      return cache.addAll([
        '/index.html',
        '/app.js',
        '/style.css'
      ])
    })
  )
})
```

**② Waiting（等待中）**
```javascript
// 新 SW 安装完成，但旧 SW 仍在控制页面
// 此时触发 onNeedRefresh 事件
self.addEventListener('activate', (event) => {
  console.log('等待旧 SW 释放控制权...')
})
```

**③ Activating（激活中）**
```javascript
// 调用 skipWaiting() 后进入
self.skipWaiting() // 立即激活

self.addEventListener('activate', (event) => {
  console.log('新版本正在激活...')
  // 清理旧缓存
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.filter(name => name !== 'v2')
             .map(name => caches.delete(name))
      )
    })
  )
  // 立即接管所有页面
  return self.clients.claim()
})
```

**④ Activated（已激活）**
```javascript
// 新 SW 完全接管，控制所有请求
self.addEventListener('fetch', (event) => {
  // 拦截请求，返回缓存或网络数据
})
```

### 3. 版本检测机制

#### 方法 1：文件内容 Hash（Vite 默认）

```javascript
// 构建时生成的文件
dist/
  sw.js                    // Service Worker 主文件
  workbox-abc123.js        // workbox 库（带 hash）
  index-xyz789.js          // 应用代码（带 hash）
  index-def456.css         // 样式（带 hash）
```

**检测逻辑：**
```javascript
// 旧版本的 sw.js 引用
importScripts('workbox-abc123.js')

// 新版本的 sw.js 引用
importScripts('workbox-xyz789.js') // ← hash 变了！

// 浏览器检测到 sw.js 的导入脚本变化
// → 判定为新版本
// → 下载新的 Service Worker
```

#### 方法 2：SW 文件自身变化

```javascript
// 旧版本 sw.js (简化)
const CACHE_VERSION = 'v1.0.0'

// 新版本 sw.js (简化)  
const CACHE_VERSION = 'v1.0.1' // ← 版本号变了

// 浏览器逐字节对比 sw.js
// → 发现内容不同
// → 判定为新版本
```

### 4. 缓存策略（Workbox）

```javascript
// vite.config.ts 中的配置转化为实际的缓存逻辑

// ① 预缓存（Precache）- 构建时确定
workbox.precacheAndRoute([
  { url: '/index.html', revision: 'abc123' },
  { url: '/app.js', revision: 'xyz789' },
  { url: '/style.css', revision: 'def456' }
])
// 安装时全部下载，更新时对比 revision

// ② 运行时缓存（Runtime Cache）
workbox.registerRoute(
  /\.(?:png|jpg|svg)$/,
  new workbox.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 天
      })
    ]
  })
)
```

## 💻 代码实现原理

### 1. Vite PWA 插件工作流程

```javascript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate'
})

// ↓ 构建时转换为 ↓

// virtual:pwa-register (虚拟模块)
export function registerSW(options) {
  let registration
  
  // 注册 Service Worker
  navigator.serviceWorker.register('/sw.js')
    .then(reg => {
      registration = reg
      
      // 监听 Service Worker 更新
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // 有旧版本，发现新版本
              options.onNeedRefresh?.()
            } else {
              // 首次安装
              options.onOfflineReady?.()
            }
          }
        })
      })
      
      // 定期检查更新
      setInterval(() => reg.update(), 3600000)
    })
  
  // 返回更新函数
  return async () => {
    const reg = await navigator.serviceWorker.getRegistration()
    const waiting = reg?.waiting
    
    if (waiting) {
      // 向 waiting 的 SW 发送消息
      waiting.postMessage({ type: 'SKIP_WAITING' })
      
      // 等待新 SW 激活
      await new Promise(resolve => {
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          resolve
        )
      })
    }
  }
}
```

### 2. Service Worker 端接收消息

```javascript
// sw.js (由 Workbox 生成)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    // 收到跳过等待的命令
    self.skipWaiting()
  }
})

self.addEventListener('activate', (event) => {
  // 激活后立即接管所有页面
  event.waitUntil(self.clients.claim())
})
```

### 3. 客户端监听控制器变化

```javascript
// main.tsx
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // Service Worker 控制器改变
  // = 新版本已激活
  console.log('新版本已接管，准备刷新...')
  window.location.reload()
})
```

## 🔄 双向通信机制

```
┌──────────────┐           ┌──────────────┐
│  客户端页面   │           │ Service Worker│
│  (main.tsx)  │           │   (sw.js)     │
└──────┬───────┘           └───────┬───────┘
       │                           │
       │ 1. 发送 SKIP_WAITING      │
       │ ─────────────────────────→│
       │                           │
       │                    2. 调用 skipWaiting()
       │                    3. 进入 activate 状态
       │                    4. 执行 clients.claim()
       │                           │
       │ 5. 触发 controllerchange  │
       │←─────────────────────────│
       │                           │
       │ 6. reload()               │
       │                           │
       │ 7. 用新版本 SW 重新加载    │
       │←═════════════════════════│
       │                           │
```

## 📦 文件版本对比原理

### 构建产物变化检测

```bash
# 旧版本构建
dist/
  sw.js           (内容: importScripts('workbox-aaa.js'))
  workbox-aaa.js
  index-bbb.js
  
# 修改代码后新版本构建  
dist/
  sw.js           (内容: importScripts('workbox-ccc.js')) ← 变了！
  workbox-ccc.js  ← 新文件
  index-ddd.js    ← 新文件

# 浏览器检查流程：
1. 请求 /sw.js
2. 对比响应内容与缓存的 sw.js
3. 发现 importScripts 的文件名变化
4. 判定为新版本
5. 下载并安装新的 sw.js
```

### HTTP 缓存控制

```javascript
// GitHub Pages 默认响应头
Cache-Control: max-age=600  // 10 分钟

// Service Worker 检查机制（浏览器实现）
if (缓存过期 || 强制刷新 || 24小时未检查) {
  fetch('/sw.js', { cache: 'no-cache' })
    .then(response => {
      if (response.body !== cachedSWBody) {
        installNewSW(response)
      }
    })
}
```

## 🎯 为什么需要用户确认？

### 不立即更新的原因：

```javascript
// 场景：用户正在填写表单
用户输入数据 → SW 检测到更新 → 直接刷新页面 → 数据丢失！❌

// 更好的方式：
用户输入数据 → SW 检测到更新 → 显示提示 → 用户保存数据 → 点击更新 ✅
```

### 代码实现：

```typescript
// 保守策略（需要用户确认）
const update = registerSW({
  onNeedRefresh() {
    setShowPrompt(true)  // 显示提示，等待用户
  }
})

// 激进策略（自动更新）
const update = registerSW({
  onNeedRefresh() {
    update()  // 立即更新，不询问
    window.location.reload()
  }
})
```

## 🔍 调试和监控

### Chrome DevTools 调试

```
1. F12 → Application → Service Workers
   
   [Service Workers]
   ┌─────────────────────────────────────┐
   │ Source: /sw.js                      │
   │ Status: activated and running       │
   │                                     │
   │ [Update] [Unregister] [skipWaiting]│
   │                                     │
   │ □ Update on reload                 │
   │ □ Bypass for network               │
   └─────────────────────────────────────┘
```

### 控制台日志

```javascript
// 注册成功
✅ Service Worker 注册成功
📱 SW scope: /pwa/

// 检测到更新
🔍 检查更新...
🔄 发现新版本

// 用户更新
⏳ 正在应用更新...
✅ 更新完成，准备刷新
```

## 📈 性能优化

### 增量更新

```javascript
// 只更新变化的文件
旧版本缓存:
  index.html (100KB)
  app.js (500KB)      ← 修改了
  style.css (50KB)
  
新版本更新:
  只下载 app.js (500KB)  // 节省 150KB 带宽
  其他文件复用缓存
```

### 后台下载

```javascript
// Service Worker 在独立线程运行
主线程（用户交互）   ─────→  流畅使用中
   ↓
Service Worker 线程  ─────→  后台下载更新
   ↓
下载完成             ─────→  显示提示
```

## 🛡️ 容错机制

### 更新失败回滚

```javascript
// Service Worker 安装失败
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v2').then(cache => {
      return cache.addAll([...])
    })
    .catch(err => {
      // 下载失败，安装中止
      // 旧版本继续运行 ← 自动回滚
      console.error('安装失败', err)
    })
  )
})
```

### 版本冲突处理

```javascript
// 多标签页同时打开
Tab 1: 旧版本 SW 控制
Tab 2: 旧版本 SW 控制

// Tab 1 更新
Tab 1: 新版本 SW 激活 → claim() → 接管所有标签
Tab 2: 自动切换到新 SW 控制 ✅
```

## 💡 总结

PWA 自动更新 = **Service Worker 生命周期** + **文件版本检测** + **用户体验优化**

核心流程：
1. 浏览器自动检测 `sw.js` 变化
2. 后台下载新版本
3. 新版本进入 `waiting` 状态
4. 通知用户有更新
5. 用户确认后 `skipWaiting()`
6. 新版本激活并接管
7. 页面刷新，完成更新

这个机制确保了：
- ✅ 用户始终使用最新版本
- ✅ 更新过程平滑无感知
- ✅ 不会丢失用户数据
- ✅ 失败自动回滚
