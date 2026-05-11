# myNote API

同时支持 **Cloudflare Workers** 和 **Node.js** 的笔记后端 API。

## 两种部署方案

### 方案 1: Cloudflare Workers（免费）

```bash
npm install
npm run dev        # 本地开发
npm run deploy     # 部署到 Cloudflare
```

### 方案 2: Node.js / Docker（自托管）

```bash
npm install
npm run build      # 编译 TypeScript
npm run server     # 启动服务

# 或使用 Docker
docker-compose up -d
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| PORT | 3000 | 服务端口 (Node.js) |
| DB_PATH | ./data/notes.db | 数据库路径 |

## API 文档

启动服务后访问：**http://localhost:8787/docs**（或 :3000）

- `/docs` - Swagger UI 交互式文档
- `/openapi.json` - OpenAPI 规范 JSON

## API 端点

### 健康检查

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | /health | 服务健康检查 |

### 笔记管理

| 方法 | 端点 | 描述 | 请求体 |
|------|------|------|--------|
| GET | /api/notes | 获取所有笔记 | - |
| GET | /api/notes?q=keyword | 搜索笔记 | - |
| GET | /api/notes/:id | 获取单个笔记 | - |
| POST | /api/notes | 创建笔记 | `{ "title": "string", "content": "string" }` |
| PUT | /api/notes/:id | 更新笔记 | `{ "title": "string", "content": "string" }` |
| DELETE | /api/notes/:id | 删除笔记 | - |

### 请求/响应示例

**创建笔记 POST /api/notes**
```json
// Request
{ "title": "新笔记", "content": "笔记内容" }

// Response 201
{ "success": true, "data": { "id": "uuid", "title": "新笔记", "content": "笔记内容", "created_at": "2024-01-01T00:00:00.000Z", "updated_at": "2024-01-01T00:00:00.000Z" } }
```

**搜索笔记 GET /api/notes?q=关键词**
```json
// Response
{ "success": true, "data": [{ "id": "uuid", "title": "匹配的笔记", ... }] }
```

**错误响应**
```json
{ "success": false, "error": "错误信息" }
```

## 架构

```
src/
├── db.ts       # 数据库接口定义
├── sqlite.ts   # SQLite 适配器 (Node.js)
├── d1.ts       # D1 适配器 (Cloudflare)
├── routes.ts   # API 路由逻辑
├── worker.ts   # Cloudflare Workers 入口
└── server.ts   # Node.js 服务入口
```

数据层抽象 + 统一的路由逻辑 = 一套代码，两个平台！
