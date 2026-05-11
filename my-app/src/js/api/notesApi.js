/**
 * Cloudflare Workers API 客户端
 * 用于前端调用后端 API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787';

class NotesApi {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
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
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  // 获取所有笔记
  async list() {
    return this.request('/api/notes');
  }

  // 获取单个笔记
  async get(id) {
    return this.request(`/api/notes/${id}`);
  }

  // 创建笔记
  async create(data) {
    return this.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 更新笔记
  async update(id, data) {
    return this.request(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // 删除笔记
  async delete(id) {
    return this.request(`/api/notes/${id}`, {
      method: 'DELETE',
    });
  }

  // 搜索笔记
  async search(query) {
    return this.request(`/api/notes?q=${encodeURIComponent(query)}`);
  }

  // 健康检查
  async health() {
    return this.request('/health');
  }
}

// 导出单例
export const notesApi = new NotesApi();

// 导出类以支持自定义 API 地址
export { NotesApi };
