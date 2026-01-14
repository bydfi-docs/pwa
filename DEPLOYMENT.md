# 部署指南

## GitHub Pages 自动部署

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 配置步骤

1. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/bydfi-docs/pwa.git
   git branch -M main
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库设置：`Settings` -> `Pages`
   - Source 选择：`GitHub Actions`
   - 保存设置

3. **自动部署**
   - 每次推送到 `main` 分支时自动触发部署
   - 也可以手动触发：`Actions` -> `Deploy to GitHub Pages` -> `Run workflow`

### 访问地址

部署成功后，可以通过以下地址访问：
```
https://bydfi-docs.github.io/pwa/
```

### 本地构建测试

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署状态

- ✅ GitHub Actions 工作流已配置
- ✅ Vite 配置已更新（base 路径）
- ✅ 自动部署到 GitHub Pages

### 注意事项

1. **首次部署**：需要在 GitHub 仓库设置中启用 GitHub Pages
2. **分支保护**：确保有权限推送到 main 分支
3. **构建时间**：通常需要 2-5 分钟完成部署
4. **缓存**：如果更新未生效，尝试清除浏览器缓存

### 功能特性

- 🚀 自动构建和部署
- ⚡️ Vite 快速构建
- 📱 PWA 支持
- 🎨 React + TypeScript
- 💎 专业交易所界面
- ✨ 流畅动画效果
- 📊 实时数据展示
- 💰 完整的资产管理

### 技术栈

- React 18
- TypeScript
- Vite 5
- React Router
- Vite PWA Plugin

### 问题排查

如果部署失败：
1. 检查 GitHub Actions 日志
2. 确认 package.json 中的依赖版本
3. 验证 vite.config.ts 配置是否正确
4. 确保 GitHub Pages 已启用

### 更新部署

```bash
# 修改代码后
git add .
git commit -m "Update: description"
git push

# 自动触发部署
```

---

部署配置已完成！🎉
