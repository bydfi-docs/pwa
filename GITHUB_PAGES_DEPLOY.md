# GitHub Pages 部署指南

## 📦 部署步骤

### 1. 构建生产版本

```bash
npm run build
```

这会在 `dist/` 目录生成所有文件。

### 2. 配置 GitHub Pages

有两种部署方式：

#### **方式 A：使用 gh-pages 分支（推荐）**

安装 `gh-pages` 工具：

```bash
npm install -g gh-pages
```

部署到 `gh-pages` 分支：

```bash
gh-pages -d dist
```

然后在 GitHub 仓库设置：
1. 进入 `Settings` → `Pages`
2. Source 选择 `gh-pages` 分支
3. 路径选择 `/ (root)`
4. 保存

访问地址：`https://bydfi-docs.github.io/`

#### **方式 B：使用 GitHub Actions 自动部署（推荐）**

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main  # 或者 master

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

然后：
1. 提交代码到 `main` 分支
2. GitHub Actions 自动构建和部署
3. 在仓库 `Settings` → `Pages` 中选择 `gh-pages` 分支

### 3. 验证部署

访问：`https://bydfi-docs.github.io/`

检查：
- ✅ 首页能正常加载
- ✅ 路由切换正常
- ✅ PWA 可以安装
- ✅ Service Worker 注册成功

## 🔧 配置说明

### 当前配置（根路径部署）

```typescript
// vite.config.ts
export default defineConfig({
  base: '/', // 根路径部署
})
```

**访问地址：** `https://bydfi-docs.github.io/`

### 如果需要子路径部署

如果你的仓库名是 `pwa`，想通过 `https://bydfi-docs.github.io/pwa/` 访问：

```typescript
// vite.config.ts
export default defineConfig({
  base: '/pwa/', // 子路径部署
})
```

然后：
1. 重新构建：`npm run build`
2. 部署 `dist` 目录
3. 访问：`https://bydfi-docs.github.io/pwa/`

## 🐛 常见问题

### 1. 404 错误

**问题：** `GET https://bydfi-docs.github.io/src/main.tsx 404`

**原因：** `base` 配置不正确

**解决：**
- 根路径部署：`base: '/'`
- 子路径部署：`base: '/repo-name/'`

### 2. 路由刷新 404

**问题：** 刷新页面后出现 404

**解决：** 在 `dist/` 目录创建 `404.html`，内容复制 `index.html`：

```bash
cd dist
cp index.html 404.html
```

或在部署前自动创建：

```json
// package.json
{
  "scripts": {
    "build": "tsc -b && vite build && cp dist/index.html dist/404.html"
  }
}
```

### 3. Service Worker 缓存问题

**问题：** 更新后用户看到的还是旧版本

**解决：** 这是正常的，用户会在下次访问时看到更新提示。

强制清除缓存（仅调试用）：
- Chrome：`DevTools` → `Application` → `Clear storage` → `Clear site data`

### 4. Manifest 找不到

**问题：** `manifest.webmanifest 404`

**原因：** 构建时 manifest 没有生成到正确位置

**解决：** 确保 `public/` 目录的资源被正确复制：

```typescript
// vite.config.ts
VitePWA({
  manifest: {
    // ... 你的 manifest 配置
  }
})
```

构建后检查 `dist/manifest.webmanifest` 是否存在。

## 📝 快速部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash

echo "🚀 开始部署到 GitHub Pages..."

# 1. 构建
echo "📦 构建生产版本..."
npm run build

# 2. 复制 index.html 为 404.html（解决路由刷新问题）
echo "📄 创建 404.html..."
cp dist/index.html dist/404.html

# 3. 部署到 gh-pages 分支
echo "🌐 部署到 GitHub Pages..."
gh-pages -d dist

echo "✅ 部署完成！"
echo "🔗 访问地址：https://bydfi-docs.github.io/"
```

使用：

```bash
chmod +x deploy.sh
./deploy.sh
```

## 🎯 最佳实践

### 1. 使用 GitHub Actions 自动部署

优点：
- ✅ 每次 push 自动部署
- ✅ 不需要本地构建
- ✅ 保持 main 分支干净
- ✅ 构建日志可追溯

### 2. 添加部署状态徽章

在 `README.md` 中添加：

```markdown
![Deploy Status](https://github.com/bydfi-docs/pwa/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)
```

### 3. 配置自定义域名（可选）

如果有自己的域名：

1. 在 GitHub 仓库 `Settings` → `Pages` → `Custom domain` 填写域名
2. 在域名 DNS 添加 CNAME 记录指向 `bydfi-docs.github.io`
3. 启用 `Enforce HTTPS`

### 4. 监控部署

查看 GitHub Actions 运行状态：
- 进入仓库的 `Actions` 标签
- 查看每次部署的日志
- 失败时会有邮件通知

## 🔗 相关资源

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [gh-pages 工具](https://github.com/tschaub/gh-pages)
- [GitHub Actions 部署](https://github.com/peaceiris/actions-gh-pages)

---

**现在你可以开始部署了！** 🚀
