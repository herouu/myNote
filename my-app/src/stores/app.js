import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { notesApi } from '../js/api/notesApi';

export const useAppStore = defineStore('app', () => {
  // State
  const title = ref('我的便签');
  const notes = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // Getters
  const noteCount = computed(() => notes.value.length);
  const recentNotes = computed(() => {
    return notes.value
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);
  });

  // Actions - 调用 Cloudflare Worker API
  async function addNote(note) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await notesApi.create({
        title: note.title || '新建便签',
        content: note.content || '',
      });
      if (response.success) {
        notes.value.unshift(response.data);
        return response.data;
      } else {
        error.value = response.error;
        throw new Error(response.error);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function updateNote(id, updates) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await notesApi.update(id, updates);
      if (response.success) {
        const index = notes.value.findIndex(n => n.id === id);
        if (index !== -1) {
          notes.value[index] = { ...notes.value[index], ...updates };
        }
        return response.data;
      } else {
        error.value = response.error;
        throw new Error(response.error);
      }
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteNote(id) {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await notesApi.delete(id);
      if (response.success) {
        notes.value = notes.value.filter(n => n.id !== id);
      } else {
        error.value = response.error;
        throw new Error(response.error);
      }
    } finally {
      isLoading.value = false;
    }
  }

  function getNoteById(id) {
    return notes.value.find(n => n.id === id);
  }

  async function loadNotes() {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await notesApi.list();
      if (response.success) {
        notes.value = response.data || [];
      } else {
        // API 失败时回退到本地存储
        console.warn('API 不可用，回退到本地存储');
        const stored = localStorage.getItem('notes');
        if (stored) {
          notes.value = JSON.parse(stored);
        }
        error.value = response.error;
      }
    } catch (e) {
      // 网络错误时回退到本地存储
      console.warn('网络错误，回退到本地存储:', e.message);
      const stored = localStorage.getItem('notes');
      if (stored) {
        notes.value = JSON.parse(stored);
      }
      error.value = e.message;
    } finally {
      isLoading.value = false;
    }
  }

  // 同步到本地存储（备份）
  function syncToLocal() {
    localStorage.setItem('notes', JSON.stringify(notes.value));
  }

  return {
    title,
    notes,
    noteCount,
    recentNotes,
    isLoading,
    error,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    loadNotes,
    syncToLocal,
  };
});
