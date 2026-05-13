/**
 * Notes Routes with OpenAPI
 */

import { createRoute, OpenAPIHono } from '@hono/zod-openapi';
import { z } from 'zod';
import type { NotesRepository } from '../db';

const NoteSchema = z.object({
  id: z.string().openapi({ example: 'abc-123' }),
  title: z.string().openapi({ example: 'My Note' }),
  content: z.string().openapi({ example: 'Note content' }),
  created_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  updated_at: z.string().openapi({ example: '2024-01-01T00:00:00.000Z' }),
});

const CreateNoteSchema = z.object({
  title: z.string().min(1).openapi({ example: 'New Note' }),
  content: z.string().openapi({ example: 'Note content' }),
});

const UpdateNoteSchema = z.object({
  title: z.string().optional().openapi({ example: 'Updated Title' }),
  content: z.string().optional().openapi({ example: 'Updated content' }),
});

const ErrorSchema = z.object({
  success: z.boolean(),
  error: z.string(),
});

const SuccessSchema = z.object({
  success: z.boolean(),
  data: z.any(),
});

export const listNotesRoute = createRoute({
  method: 'get',
  path: '/api/notes',
  summary: 'List all notes',
  request: {
    query: z.object({
      q: z.string().optional().openapi({ param: { name: 'q', in: 'query' }, description: 'Search keyword' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: SuccessSchema.extend({ data: z.array(NoteSchema) }) } },
      description: 'List of notes',
    },
  },
});

export const getNoteRoute = createRoute({
  method: 'get',
  path: '/api/notes/{id}',
  summary: 'Get a note',
  request: {
    params: z.object({ id: z.string().openapi({ param: { name: 'id', in: 'path' }, required: ['id'] }) }),
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessSchema.extend({ data: NoteSchema }) } }, description: 'Note details' },
    404: { content: { 'application/json': { schema: ErrorSchema } }, description: 'Not found' },
  },
});

export const createNoteRoute = createRoute({
  method: 'post',
  path: '/api/notes',
  summary: 'Create a note',
  request: { body: { content: { 'application/json': { schema: CreateNoteSchema } } } },
  responses: {
    201: { content: { 'application/json': { schema: SuccessSchema.extend({ data: NoteSchema }) } }, description: 'Created' },
    400: { content: { 'application/json': { schema: ErrorSchema } }, description: 'Bad request' },
  },
});

export const updateNoteRoute = createRoute({
  method: 'put',
  path: '/api/notes/{id}',
  summary: 'Update a note',
  request: {
    params: z.object({ id: z.string().openapi({ param: { name: 'id', in: 'path' }, required: ['id'] }) }),
    body: { content: { 'application/json': { schema: UpdateNoteSchema } } },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessSchema.extend({ data: NoteSchema }) } }, description: 'Updated' },
    404: { content: { 'application/json': { schema: ErrorSchema } }, description: 'Not found' },
  },
});

export const deleteNoteRoute = createRoute({
  method: 'delete',
  path: '/api/notes/{id}',
  summary: 'Delete a note',
  request: {
    params: z.object({ id: z.string().openapi({ param: { name: 'id', in: 'path' }, required: ['id'] }) }),
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessSchema } }, description: 'Deleted' },
    404: { content: { 'application/json': { schema: ErrorSchema } }, description: 'Not found' },
  },
});

export function registerRoutes(app: OpenAPIHono, repo: NotesRepository) {
  app.openapi(listNotesRoute, async (c) => {
    const { q } = c.req.valid('query');
    try {
      const data = q?.trim() ? await repo.search(q) : await repo.list();
      return c.json({ success: true, data });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });

  app.openapi(getNoteRoute, async (c) => {
    const { id } = c.req.valid('param');
    try {
      const note = await repo.get(id);
      if (!note) return c.json({ success: false, error: 'Not found' }, 404);
      return c.json({ success: true, data: note });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });

  app.openapi(createNoteRoute, async (c) => {
    const body = c.req.valid('json');
    try {
      const data = await repo.create(body);
      return c.json({ success: true, data }, 201);
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });

  app.openapi(updateNoteRoute, async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    try {
      const note = await repo.update(id, body);
      if (!note) return c.json({ success: false, error: 'Not found' }, 404);
      return c.json({ success: true, data: note });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });

  app.openapi(deleteNoteRoute, async (c) => {
    const { id } = c.req.valid('param');
    try {
      const deleted = await repo.delete(id);
      if (!deleted) return c.json({ success: false, error: 'Not found' }, 404);
      return c.json({ success: true, data: { deleted: true } });
    } catch (e: any) {
      return c.json({ success: false, error: e.message }, 500);
    }
  });
}

export function createNotesRoutes(repo: NotesRepository) {
  return {
    list: async (c: any) => {
      const q = c.req.query('q');
      try {
        const data = q?.trim() ? await repo.search(q) : await repo.list();
        return c.json({ success: true, data });
      } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
      }
    },
    get: async (c: any) => {
      try {
        const note = await repo.get(c.req.param('id'));
        if (!note) return c.json({ success: false, error: 'Not found' }, 404);
        return c.json({ success: true, data: note });
      } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
      }
    },
    create: async (c: any) => {
      try {
        const body = await c.req.json();
        const data = await repo.create(body);
        return c.json({ success: true, data }, 201);
      } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
      }
    },
    update: async (c: any) => {
      try {
        const body = await c.req.json();
        const note = await repo.update(c.req.param('id'), body);
        if (!note) return c.json({ success: false, error: 'Not found' }, 404);
        return c.json({ success: true, data: note });
      } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
      }
    },
    delete: async (c: any) => {
      try {
        const deleted = await repo.delete(c.req.param('id'));
        if (!deleted) return c.json({ success: false, error: 'Not found' }, 404);
        return c.json({ success: true, data: { deleted: true } });
      } catch (e: any) {
        return c.json({ success: false, error: e.message }, 500);
      }
    },
  };
}
