# PWA 应用更新指南

## 📱 PWA 更新机制说明

### 1. 自动更新流程

当你在 GitHub Pages 部署新版本后，用户端的更新流程如下：

```
部署新版本 → Service Worker 检测到更新 → 弹出更新提示 → 用户确认更新 → 应用刷新
```

### 2. 更新检测时机

应用会在以下时机自动检测更新：

- ✅ **用户打开应用时**：每次启动都会检查
- ✅ **定时检查**：运行中每小时自动检查一次
- ✅ **手动刷新**：用户刷新页面时检查
- ✅ **网络恢复**：从离线恢复到在线时检查

### 3. 更新提示 UI

实现了友好的更新提示界面：

```
┌─────────────────────────────┐
│          🚀                  │
│     发现新版本               │
│                              │
│  应用有新版本可用，更新后   │
│  可以获得最新功能和体验优化 │
│                              │
│  [ 立即更新 ]  [ 稍后提醒 ] │
└─────────────────────────────┘
```

### 4. 用户体验优势

#### ✨ 对用户友好
- 非侵入式提示，不强制更新
- 用户可以选择稍后更新
- 更新过程平滑，体验良好

#### ⚡ 更新快速
- 只下载变化的文件
- 支持增量更新
- 后台静默下载

#### 🔄 可靠性高
- 更新失败自动回滚
- 不影响当前使用
- 离线时不提示更新

## 🚀 部署流程

### 1. 构建新版本

```bash
npm run build
```

### 2. 部署到 GitHub Pages

```bash
# 方法一：手动部署
git add dist
git commit -m "Deploy: 新版本说明"
git push

# 方法二：使用 GitHub Actions（推荐）
# 自动构建和部署
git add .
git commit -m "feat: 新功能"
git push
```

### 3. 用户端更新

用户端会：
1. 在后台下载新版本
2. 下载完成后弹出更新提示
3. 用户点击"立即更新"
4. 应用刷新到最新版本

## 🔧 技术实现

### Service Worker 注册

```typescript
// main.tsx
const update = registerSW({
  onNeedRefresh() {
    // 检测到新版本
    setNeedRefresh(true)
  },
  onOfflineReady() {
    // 离线资源准备完毕
    console.log('📴 应用已准备好离线使用')
  },
  onRegistered(registration) {
    // 定时检查更新（每小时）
    setInterval(() => {
      registration.update()
    }, 60 * 60 * 1000)
  }
})
```

### 更新提示组件

```typescript
// UpdatePrompt.tsx
<UpdatePrompt 
  onUpdate={async () => {
    await update()
    window.location.reload()
  }} 
/>
```

## ⚙️ 配置选项

### 修改检查频率

在 `main.tsx` 中修改：

```typescript
// 默认：1 小时
setInterval(() => {
  registration.update()
}, 60 * 60 * 1000)

// 改为 30 分钟
setInterval(() => {
  registration.update()
}, 30 * 60 * 1000)
```

### 自定义更新策略

在 `vite.config.ts` 中配置：

```typescript
VitePWA({
  registerType: 'autoUpdate', // 自动更新
  // registerType: 'prompt',  // 提示更新
  workbox: {
    cleanupOutdatedCaches: true, // 清理旧缓存
    skipWaiting: true,           // 跳过等待
    clientsClaim: true           // 立即控制页面
  }
})
```

## 📊 更新监控

### 查看更新日志

打开浏览器控制台查看：

```
✅ Service Worker 注册成功
📱 SW scope: /pwa/
🔍 检查更新...
🔄 发现新版本
```

### 调试更新

1. 打开 DevTools → Application → Service Workers
2. 勾选 "Update on reload"
3. 勾选 "Bypass for network"
4. 刷新页面测试更新流程

## 🎯 最佳实践

### 1. 版本管理

在 `package.json` 中维护版本号：

```json
{
  "name": "pwa",
  "version": "1.0.1",
  "description": "交易所 PWA 应用"
}
```

### 2. 更新日志

在 `CHANGELOG.md` 中记录变更：

```markdown
## [1.0.1] - 2026-01-15
### 新增
- 添加自动更新提示功能
- 优化字号体系

### 修复
- 修复滚动条样式问题
- 修复安全区域显示
```

### 3. 渐进式更新

对于重大变更：
- 先发布 Beta 版本测试
- 逐步推送给用户
- 监控错误率和反馈

### 4. 回滚机制

如果新版本有问题：
1. 回退 Git 版本：`git revert HEAD`
2. 重新部署旧版本
3. 用户会自动回滚到稳定版本

## 💡 常见问题

### Q: 用户必须点击"立即更新"吗？

A: 不必须。用户可以选择"稍后提醒"，下次打开应用时会再次提示。

### Q: 更新会丢失用户数据吗？

A: 不会。更新只替换代码文件，不影响 LocalStorage、IndexedDB 等本地数据。

### Q: 离线时能更新吗？

A: 不能。Service Worker 需要网络来下载新版本。恢复在线后会自动检测更新。

### Q: 如何强制用户更新？

A: 可以修改 `UpdatePrompt.tsx`，移除"稍后提醒"按钮，只保留"立即更新"。

### Q: 更新失败怎么办？

A: Service Worker 会自动回滚。用户可以手动清除缓存：
- Chrome: DevTools → Application → Clear storage
- 或者卸载 PWA 重新安装

## 🔗 相关资源

- [PWA 更新策略](https://web.dev/service-worker-lifecycle/)
- [Workbox 更新指南](https://developer.chrome.com/docs/workbox/handling-service-worker-updates/)
- [Service Worker 生命周期](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**提示**：每次部署新版本后，建议在不同设备和浏览器上测试更新流程，确保用户体验良好。
