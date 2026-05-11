/**
 * Hono App with OpenAPI
 */

import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { swaggerUI } from '@hono/swagger-ui';
import type { NotesRepository } from './db';
import { registerRoutes } from './routes/notes';

export function createApp(repo: NotesRepository) {
  const app = new OpenAPIHono();

  // CORS 配置
  app.use('*', cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }));

  app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }));

  // 注册路由后，OpenAPI 文档会在 /openapi.json 可用
  registerRoutes(app, repo);

  // OpenAPI 文档路由（需要在路由注册后）
  app.doc('/openapi.json', {
    openapi: '3.0.0',
    info: {
      title: 'MyNote API',
      version: '1.0.0',
    },
  });

  app.get('/docs', swaggerUI({ url: '/openapi.json' }));

  return app;
}
