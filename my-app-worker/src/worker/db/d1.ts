/**
 * D1 数据库适配器
 */

import type { NotesRepository, Note } from '../../shared/db';

export function createD1Repository(env: { DB: D1Database }): NotesRepository {
  return {
    async list(): Promise<Note[]> {
      const { results } = await env.DB
        .prepare('SELECT * FROM notes ORDER BY updated_at DESC')
        .all<Note>();
      return results;
    },

    async get(id: string): Promise<Note | null> {
      const result = await env.DB
        .prepare('SELECT * FROM notes WHERE id = ?')
        .bind(id)
        .first<Note>();
      return result ?? null;
    },

    async create(data: { title: string; content: string }): Promise<Note> {
      const id = globalThis.crypto.randomUUID();
      const now = new Date().toISOString();
      await env.DB
        .prepare('INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
        .bind(id, data.title, data.content, now, now)
        .run();
      return { id, ...data, created_at: now, updated_at: now };
    },

    async update(id: string, data: { title?: string; content?: string }): Promise<Note | null> {
      const updates: string[] = ['updated_at = ?'];
      const values: any[] = [new Date().toISOString()];

      if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
      if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
      values.push(id);

      const result = await env.DB
        .prepare(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`)
        .bind(...values)
        .run();

      return result.meta.changes > 0 ? this.get(id) : null;
    },

    async delete(id: string): Promise<boolean> {
      const result = await env.DB
        .prepare('DELETE FROM notes WHERE id = ?')
        .bind(id)
        .run();
      return result.meta.changes > 0;
    },

    async search(query: string): Promise<Note[]> {
      const { results } = await env.DB
        .prepare('SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC')
        .bind(`%${query}%`, `%${query}%`)
        .all<Note>();
      return results;
    },
  };
}
