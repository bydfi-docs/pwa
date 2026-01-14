# 📸 PWA Screenshots 制作指南

## 什么是 PWA Screenshots？

PWA Screenshots（应用截图）是在 **Android Chrome 浏览器**安装 PWA 应用时，在安装提示对话框中展示的应用界面预览图。用户可以左右滑动查看，就像应用商店的截图展示一样。

## 🎯 为什么需要 Screenshots？

- ✅ **提升安装转化率**：让用户在安装前就能看到应用界面
- ✅ **展示核心功能**：直观展示应用的主要特性
- ✅ **增强信任度**：专业的截图让用户更放心安装
- ✅ **改善用户体验**：类似应用商店的安装体验

## 📱 支持情况

| 平台 | 是否支持 |
|------|---------|
| Android Chrome | ✅ 支持 |
| Desktop Chrome | ❌ 不支持 |
| iOS Safari | ❌ 不支持 |
| Edge | ⚠️ 部分支持 |

## 📐 截图规格要求

### 必须满足的条件：
- **宽高比**：必须在 1:2.3 到 2.3:1 之间
- **最小尺寸**：320px（宽）或 320px（高）
- **最大尺寸**：3840px（宽或高）
- **格式**：PNG、JPEG 或 WebP
- **数量**：1-8 张

### 推荐规格：

#### 手机竖屏（推荐）
```
尺寸：540 x 960 px
或：1080 x 1920 px（2倍图）
比例：9:16
```

#### 平板横屏（可选）
```
尺寸：1280 x 720 px
或：1920 x 1080 px
比例：16:9
```

## 🛠️ 快速制作截图

### 方法1：使用浏览器开发者工具（最简单）

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **打开 Chrome DevTools**
   - 按 `F12` 或 `Cmd+Option+I` (Mac)
   - 点击设备切换按钮 📱 或按 `Cmd+Shift+M`

3. **设置设备尺寸**
   - 选择设备：`iPhone 12 Pro` (390x844)
   - 或自定义尺寸：`540 x 960`

4. **导航并截图**
   ```
   - 访问 http://localhost:5173/
   - 点击"首页"标签 → 截图保存为 home.png
   - 点击"行情"标签 → 截图保存为 market.png
   - 点击"交易"标签 → 截图保存为 trade.png
   - 点击"资产"标签 → 截图保存为 assets.png
   ```

5. **保存截图**
   - Chrome 截图：右键点击页面 → "捕获屏幕截图"
   - 或使用系统截图工具
   - 将图片保存到 `public/screenshots/` 目录

### 方法2：使用在线工具

**推荐工具：**
- [Screely](https://www.screely.com/) - 添加浏览器外框
- [Screenshot.rocks](https://screenshot.rocks/) - 美化截图
- [Mockuphone](https://mockuphone.com/) - 手机样机

**步骤：**
1. 访问你的应用（本地或线上）
2. 使用工具生成手机样机截图
3. 下载并保存到 `public/screenshots/`

### 方法3：真实设备截图

1. 在手机上访问应用
2. 截取各个页面的屏幕截图
3. 传输到电脑
4. 使用图片编辑工具调整至 540x960

## 📂 文件命名和位置

将截图保存到：`public/screenshots/`

```
public/screenshots/
  ├── home.png      # 首页
  ├── market.png    # 行情页
  ├── trade.png     # 交易页
  └── assets.png    # 资产页
```

## 🎨 截图最佳实践

### DO ✅
- 使用真实、完整的数据（不要空白页面）
- 展示应用的核心功能和价值
- 保持高质量和清晰度
- 统一的视觉风格
- 按用户使用流程排序

### DON'T ❌
- 使用模糊或低质量图片
- 展示错误状态或空白页
- 包含个人敏感信息
- 使用过多截图（3-5张最佳）
- 忘记优化文件大小

## 🧪 测试效果

### 本地测试：
```bash
# 1. 构建项目
npm run build

# 2. 预览
npm run preview

# 3. 在 Android Chrome 中访问
# 触发安装提示，查看截图展示
```

### 部署后测试：
1. 部署到 HTTPS 服务器
2. 在 Android 手机上用 Chrome 访问
3. 等待或触发安装提示
4. 查看截图轮播效果

## 🔍 验证 Manifest

使用 Chrome DevTools 检查：
1. 打开 DevTools → Application → Manifest
2. 查看 `screenshots` 字段是否正确
3. 点击每个截图链接验证路径

## 📊 文件大小优化

截图文件可能比较大，建议优化：

### 在线工具：
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)

### 命令行工具：
```bash
# 使用 ImageMagick 压缩
magick input.png -quality 85 -resize 540x960 output.png

# 批量处理
for file in *.png; do
  magick "$file" -quality 85 "${file%.png}_optimized.png"
done
```

## 🎯 当前配置

已在 `vite.config.ts` 中配置了 4 张截图：

```typescript
screenshots: [
  {
    src: 'screenshots/home.png',
    sizes: '540x960',
    type: 'image/png',
    form_factor: 'narrow',
    label: '首页 - 市场行情'
  },
  // ... 其他截图
]
```

## 📚 更多资源

- [Web.dev - Add a web app manifest](https://web.dev/add-manifest/)
- [MDN - Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Google - Screenshots](https://developer.chrome.com/docs/lighthouse/pwa/splash-screen/)

---

## 快速开始

```bash
# 1. 启动开发服务器
npm run dev

# 2. 打开 Chrome DevTools（F12）
# 3. 切换到移动设备模式（Cmd+Shift+M）
# 4. 设置尺寸为 540x960
# 5. 导航到各个页面并截图
# 6. 保存到 public/screenshots/
# 7. 构建并测试
npm run build && npm run preview
```

搞定！🎉
