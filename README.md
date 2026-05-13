# myNote 便签应用

手绘风格的跨平台便签应用，基于 Vue 3 + Capacitor + Cloudflare Workers。

## 项目结构

```
myNote/
├── my-app/           # 前端应用 (Vue 3 + Vite + Capacitor)
├── my-app-worker/    # 后端 API (Cloudflare Workers + Hono + D1)
└── package.json      # 根目录脚本（同时启动前后端）
```

## 快速开始

### 安装依赖

```bash
# 安装根目录依赖（concurrently）
npm install

# 或分别安装子项目依赖
npm run install:all
```

### 开发模式

**方式一：根目录一键启动（推荐）**

| 命令 | 说明 |
|------|------|
| `npm run dev` | 同时启动后端+前端（开发环境） |
| `npm run dev:prod` | 同时启动后端+前端（生产环境预览） |

**方式二：分别启动**

| 命令 | 说明 |
|------|------|
| `npm run dev:worker` | 只启动后端（开发环境） |
| `npm run dev:worker:prod` | 只启动后端（生产环境） |
| `npm run dev:app` | 只启动前端（开发环境） |
| `npm run dev:app:prod` | 只启动前端（生产环境） |

### 构建与打包

| 命令 | 说明 |
|------|------|
| `npm run build` | 构建前端开发版本 |
| `npm run build:prod` | 构建前端生产版本 |
| `npm run sync:android` | 同步到 Android |
| `npm run sync:android:prod` | 构建生产版本并同步到 Android |
| `npm run deploy` | 发布后端到 Cloudflare Workers |

### Android 打包

```bash
cd my-app/android
./gradlew assembleRelease
```

APK 输出位置：`android/app/build/outputs/apk/release/app-release.apk`

## 前端命令 (my-app/)

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式启动（开发环境） |
| `npm run dev:prod` | 开发模式启动（生产环境） |
| `npm run build` | 构建开发版本 |
| `npm run build:prod` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run sync` | 同步到 Android |

## 后端命令 (my-app-worker/)

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Cloudflare Worker |
| `npm run deploy` | 部署到生产环境 |

### D1 数据库操作

```bash
# 本地数据库
npm run d1:init:local    # 初始化本地数据库
npm run d1:seed:local    # 填充测试数据

# 远程数据库
npm run d1:create:remote # 创建远程数据库
npm run d1:init:remote   # 初始化远程数据库
npm run d1:seed:remote   # 填充测试数据
npm run d1:export        # 导出远程数据库
```

## 环境变量

前端环境配置文件位于 `my-app/src/` 目录：

| 文件 | 说明 |
|------|------|
| `.env.development` | 开发环境 (`http://localhost:8787`) |
| `.env.production` | 生产环境 (`https://herouu.xx.kg`) |

## 开发调试

### 移动端真机调试（局域网）

1. **查看本机局域网 IP**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig | grep inet
   ```
   通常是 `192.168.x.x` 格式。

2. **配置前端 API 地址**
   修改 `my-app/src/.env.development`：
   ```env
   VITE_API_URL=http://192.168.x.x:8787
   ```

3. **启动服务**
   ```bash
   npm run dev
   ```

4. **配置 Android HTTP 权限**
   如果使用 HTTP（Android 9+ 默认禁止），需要在 `android/app/src/main/res/xml/network_security_config.xml` 中添加：
   ```xml
   <domain-config cleartextTrafficPermitted="true">
       <domain includeSubdomains="true">192.168.x.x</domain>
   </domain-config>
   ```

5. **同步并运行**
   ```bash
   npm run sync:android
   ```
   然后在 Android Studio 中 Run 应用。

### vConsole 移动端日志

开发模式下自动启用 vConsole，可查看 Console、Network 等调试信息。

## 技术栈

- **前端**: Vue 3 + Vite + Pinia + Vue Router + Roughness
- **移动端**: Capacitor (Android/iOS)
- **后端**: Cloudflare Workers + Hono + D1
- **部署**: Cloudflare Pages/Workers

---

## TODO List

### 页面与交互
- [x] 列表页 - 便签卡片展示、新建按钮
- [x] 详情页 - Markdown 编辑、预览切换、工具栏
- [x] 列表页标题栏固定 + 分割线
- [x] 长按删除交互（移动端触摸 + 桌面端右键）
- [x] 卡片左右侧框线显示
- [x] roughness 组件库集成（RCard、RButton、RDivider）
- [x] 详情页 Markdown 语法支持（工具栏 + 编辑/预览切换）
- [ ] 列表页下拉刷新
- [ ] 列表页搜索/筛选功能
- [ ] 便签置顶/收藏功能
- [ ] 便签分类/标签
- [ ] 便签拖拽排序

### 功能增强
- [x] Pinia 状态管理
- [x] Markdown 编辑工具栏（标题、加粗、斜体、列表、代码块等）
- [ ] 图片插入与预览
- [ ] 语音输入
- [ ] 便签分享（导出为图片/文本）
- [ ] 多选批量操作
- [ ] 撤销/重做
- [ ] 回收站（软删除）

### 样式与体验
- [x] 手绘风格 UI（roughness 组件库）
- [x] 卡片折叠角效果
- [x] 暖灰色调主题
- [ ] 深色模式适配
- [ ] 自定义主题色
- [ ] 字体大小调节
- [ ] 动画与过渡优化
- [ ] 骨架屏加载态

### 移动端适配
- [x] Capacitor 跨平台集成
- [x] 触摸长按删除
- [x] 移动端右键菜单拦截
- [ ] iOS 原生功能适配（相机、相册）
- [ ] Android 原生功能适配
- [ ] 离线缓存与 PWA
- [ ] 推送通知

### 工程化
- [x] Vue 3 + Vite 项目搭建
- [x] Vue Router 路由管理
- [x] 环境变量配置 (dev/production)
- [ ] 单元测试（Vitest）
- [ ] E2E 测试（Playwright）
- [ ] ESLint + Prettier 代码规范
- [ ] CI/CD 自动化部署
- [ ] 错误监控与日志上报
- [ ] 性能监控

### 数据与同步
- [x] Cloudflare D1 数据库
- [x] Cloudflare Workers API
- [ ] 用户认证登录
- [ ] 多设备数据同步
- [ ] 数据导入/导出
