/**
 * Cloudflare Workers API 客户端
 * 用于前端调用后端 API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

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

class NotesApi {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  // 获取所有笔记
  async list(): Promise<ApiResponse<Note[]>> {
    return this.request<Note[]>('/api/notes');
  }

  // 获取单个笔记
  async get(id: string): Promise<ApiResponse<Note>> {
    return this.request<Note>(`/api/notes/${id}`);
  }

  // 创建笔记
  async create(data: { title: string; content: string }): Promise<ApiResponse<Note>> {
    return this.request<Note>('/api/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 更新笔记
  async update(id: string, data: { title?: string; content?: string }): Promise<ApiResponse<Note>> {
    return this.request<Note>(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 删除笔记
  async delete(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    return this.request<{ deleted: boolean }>(`/api/notes/${id}`, {
      method: 'DELETE',
    });
  }

  // 搜索笔记
  async search(query: string): Promise<ApiResponse<Note[]>> {
    return this.request<Note[]>(`/api/notes?q=${encodeURIComponent(query)}`);
  }

  // 健康检查
  async health(): Promise<ApiResponse<{ status: string }>> {
    return this.request<{ status: string }>('/health');
  }
}

// 导出单例
export const notesApi = new NotesApi();

// 导出类以支持自定义 API 地址
export { NotesApi };
