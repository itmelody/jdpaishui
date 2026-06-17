# GitHub Pages 手动部署指南

由于网络连接问题，自动推送可能失败。请按照以下步骤手动完成部署。

## 方法一：使用 GitHub Web 界面（推荐）

### 步骤 1：上传构建文件到 gh-pages 分支

1. **访问 GitHub 仓库**
   - 打开 [https://github.com/itmelody/jdpaishui](https://github.com/itmelody/jdpaishui)

2. **创建或切换到 gh-pages 分支**
   - 点击分支选择器（显示 "main" 的地方）
   - 输入 `gh-pages` 创建新分支
   - 或者如果已存在，直接切换到该分支

3. **上传构建文件**
   - 在 gh-pages 分支中，点击 "Add file" → "Upload files"
   - 将本地 `dist/` 目录中的所有文件和文件夹拖拽上传
   - 包括：
     - `index.html`
     - `assets/` 文件夹（包含所有 CSS 和 JS 文件）
     - `favicon.svg`
     - `icons.svg`
   
4. **提交更改**
   - 在 "Commit changes" 框中输入提交信息，例如："Deploy to GitHub Pages"
   - 点击 "Commit changes" 按钮

### 步骤 2：启用 GitHub Pages

1. **进入 Settings**
   - 点击仓库页面顶部的 "Settings" 标签

2. **找到 Pages 设置**
   - 在左侧菜单中找到并点击 "Pages"

3. **配置 Source**
   - 在 "Build and deployment" 部分
   - Source 选择 **"Deploy from a branch"**
   - Branch 选择 **"gh-pages"**
   - Folder 选择 **"/ (root)"**
   - 点击 "Save"

4. **等待部署**
   - 保存后，GitHub 会自动部署
   - 页面顶部会显示部署状态
   - 通常需要 1-5 分钟完成

### 步骤 3：验证部署

1. **查看部署 URL**
   - 在 Pages 设置页面顶部会显示您的网站 URL
   - 应该是：`https://itmelody.github.io/jdpaishui/`

2. **访问网站**
   - 点击 URL 或在浏览器中打开
   - 确认网站正常加载

3. **清除缓存（如果需要）**
   - 如果看到旧版本或 404 错误
   - 按 `Ctrl + Shift + R` (Windows/Linux) 或 `Cmd + Shift + R` (Mac) 强制刷新
   - 或清除浏览器缓存后重新访问

---

## 方法二：使用 Git 命令行（如果网络恢复）

当您的网络连接恢复正常后，可以执行以下命令：

```bash
# 1. 确保在项目根目录
cd /Users/yanbilian/Desktop/AI工程/建德排水/jdpaishui

# 2. 安装依赖（如果还没有）
npm install

# 3. 构建项目
npm run build

# 4. 切换到 gh-pages 分支（如果不存在则创建）
git checkout gh-pages

# 5. 删除当前所有内容
git rm -rf .

# 6. 复制构建产物到根目录
cp -r dist/* .

# 7. 添加所有文件
git add -A

# 8. 提交
git commit -m "Deploy to GitHub Pages"

# 9. 推送到远程
git push -f origin gh-pages

# 10. 返回 main 分支
git checkout main
```

---

## 方法三：使用 GitHub Desktop

如果您安装了 GitHub Desktop：

1. **克隆仓库**（如果还没有）
   - File → Clone repository
   - 选择 `itmelody/jdpaishui`

2. **创建 gh-pages 分支**
   - Current branch → New branch
   - 命名为 `gh-pages`

3. **替换为构建文件**
   - 删除 gh-pages 分支中的所有文件
   - 从 `dist/` 目录复制所有文件到仓库根目录

4. **提交并推送**
   - 在 Summary 中输入提交信息
   - 点击 "Commit to gh-pages"
   - 点击 "Push origin"

5. **启用 GitHub Pages**
   - 按照方法一的步骤 2 操作

---

## 常见问题排查

### 问题 1：网站显示 404

**原因**：GitHub Pages 尚未完成部署或路径配置错误

**解决方案**：
1. 等待 5-10 分钟后重试
2. 检查 `vite.config.ts` 中是否配置了 `base: '/jdpaishui/'`
3. 确认 gh-pages 分支中存在 `index.html` 文件
4. 清除浏览器缓存

### 问题 2：样式或脚本文件加载失败

**原因**：资源路径不正确

**解决方案**：
1. 确认 `vite.config.ts` 中有 `base: '/jdpaishui/'`
2. 重新构建并部署
3. 检查浏览器控制台中的错误信息

### 问题 3：GitHub Actions 部署失败

**原因**：工作流配置问题或权限不足

**解决方案**：
1. 检查 `.github/workflows/deploy.yml` 文件是否存在
2. 在仓库 Settings → Actions → General 中启用 Actions
3. 查看 Actions 标签页中的错误日志
4. 确保有写入 gh-pages 分支的权限

### 问题 4：无法连接到 GitHub

**原因**：网络问题或防火墙限制

**解决方案**：
1. 检查网络连接
2. 尝试使用手机热点
3. 使用代理或 VPN
4. 使用方法一（Web 界面）进行部署

---

## 部署后的维护

### 更新网站内容

每次修改代码后：

1. **提交到 main 分支**
   ```bash
   git add .
   git commit -m "your changes"
   git push origin main
   ```

2. **GitHub Actions 自动部署**（如果已启用）
   - 等待 2-5 分钟
   - 查看 Actions 标签页确认部署成功

3. **手动部署**（如果 Actions 未启用）
   - 重复上述部署步骤

### 检查部署状态

运行项目中的检查脚本：
```bash
./check-deploy.sh
```

或访问：
- GitHub Actions: https://github.com/itmelody/jdpaishui/actions
- Pages 设置: https://github.com/itmelody/jdpaishui/settings/pages

---

## 需要帮助？

如果遇到问题，请：

1. 检查 GitHub Issues: https://github.com/itmelody/jdpaishui/issues
2. 查看 README.md 中的部署说明
3. 联系项目维护者

---

**最后更新**: 2026年6月17日  
**项目地址**: https://github.com/itmelody/jdpaishui
