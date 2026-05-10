/**
 * Cloudflare Workers 主入口
 * 处理所有 API 请求
 */

import { Env, notesApi, handleCors } from './d1';

// 请求路由处理
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // 处理 CORS 预检请求
    if (method === 'OPTIONS') {
      return handleCors();
    }

    // API 路由
    try {
      // 健康检查
      if (path === '/health' && method === 'GET') {
        return new Response(JSON.stringify({ status: 'ok', timestamp: Date.now() }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 笔记 API
      if (path === '/api/notes' || path.startsWith('/api/notes/')) {
        return handleNotesApi(path, method, request, env);
      }

      // 404
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

// 笔记 API 路由处理
async function handleNotesApi(
  path: string,
  method: string,
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);

  // GET /api/notes - 获取所有笔记或搜索
  if (path === '/api/notes' && method === 'GET') {
    const query = url.searchParams.get('q');
    if (query) {
      return notesApi.search(env, query);
    }
    return notesApi.list(env);
  }

  // POST /api/notes - 创建笔记
  if (path === '/api/notes' && method === 'POST') {
    const body = await request.json();
    return notesApi.create(env, body);
  }

  // GET /api/notes/:id - 获取单个笔记
  if (path.match(/^\/api\/notes\/[^/]+$/) && method === 'GET') {
    const id = path.split('/')[3];
    return notesApi.get(env, id);
  }

  // PUT /api/notes/:id - 更新笔记
  if (path.match(/^\/api\/notes\/[^/]+$/) && method === 'PUT') {
    const id = path.split('/')[3];
    const body = await request.json();
    return notesApi.update(env, id, body);
  }

  // DELETE /api/notes/:id - 删除笔记
  if (path.match(/^\/api\/notes\/[^/]+$/) && method === 'DELETE') {
    const id = path.split('/')[3];
    return notesApi.delete(env, id);
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

// TypeScript 类型声明
declare const process: {
  env: Record<string, string>;
};
