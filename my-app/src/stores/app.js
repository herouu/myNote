import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAppStore = defineStore('app', () => {
  // State
  const title = ref('Capacitor + Vue 3');
  const photoCount = ref(0);

  // Getters
  const greeting = computed(() => {
    return `Welcome to ${title.value}!`;
  });

  // Actions
  function incrementPhotoCount() {
    photoCount.value++;
  }

  function updateTitle(newTitle) {
    title.value = newTitle;
  }

  return {
    title,
    photoCount,
    greeting,
    incrementPhotoCount,
    updateTitle,
  };
});
