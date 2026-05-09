import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  // State
  const title = ref('我的便签');
  
  // 便签数据
  const notes = ref([]);
  
  // Getters
  const noteCount = computed(() => notes.value.length);
  const recentNotes = computed(() => {
    return notes.value
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  });

  // Actions
  function addNote(note) {
    const newNote = {
      id: Date.now().toString(),
      title: note.title || '新建便签',
      content: note.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: note.color || '#fff9c4',
    };
    notes.value.push(newNote);
    saveNotes();
    return newNote;
  }

  function updateNote(id, updates) {
    const index = notes.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveNotes();
    }
  }

  function deleteNote(id) {
    notes.value = notes.value.filter(n => n.id !== id);
    saveNotes();
  }

  function getNoteById(id) {
    return notes.value.find(n => n.id === id);
  }

  function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes.value));
  }

  function loadNotes() {
    const stored = localStorage.getItem('notes');
    if (stored) {
      notes.value = JSON.parse(stored);
    }
  }

  return {
    title,
    notes,
    noteCount,
    recentNotes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    saveNotes,
    loadNotes,
  };
});
