# 🌊 建德市城镇排水系统智慧运营平台

一个基于 Vue 3 + TypeScript + Ant Design Vue 的现代化排水管理系统前端应用。

## 🚀 在线访问

项目已部署到 GitHub Pages，可通过以下地址访问：

**[https://itmelody.github.io/jdpaishui/](https://itmelody.github.io/jdpaishui/)**

> ⚠️ **注意**：首次访问可能需要等待几分钟让 GitHub Pages 完成部署。如果看到 404 错误，请稍后再试或清除浏览器缓存。

##  功能特性

### 核心模块
- **工作台** - 数据概览和待办事项管理
- **排水管网监管** - 管网资产管理和监控
- **排水户监管** - 排水用户信息管理
- **巡检养护** - 设备巡检和维护记录
- **预警工单** - 异常告警和工单处理
- **实时监测** - 实时数据采集和展示
- **工程管理** - 工程项目进度跟踪
- **排水一张图** - GIS 地图可视化

### 技术特点
- 🎨 响应式设计，适配多种屏幕尺寸
- 📊 ECharts 数据可视化图表
- 🎯 TypeScript 全栈类型支持
-  Vite 快速热更新开发体验
- 🎭 Ant Design Vue 企业级 UI 组件库

## ️ 技术栈

- **前端框架**: Vue 3.5+ (Composition API)
- **构建工具**: Vite 8.0+
- **编程语言**: TypeScript 6.0+
- **UI 组件库**: Ant Design Vue 4.x
- **状态管理**: Pinia 3.0+
- **路由管理**: Vue Router 5.0+
- **样式预处理**: SCSS / sass-embedded
- **图表库**: ECharts 5.x
- **图标库**: @ant-design/icons-vue

## 📦 安装与运行

### 前置要求
- Node.js 20.x 或更高版本
- npm 或 pnpm 包管理器

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173/

### 生产构建
```bash
npm run build
```
构建产物位于 `dist/` 目录

### 预览构建结果
```bash
npm run preview
```

## 🚢 部署

### GitHub Pages 自动部署（推荐）

项目已配置 GitHub Actions 工作流，每次推送到 `main` 分支会自动触发部署：

1. 推送代码到 main 分支
2. GitHub Actions 自动运行构建和部署
3. 查看 Actions 标签页了解部署进度

### 手动部署

如果需要手动部署到 gh-pages 分支：

```bash
# 构建项目
npm run build

# 创建并切换到 gh-pages 分支
git checkout --orphan gh-pages

# 删除当前所有内容
git rm -rf .

# 复制构建产物到根目录
cp -r dist/* .

# 提交并推送
git add -A
git commit -m "Deploy to GitHub Pages"
git push -f origin gh-pages

# 返回 main 分支
git checkout main
```

## 📁 项目结构

```
jdpaishui/
├── .github/workflows/      # GitHub Actions 工作流
│   └── deploy.yml          # 自动部署配置
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 项目资源（图片、样式等）
│   │   ├── styles/        # SCSS 样式文件
│   │   │   ├── variables.scss  # SCSS 变量
│   │   │   └── base.scss       # 基础样式
│   │   └── ...
│   ├── components/        # 可复用组件
│   ├── config/            # 配置文件
│   │   └── theme.ts       # Ant Design 主题配置
│   ├── layouts/           # 布局组件
│   │   ── MainLayout.vue # 主布局（顶部导航 + 内容区）
│   ├── router/            # 路由配置
│   │   └── index.ts
│   ├── views/             # 页面视图
│   │   ├── workbench/     # 工作台
│   │   ├── drainage-network/    # 排水管网监管
│   │   ├── drainage-user/       # 排水户监管
│   │   ├── inspection-maintenance/  # 巡检养护
│   │   ├── warning-workorder/     # 预警工单
│   │   ├── realtime-monitoring/   # 实时监测
│   │   ├── engineering-management/ # 工程管理
│   │   └── drainage-map/         # 排水一张图
│   ├── App.vue            # 根组件
│   └── main.ts            # 应用入口
── index.html             # HTML 模板
├── package.json           # 项目依赖和脚本
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── vercel.json            # Vercel 部署配置（可选）
```

## 🎨 自定义主题

修改 `src/config/theme.ts` 可以自定义 Ant Design Vue 主题：

```typescript
export const antdThemeConfig = {
  token: {
    colorPrimary: '#1890ff',  // 主色调
    borderRadius: 4,           // 圆角
    fontFamily: '...',         // 字体
  },
}
```

## 🔧 开发指南

### 添加新页面

1. 在 `src/views/` 下创建新的页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/layouts/MainLayout.vue` 中添加菜单项

### 使用 SCSS 变量

所有 `.scss` 文件都可以直接使用全局变量：

```scss
.my-component {
  color: $primary-color;
  font-size: $font-size-base;
}
```

### 路径别名

使用 `@` 别名引用 src 目录下的文件：

```typescript
import MyComponent from '@/components/MyComponent.vue'
```

## 📝 更新日志

### v1.0.0 (2026-06-17)
- ✅ 初始版本发布
- ✅ 完整的项目架构搭建
- ✅ 8个核心功能模块
- ✅ 工作台页面完整实现
- ✅ GitHub Pages 自动部署配置
- ✅ 响应式布局设计

##  贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**开发团队**: 建德市城镇排水系统项目组  
**最后更新**: 2026年6月17日
