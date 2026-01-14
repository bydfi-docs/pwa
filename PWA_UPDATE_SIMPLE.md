# PWA 更新原理（简化版）

## 🎯 一句话解释

**浏览器自动对比 Service Worker 文件，发现变化就下载新版本，下载完提示用户，用户确认后刷新。**

---

## 📚 三个关键概念

### 1️⃣ Service Worker（服务工作线程）

```
Service Worker = 浏览器后台运行的 JavaScript 程序
```

**作用：**
- 拦截网络请求
- 管理缓存
- 离线访问
- 推送通知

**比喻：** 
就像一个"管家"，守在你的应用门口：
- 用户访问网页 → 管家检查本地有没有缓存 → 有就直接返回
- 没有缓存 → 管家去网络下载 → 存到缓存 → 返回给用户

### 2️⃣ sw.js 文件（Service Worker 主文件）

```javascript
// 这个文件控制一切
/sw.js
```

**检测更新的关键：**
```javascript
旧版本 sw.js 内容：
const VERSION = 'v1.0.0'
importScripts('workbox-abc123.js')

新版本 sw.js 内容：  
const VERSION = 'v1.0.1'        ← 变了！
importScripts('workbox-xyz789.js')  ← 变了！

浏览器发现内容不一样 → 这是新版本！
```

### 3️⃣ 生命周期（State Machine）

```
下载 → 安装 → 等待 → 激活 → 运行
```

---

## 🔄 完整流程（10 步）

### **场景：你在 GitHub 部署了新版本**

```javascript
// ========== 第 1 步 ==========
开发者部署新版本到 GitHub
→ dist/sw.js 文件内容变化
→ dist/app.js 文件名变化 (带新 hash)

// ========== 第 2 步 ==========
用户打开应用（或刷新页面）
→ 浏览器加载页面
→ 注册 Service Worker

// ========== 第 3 步 ==========
浏览器自动检查 /sw.js 文件
→ 请求 GitHub: GET /pwa/sw.js
→ 对比本地缓存的 sw.js

// ========== 第 4 步 ==========
发现文件内容不同！
→ 浏览器："有新版本！"
→ 开始下载新的 sw.js

// ========== 第 5 步 ==========
新 SW 下载完成，进入"安装"阶段
→ 执行 install 事件
→ 下载并缓存所有新资源
→ 这时旧 SW 还在控制页面

// ========== 第 6 步 ==========
新 SW 安装完成，进入"等待"状态
→ 等待旧 SW 释放控制权
→ 触发 onNeedRefresh() 回调

// ========== 第 7 步 ==========
你的代码显示更新提示
→ 用户看到："发现新版本"弹窗
→ 等待用户点击"立即更新"

// ========== 第 8 步 ==========
用户点击"立即更新"
→ 调用 skipWaiting()
→ 新 SW 跳过等待，立即激活

// ========== 第 9 步 ==========
新 SW 激活，接管所有页面
→ 执行 activate 事件
→ 清理旧版本缓存
→ clients.claim() 接管控制权

// ========== 第 10 步 ==========
页面刷新
→ window.location.reload()
→ 用户看到新版本界面 ✅
```

---

## 🎨 可视化流程

```
         用户设备                GitHub 服务器
            │                        │
            │  1. 访问应用            │
            │───────────────────────→│
            │                        │
            │  2. 返回 HTML + 旧SW    │
            │←───────────────────────│
            │                        │
            │  3. 检查 sw.js         │
            │───────────────────────→│
            │                        │
            │  4. 返回新 sw.js       │
            │←───────────────────────│
            │  (hash 不同！)          │
            │                        │
    ┌───────▼───────┐                │
    │  下载新资源    │                │
    │  后台安装      │                │
    └───────┬───────┘                │
            │                        │
    ┌───────▼───────┐                │
    │  显示更新提示  │                │
    │  🚀 发现新版本 │                │
    └───────┬───────┘                │
            │                        │
         [用户点击]                   │
            │                        │
    ┌───────▼───────┐                │
    │  激活新 SW     │                │
    │  刷新页面      │                │
    └───────┬───────┘                │
            │                        │
    ┌───────▼───────┐                │
    │  运行新版本 ✅ │                │
    └───────────────┘                │
```

---

## 💻 代码对应关系

### **你的代码**

```typescript
// main.tsx
const update = registerSW({
  onNeedRefresh() {              // ← 第 6 步触发
    setNeedRefresh(true)         // 显示更新提示
  }
})

// 用户点击"立即更新"
await update()                    // ← 第 8 步：skipWaiting
window.location.reload()          // ← 第 10 步：刷新
```

### **浏览器自动做的**

```javascript
// 第 3 步：浏览器自动检查
navigator.serviceWorker.register('/sw.js')
  .then(registration => {
    // 定期检查更新
    setInterval(() => {
      registration.update()       // ← 对比 sw.js
    }, 3600000)
  })

// 第 4 步：浏览器自动检测变化
registration.addEventListener('updatefound', () => {
  const newWorker = registration.installing
  // 发现新版本！
})
```

### **Service Worker 内部**

```javascript
// sw.js (Workbox 生成)

// 第 5 步：安装
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v2').then(cache => {
      return cache.addAll([...])  // 下载新资源
    })
  )
})

// 第 8 步：收到 skipWaiting 命令
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()            // 跳过等待
  }
})

// 第 9 步：激活
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim()          // 接管所有页面
  )
})
```

---

## 🔍 如何检测版本变化？

### **方法 1：文件 Hash（Vite 默认）**

```javascript
// 构建后的文件名带 hash
dist/
  index-abc123.js    // 旧版本
  index-xyz789.js    // 新版本（代码变了，hash 变了）

// sw.js 引用变化
旧: precacheAndRoute([{ url: '/index-abc123.js' }])
新: precacheAndRoute([{ url: '/index-xyz789.js' }])

// sw.js 内容变了 → 触发更新
```

### **方法 2：文件内容对比**

```javascript
// 浏览器逐字节对比
旧 sw.js: const VERSION = 'v1'
新 sw.js: const VERSION = 'v2'

// 不一样 → 触发更新
```

---

## ⚡ 为什么很快？

### **增量更新**

```javascript
// 只下载变化的文件
旧版本：
  ✅ logo.png (100KB)     → 没变，复用缓存
  ✅ style.css (50KB)     → 没变，复用缓存
  ❌ app.js (500KB)       → 变了，重新下载

总下载：500KB，节省 150KB！
```

### **后台下载**

```
用户正在浏览页面  ←→  Service Worker 后台下载
      ↓                      ↓
   无感知！              下载完成后才提示
```

---

## 🛡️ 容错机制

### **下载失败**

```javascript
// 网络断了，下载新版本失败
install 事件失败 → 新 SW 安装终止 → 旧 SW 继续运行 ✅
```

### **用户不更新**

```javascript
用户点击"稍后提醒" → 关闭提示 → 旧版本继续用
下次打开应用 → 再次提示 → 用户可以一直用旧版本
```

---

## 📊 对比其他应用

| 特性 | 原生 APP | PWA |
|------|---------|-----|
| **更新方式** | 应用商店下载 | 浏览器自动检测 |
| **用户操作** | 手动去应用商店 | 弹窗点一下 |
| **下载大小** | 完整 APK/IPA | 只下载变化的文件 |
| **更新速度** | 几分钟 | 几秒钟 |
| **强制更新** | 可以 | 可以 |
| **回滚** | 需重新发版 | 自动回滚 |

---

## 🎯 总结

### **三个核心**

1. **Service Worker** = 后台管家
2. **sw.js 变化** = 触发更新
3. **用户确认** = 平滑体验

### **五个步骤**

1. 浏览器检查 → 2. 后台下载 → 3. 安装完成 → 4. 提示用户 → 5. 刷新应用

### **零用户感知**

- 不需要去应用商店
- 不需要等待几分钟
- 不会丢失数据
- 失败自动回滚

---

**就这么简单！** 🎉
