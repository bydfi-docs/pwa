# 📱 PWA 浏览器支持情况完整指南

## 概述

不同浏览器对 PWA 的支持程度不同。本文档详细说明各平台的支持情况。

---

## 🔍 核心功能支持对比

### 1. beforeinstallprompt 事件（程序化安装）

这是通过代码触发安装提示的事件。

| 平台/浏览器 | 支持情况 | 最低版本 | 说明 |
|------------|---------|---------|------|
| **Android Chrome** | ✅ 完全支持 | Chrome 40+ | 最佳支持，可通过代码触发安装 |
| **Android Samsung Internet** | ✅ 完全支持 | v6.2+ | 基于 Chromium，支持良好 |
| **Desktop Chrome (Win/Mac/Linux)** | ✅ 完全支持 | Chrome 68+ | 支持代码触发，也支持地址栏图标 |
| **Desktop Edge** | ✅ 完全支持 | Edge 79+ | 基于 Chromium，支持同 Chrome |
| **iOS Safari** | ❌ 不支持 | - | 只能通过"分享"菜单手动安装 |
| **macOS Safari** | ❌ 不支持 | - | 只能通过 Dock 手动添加 |
| **Firefox** | ❌ 不支持 | - | 有自己的实现，不支持此事件 |

### 2. Screenshots（安装预览截图）

在安装对话框中显示应用截图。

| 平台/浏览器 | 支持情况 | 最低版本 | 说明 |
|------------|---------|---------|------|
| **Android Chrome** | ✅ 完全支持 | Chrome 89+ | 显示轮播图，最多 8 张 |
| **Desktop Chrome** | ⚠️ 实验性 | Chrome 90+ | 部分版本支持，需要 flag |
| **其他浏览器** | ❌ 不支持 | - | 包括 iOS、Safari、Firefox 等 |

### 3. Service Worker（离线缓存）

| 平台/浏览器 | 支持情况 | 最低版本 |
|------------|---------|---------|
| **所有现代浏览器** | ✅ 完全支持 | - |
| Chrome | ✅ | Chrome 40+ |
| Firefox | ✅ | Firefox 44+ |
| Safari | ✅ | Safari 11.1+ |
| Edge | ✅ | Edge 17+ |

### 4. Web App Manifest

| 平台/浏览器 | 支持情况 | 最低版本 |
|------------|---------|---------|
| **所有现代浏览器** | ✅ 完全支持 | - |
| Chrome | ✅ | Chrome 39+ |
| Firefox | ✅ | Firefox 53+ |
| Safari | ✅ | Safari 11.1+ |
| Edge | ✅ | Edge 17+ |

---

## 📱 各平台详细说明

### Android Chrome（最佳支持）

#### ✅ 支持的功能：
- **beforeinstallprompt 事件** - 可通过按钮触发安装
- **Screenshots** - 显示应用截图轮播
- **Add to Home Screen** - 自动提示或手动添加
- **Standalone 模式** - 全屏运行，无浏览器 UI
- **Web Push Notifications** - 消息推送
- **Background Sync** - 后台同步
- **Offline Support** - 离线支持

#### 安装方式：
1. **自动提示**：满足条件后自动显示
2. **代码触发**：通过 `beforeinstallprompt` 事件
3. **菜单安装**：浏览器菜单 → "安装应用"

#### 触发条件：
- ✅ 有效的 manifest.json
- ✅ 已注册 Service Worker
- ✅ 通过 HTTPS 提供（或 localhost）
- ✅ 用户访问至少 30 秒
- ✅ 用户有过互动（点击、滚动等）
- ✅ 未安装过或未拒绝安装

---

### Desktop Chrome / Edge（良好支持）

#### ✅ 支持的功能：
- **beforeinstallprompt 事件** - 支持代码触发
- **地址栏安装图标** - 右侧显示 ⊕ 图标
- **菜单安装** - 浏览器菜单选项
- **Standalone 模式** - 独立窗口运行
- **Service Worker** - 离线支持
- **Web Push Notifications** - 消息推送

#### ⚠️ 部分支持：
- **Screenshots** - 部分版本实验性支持

#### 安装方式：
1. **地址栏图标**：点击地址栏右侧的 ⊕ 图标
2. **代码触发**：通过 `beforeinstallprompt` 事件
3. **菜单安装**：浏览器菜单 → "安装应用"

#### 推荐方式：
优先引导用户点击**地址栏安装图标**，这是最直观的方式。

---

### iOS Safari（手动安装）

#### ✅ 支持的功能：
- **Add to Home Screen** - 通过分享菜单
- **Standalone 模式** - 全屏运行
- **Service Worker** - 离线支持
- **Web App Manifest** - 基础支持

#### ❌ 不支持的功能：
- **beforeinstallprompt 事件** - 无法代码触发
- **Screenshots** - 不显示截图
- **Web Push Notifications** - 不支持推送（截至 iOS 16.4+，部分支持）

#### 安装方式（唯一方式）：
1. 打开 Safari 浏览器
2. 点击底部"分享"按钮 (⎙)
3. 选择"添加到主屏幕"
4. 点击"添加"确认

#### 注意事项：
- **必须使用 Safari**，Chrome iOS 不支持
- 需要手动引导用户操作
- 无法检测是否已安装
- 图标和启动画面配置有限

---

### macOS Safari（手动安装）

#### ✅ 支持的功能：
- **Add to Dock** - 添加到 Dock 栏
- **Service Worker** - 离线支持
- **Standalone 模式** - 独立窗口

#### ❌ 不支持的功能：
- **beforeinstallprompt 事件**
- **Screenshots**
- **自动安装提示**

#### 安装方式：
1. 打开 Safari 访问网站
2. 菜单栏 → 文件 → 添加到 Dock
3. 应用将以独立窗口运行

---

### Firefox（有限支持）

#### ✅ 支持的功能：
- **Service Worker** - 完全支持
- **Web App Manifest** - 基础支持
- **Offline Support** - 离线支持

#### ❌ 不支持的功能：
- **beforeinstallprompt 事件**
- **Screenshots**
- **标准 PWA 安装流程**

#### 说明：
Firefox 有自己的"添加到主屏幕"机制，但不遵循标准 PWA 规范。

---

## 🎯 开发建议

### 1. 检测策略

```typescript
// 检测是否支持 beforeinstallprompt
const supportsInstallPrompt = 'onbeforeinstallprompt' in window

// 检测平台
const isAndroid = /Android/.test(navigator.userAgent)
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isDesktop = !isAndroid && !isIOS

// 检测浏览器
const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent)
const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
const isEdge = /Edg/.test(navigator.userAgent)
```

### 2. 提供多种安装方式

**Android Chrome：**
- 优先：代码触发按钮
- 备用：引导用户使用浏览器菜单

**Desktop Chrome/Edge：**
- 优先：引导用户点击地址栏图标
- 备用：代码触发按钮

**iOS Safari：**
- 唯一：提供详细的手动安装步骤

**其他浏览器：**
- 说明 PWA 特性，引导切换到支持的浏览器

### 3. 用户体验优化

#### 不要过度打扰：
- ❌ 页面一加载就弹窗
- ✅ 用户有一定互动后再提示
- ✅ 被拒绝后至少 3 天不再提示

#### 提供价值说明：
- 说明安装后的好处
- 展示应用截图（Android）
- 强调离线功能、快速启动等

#### 尊重用户选择：
- 提供"不再提示"选项
- 可以稍后再安装
- 不影响正常使用

### 4. 功能降级

```typescript
if (supportsInstallPrompt) {
  // 显示一键安装按钮
  showInstallButton()
} else if (isIOS) {
  // 显示 iOS 安装指引
  showIOSGuide()
} else if (isDesktop) {
  // 显示 Desktop 安装指引
  showDesktopGuide()
} else {
  // 显示浏览器推荐
  showBrowserRecommendation()
}
```

---

## 📊 统计数据（截至 2026）

### 全球浏览器市场份额：

- **Chrome（所有平台）** - ~65%
  - Android Chrome: ~40%
  - Desktop Chrome: ~25%
- **Safari（所有平台）** - ~20%
  - iOS Safari: ~15%
  - macOS Safari: ~5%
- **Edge** - ~5%
- **Firefox** - ~3%
- **其他** - ~7%

### PWA 安装率：

根据行业数据：
- 有 **beforeinstallprompt** 按钮：安装率 ~5-10%
- 仅手动引导：安装率 ~1-3%
- **有 Screenshots**：安装率提升 20-30%

---

## ✅ 最佳实践总结

### 1. 必须实现：
- ✅ Service Worker（所有浏览器）
- ✅ Web App Manifest（所有浏览器）
- ✅ HTTPS（生产环境）

### 2. 推荐实现：
- ✅ beforeinstallprompt 处理（Android/Desktop Chrome）
- ✅ Screenshots 配置（Android Chrome）
- ✅ iOS 安装指引（iOS 用户）
- ✅ Desktop 安装引导（Desktop 用户）

### 3. 用户体验：
- ✅ 适时提示，不打扰
- ✅ 清晰说明价值
- ✅ 提供多种安装方式
- ✅ 优雅降级

### 4. 测试覆盖：
- ✅ Android Chrome（主要目标）
- ✅ Desktop Chrome/Edge（次要目标）
- ✅ iOS Safari（手动安装）
- ✅ 其他浏览器（基础功能）

---

## 🔗 相关资源

- [Web.dev - Install](https://web.dev/install-criteria/)
- [MDN - beforeinstallprompt](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent)
- [Can I Use - PWA](https://caniuse.com/?search=pwa)
- [PWA Stats](https://www.pwastats.com/)

---

## 📝 更新日志

**2026-01**
- Android Chrome 完全支持 Screenshots
- iOS 16.4+ 部分支持 Web Push
- Desktop Chrome 实验性支持 Screenshots

---

## 🎯 当前项目配置

### 已实现：
✅ Service Worker（通过 VitePWA）
✅ Web App Manifest（完整配置）
✅ Screenshots 配置（4张）
✅ beforeinstallprompt 处理
✅ 多平台智能检测
✅ iOS 安装指引
✅ Desktop 安装指引
✅ 浏览器支持情况展示

### 支持的浏览器：
- ✅ Android Chrome（完美支持，含截图）
- ✅ Desktop Chrome/Edge（良好支持）
- ✅ iOS Safari（手动安装）
- ⚠️ Firefox（基础功能）
- ⚠️ 其他浏览器（降级方案）

---

**总结**：PWA 不是只有 Android Chrome 支持！Desktop Chrome/Edge 也完全支持代码触发安装，只是安装体验略有不同。Screenshots 功能确实主要是 Android Chrome 独有。
