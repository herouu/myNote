# Cloudflare Workers & D1 集成指南

本项目已集成 Cloudflare Workers 和 D1 数据库，为笔记应用提供后端 API 服务。

## 目录结构

```
my-app/
├── wrangler.toml           # Cloudflare Workers 配置
├── .dev.vars.example       # 环境变量模板
├── database/
│   ├── schema.sql         # D1 数据库结构
│   └── seed.sql           # 示例数据
├── src/
│   ├── workers/
│   │   ├── index.ts       # Workers 主入口
│   │   └── d1.ts          # D1 操作封装
│   └── js/
│       └── api/
│           ├── notesApi.js    # 前端 API 调用
│           └── types.ts       # TypeScript 类型
```

## 快速开始

### 1. 安装依赖

```bash
cd my-app
npm install
```

### 2. 创建 D1 数据库

在本地创建 D1 数据库：

```bash
npx wrangler d1 create mynote-db
```

命令执行后会返回 `database_id`，将其填入 `wrangler.toml` 文件中：

```toml
[[d1_databases]]
binding = "DB"
database_name = "mynote-db"
database_id = "YOUR_DATABASE_ID_HERE"
```

### 3. 初始化数据库

执行数据库迁移：

```bash
# 本地环境
npx wrangler d1 execute mynote-db --file=./database/schema.sql --local

# 生产环境
npx wrangler d1 execute mynote-db --file=./database/schema.sql
```

### 4. 启动开发服务器

同时启动前端和 Workers 开发服务器：

```bash
# 终端 1: 启动前端
npm run start

# 终端 2: 启动 Workers
npm run dev:worker
```

Workers 会在 `http://localhost:8787` 运行。

### 5. 部署到 Cloudflare

```bash
# 部署 Workers
npm run deploy:worker
```

## API 端点

| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api/notes` | 获取所有笔记 |
| GET | `/api/notes?q=keyword` | 搜索笔记 |
| GET | `/api/notes/:id` | 获取单个笔记 |
| POST | `/api/notes` | 创建笔记 |
| PUT | `/api/notes/:id` | 更新笔记 |
| DELETE | `/api/notes/:id` | 删除笔记 |

## 前端集成

### 配置环境变量

创建 `.env` 文件：

```env
VITE_API_URL=http://localhost:8787
```

### 使用 API 客户端

```javascript
import { notesApi } from '@/js/api/notesApi';

// 获取所有笔记
const response = await notesApi.list();
if (response.success) {
  console.log(response.data);
}

// 创建笔记
const newNote = await notesApi.create({
  title: '我的笔记',
  content: '笔记内容...'
});

// 搜索笔记
const results = await notesApi.search('关键词');
```

## 常用命令

```bash
# Workers 开发
npm run dev:worker

# Workers 部署
npm run deploy:worker

# D1 数据库操作
npx wrangler d1 execute mynote-db --file=./database/schema.sql --local
npx wrangler d1 execute mynote-db --file=./database/seed.sql --local

# 查看 D1 数据
npx wrangler d1 execute mynote-db --command="SELECT * FROM notes" --local
```

## 生产环境配置

1. 在 [Cloudflare Dashboard](https://dash.cloudflare.com/) 创建 D1 数据库
2. 获取 `database_id` 并更新 `wrangler.toml`
3. 配置自定义域名（可选）
4. 设置环境变量
5. 部署 Workers

## 注意事项

- D1 有 100MB 存储限制
- Workers 每日有 100,000 次免费请求
- 本地开发使用 `--local` 标志不会影响生产数据
