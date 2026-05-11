/**
 * Node.js 服务端入口
 */

import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createSqliteRepository } from './db/sqlite';
import { createApp } from '../shared/app';

// ============ 数据库初始化 ============

const DB_PATH = process.env.DB_PATH || './data/notes.db';
const DATA_DIR = path.dirname(path.resolve(DB_PATH));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
`);

const count = db.prepare('SELECT COUNT(*) as count FROM notes').get() as { count: number };
if (count.count === 0) {
  const now = new Date().toISOString();
  db.prepare('INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), '欢迎使用 myNote', 'Hono + SQLite 笔记应用', now, now);
  db.prepare('INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)')
    .run(crypto.randomUUID(), '使用指南', '### 功能特性\n\n- 📝 创建笔记\n- 🔍 搜索功能', now, now);
}

// ============ 启动 ============

const repo = createSqliteRepository(db);
const app = createApp(repo);
app.use('*', logger());

const PORT = parseInt(process.env.PORT || '3000');

console.log(`🚀 myNote API - http://localhost:${PORT}`);
serve({ fetch: app.fetch, port: PORT });

process.on('SIGTERM', () => { db.close(); process.exit(0); });
