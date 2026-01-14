# 🎨 Install页面预览模式

为了方便开发和测试，Install页面支持通过URL参数来强制显示不同的界面模式。

## 📋 使用方法

### 1. 默认模式（自动检测）
```
http://localhost:5173/install
```
根据浏览器和环境自动决定显示哪种界面：
- 支持`beforeinstallprompt` → 显示应用商店风格
- 不支持 → 显示详细指引模式

---

### 2. 强制商店模式
```
http://localhost:5173/install?preview=store
```

**显示效果：**
- 🏪 应用商店风格界面
- 📱 大图标 + 评分 + 元数据
- 📸 预览截图滚动
- 💡 预览模式提示
- 🔗 快速切换链接

**适用场景：**
- 预览商店界面设计
- 调试商店页面样式
- 截图用于展示
- 不依赖`beforeinstallprompt`事件

---

### 3. 强制指引模式
```
http://localhost:5173/install?preview=guide
```

**显示效果：**
- 📖 详细说明界面
- 🌐 浏览器支持对比表
- 📋 各平台安装指引
- 💡 智能推荐建议
- 📊 功能支持详情

**适用场景：**
- 预览指引页面设计
- 测试不同浏览器的说明
- 调试详细说明布局
- 查看完整功能对比

---

## 🎯 实际使用示例

### 开发时快速切换

在开发模式下，页面会显示三个快速切换链接：

```
[默认模式]  [商店模式]  [指引模式]
```

点击即可在不同模式间切换。

### 分享给设计师预览

**商店界面：**
```bash
# 启动开发服务器
npm run dev

# 分享链接
http://localhost:5173/install?preview=store
```

**指引界面：**
```bash
http://localhost:5173/install?preview=guide
```

### 截图用于文档

1. **商店模式截图**
   ```
   访问：http://localhost:5173/install?preview=store
   适合：展示PWA安装体验
   ```

2. **指引模式截图**
   ```
   访问：http://localhost:5173/install?preview=guide
   适合：展示浏览器支持情况
   ```

---

## 🎨 预览模式特点

### 商店模式预览
- ✅ 显示完整商店界面
- ✅ 按钮显示"预览模式"
- ✅ 按钮为禁用状态（防止误点击）
- ✅ 显示预览提示卡片
- ✅ 提供快速切换链接

### 指引模式预览
- ✅ 显示完整指引界面
- ✅ 所有浏览器支持信息
- ✅ 所有平台安装步骤
- ✅ 完整功能对比表

---

## 📱 不同环境的表现

### 开发环境（localhost）

**默认模式：**
- 如果PWA配置正确 → 商店模式
- 如果配置有问题 → 指引模式
- 显示 `🛠️ 开发模式` 徽章

**预览参数：**
- `?preview=store` → 强制商店模式
- `?preview=guide` → 强制指引模式
- 显示预览模式提示

### 生产环境（部署后）

**默认模式：**
- Android Chrome → 商店模式
- Desktop Chrome/Edge → 商店模式
- iOS Safari → 指引模式
- 其他浏览器 → 指引模式

**预览参数：**
- 同样有效
- 可用于演示不同界面
- 可用于测试布局

---

## 🔧 技术实现

### URL参数检测
```typescript
const urlParams = new URLSearchParams(window.location.search)
const preview = urlParams.get('preview')

if (preview === 'store' || preview === 'guide') {
  setPreviewMode(preview)
}
```

### 显示逻辑
```typescript
const shouldShowStore = 
  previewMode === 'store' || 
  (previewMode !== 'guide' && isInstallable && !isInstalled && !isStandalone)

const shouldShowGuide = 
  previewMode === 'guide' || 
  (previewMode !== 'store' && (!isInstallable || isInstalled || isStandalone))
```

### 优先级
1. **URL参数** - 最高优先级
2. **实际支持情况** - 自动检测
3. **浏览器类型** - 次要判断

---

## 💡 使用建议

### 开发阶段
✅ 使用预览参数快速查看不同界面
✅ 调试样式时固定某个模式
✅ 截图展示时强制显示特定模式

### 测试阶段
✅ 先用默认模式测试自动检测
✅ 再用预览参数测试两种界面
✅ 在不同设备上测试实际效果

### 生产环境
✅ 默认模式即可
✅ 预览参数可用于演示
✅ 不影响正常用户使用

---

## 🎯 快速参考

| URL | 模式 | 说明 |
|-----|------|------|
| `/install` | 自动 | 根据环境自动选择 |
| `/install?preview=store` | 商店 | 强制显示应用商店风格 |
| `/install?preview=guide` | 指引 | 强制显示详细说明 |

---

## 📸 界面预览

### 商店模式
- iOS风格设计
- 大图标居中
- 评分和元数据
- 蓝色"获取"按钮
- 横向滚动截图

### 指引模式
- 详细功能对比
- 浏览器支持表格
- 平台安装步骤
- 智能推荐建议
- 完整说明文档

---

## 🚀 快速开始

```bash
# 1. 启动开发服务器
npm run dev

# 2. 在浏览器中访问
# 默认模式
http://localhost:5173/install

# 商店模式
http://localhost:5173/install?preview=store

# 指引模式
http://localhost:5173/install?preview=guide
```

现在你可以方便地预览和调试Install页面的不同模式了！🎉
