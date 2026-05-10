/**
 * Cloudflare Workers - D1 数据库操作封装
 * D1 是 Cloudflare 的边缘 SQLite 数据库
 */

export interface Env {
  DB: D1Database;
  // CACHE?: KVNamespace;  // 如果需要 KV
}

// 类型定义
export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 通用响应包装
function jsonResponse<T>(data: T, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      ...init?.headers,
    },
  });
}

// CORS 预检请求处理
export function handleCors(): Response {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// 笔记相关 API
export const notesApi = {
  // 获取所有笔记
  async list(env: Env): Promise<Response> {
    try {
      const { results } = await env.DB
        .prepare('SELECT * FROM notes ORDER BY updated_at DESC')
        .all<Note>();
      
      return jsonResponse<Note[]>({
        success: true,
        data: results,
      });
    } catch (error: any) {
      return jsonResponse<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
  },

  // 获取单个笔记
  async get(env: Env, id: string): Promise<Response> {
    try {
      const result = await env.DB
        .prepare('SELECT * FROM notes WHERE id = ?')
        .bind(id)
        .first<Note>();
      
      if (!result) {
        return jsonResponse<ApiResponse>({
          success: false,
          error: 'Note not found',
        }, { status: 404 });
      }
      
      return jsonResponse<Note>({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return jsonResponse<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
  },

  // 创建笔记
  async create(env: Env, data: { title: string; content: string }): Promise<Response> {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      await env.DB
        .prepare(
          'INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
        )
        .bind(id, data.title, data.content, now, now)
        .run();
      
      return jsonResponse<Note>({
        success: true,
        data: { id, ...data, created_at: now, updated_at: now },
      }, { status: 201 });
    } catch (error: any) {
      return jsonResponse<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
  },

  // 更新笔记
  async update(env: Env, id: string, data: { title?: string; content?: string }): Promise<Response> {
    try {
      const now = new Date().toISOString();
      const updates: string[] = ['updated_at = ?'];
      const values: any[] = [now];
      
      if (data.title !== undefined) {
        updates.push('title = ?');
        values.push(data.title);
      }
      if (data.content !== undefined) {
        updates.push('content = ?');
        values.push(data.content);
      }
      
      values.push(id);
      
      const result = await env.DB
        .prepare(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();
      
      if (result.meta.changes === 0) {
        return jsonResponse<ApiResponse>({
          success: false,
          error: 'Note not found',
        }, { status: 404 });
      }
      
      return jsonResponse<ApiResponse>({
        success: true,
        data: { id, ...data, updated_at: now },
      });
    } catch (error: any) {
      return jsonResponse<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
  },

  // 删除笔记
  async delete(env: Env, id: string): Promise<Response> {
    try {
      const result = await env.DB
        .prepare('DELETE FROM notes WHERE id = ?')
        .bind(id)
        .run();
      
      if (result.meta.changes === 0) {
        return jsonResponse<ApiResponse>({
          success: false,
          error: 'Note not found',
        }, { status: 404 });
      }
      
      return jsonResponse<ApiResponse>({
        success: true,
        data: { deleted: true },
      });
    } catch (error: any) {
      return jsonResponse<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
  },

  // 搜索笔记
  async search(env: Env, query: string): Promise<Response> {
    try {
      const { results } = await env.DB
        .prepare(
          'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC'
        )
        .bind(`%${query}%`, `%${query}%`)
        .all<Note>();
      
      return jsonResponse<Note[]>({
        success: true,
        data: results,
      });
    } catch (error: any) {
      return jsonResponse<ApiResponse>({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
  },
};
