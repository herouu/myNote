/**
 * Cloudflare Workers API 类型定义
 */

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

export interface Tag {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  last_login?: string;
}

export interface Attachment {
  id: string;
  note_id: string;
  filename: string;
  filepath: string;
  filesize: number;
  mimetype?: string;
  created_at: string;
}
