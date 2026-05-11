/**
 * SQLite 数据库适配器
 */

import Database from 'better-sqlite3';
import crypto from 'crypto';
import type { NotesRepository, Note } from '../../shared/db';

export function createSqliteRepository(db: Database.Database): NotesRepository {
  return {
    list(): Note[] {
      return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all() as Note[];
    },

    get(id: string): Note | null {
      return db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as Note | undefined ?? null;
    },

    create(data: { title: string; content: string }): Note {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      db.prepare('INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
        .run(id, data.title, data.content, now, now);
      return { id, ...data, created_at: now, updated_at: now };
    },

    update(id: string, data: { title?: string; content?: string }): Note | null {
      if (!this.get(id)) return null;

      const now = new Date().toISOString();
      const updates: string[] = ['updated_at = ?'];
      const values: any[] = [now];

      if (data.title !== undefined) { updates.push('title = ?'); values.push(data.title); }
      if (data.content !== undefined) { updates.push('content = ?'); values.push(data.content); }
      values.push(id);

      db.prepare(`UPDATE notes SET ${updates.join(', ')} WHERE id = ?`).run(...values);
      return this.get(id);
    },

    delete(id: string): boolean {
      const result = db.prepare('DELETE FROM notes WHERE id = ?').run(id);
      return result.changes > 0;
    },

    search(query: string): Note[] {
      const term = `%${query}%`;
      return db.prepare('SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC')
        .all(term, term) as Note[];
    },
  };
}
