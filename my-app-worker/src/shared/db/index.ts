/**
 * 数据库接口定义
 */

import { z } from 'zod';

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NotesRepository {
  list(): Promise<Note[]>;
  get(id: string): Promise<Note | null>;
  create(data: { title: string; content: string }): Promise<Note>;
  update(id: string, data: { title?: string; content?: string }): Promise<Note | null>;
  delete(id: string): Promise<boolean>;
  search(query: string): Promise<Note[]>;
}

// Zod Schemas for OpenAPI
export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const NoteListSchema = z.array(NoteSchema);

export const CreateNoteSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  content: z.string(),
});

export const UpdateNoteSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;
