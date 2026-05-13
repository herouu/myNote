<template>
  <div class="note-edit">
    <!-- 顶部工具栏 -->
    <header class="edit-header">
      <r-button @click="goBack" type="text" size="small" class="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>返回</span>
      </r-button>
      <div class="header-info">
        <span class="edit-date">{{ formatDate(note.updated_at) }}</span>
        <span class="edit-count">{{ charCount }} 字</span>
      </div>
      <div class="header-actions">
        <r-button @click="undo" type="text" :disabled="!canUndo" title="撤销" size="small">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
        </r-button>
        <r-button v-if="!isNew" @click="confirmDelete" type="error" size="small">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </r-button>
      </div>
    </header>

    <!-- 标题输入区 -->
    <div class="title-bar">
      <!-- 标题编辑区 -->
      <input
        v-if="isTitleEditing"
        ref="titleInputRef"
        v-model="note.title"
        class="title-input"
        placeholder="请输入标题..."
        @input="onTitleInput"
        @blur="onTitleBlur"
      />
      <!-- 标题预览区 -->
      <div v-else class="title-preview" @click="startTitleEditing">
        <span v-if="note.title">{{ note.title }}</span>
        <span v-else class="title-placeholder">请输入标题...</span>
      </div>
    </div>

    <!-- 编辑/预览区域 -->
    <div class="edit-body">
      <r-card class="text-area-card">
        <!-- 编辑区 -->
        <div class="edit-area" v-if="isEditing">
          <textarea
            ref="textareaRef"
            v-model="note.content"
            class="md-input"
            placeholder="支持 Markdown 语法输入..."
            @input="onContentInput"
            @blur="onBlur"
          ></textarea>
        </div>
        
        <!-- 预览区 -->
        <div class="preview-area" v-else @click="startEditing">
          <div class="preview-body">
            <div v-if="note.content" class="markdown-body" v-html="renderedContent"></div>
            <div v-else class="preview-placeholder">点击开始编辑...</div>
          </div>
        </div>
      </r-card>
    </div>

    <!-- 底部状态栏 -->
    <footer class="edit-footer">
      <div class="footer-row">
        <span class="save-status" :class="{ saving: isSaving }">
          <svg v-if="isSaving" class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="8" />
          </svg>
          <svg v-else-if="lastSaved" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ saveStatusText }}
        </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';
import { marked } from 'marked';

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
});

const store = useAppStore();
const route = useRoute();
const router = useRouter();
const textareaRef = ref(null);
const titleInputRef = ref(null);

// 编辑状态
const isEditing = ref(false);
const isTitleEditing = ref(false);

// 保存状态
const isSaving = ref(false);
const lastSaved = ref(false);
const saveStatusText = computed(() => {
  if (isSaving.value) return '保存中...';
  if (lastSaved.value) return '已保存';
  return '';
});

// 撤销功能 - 历史栈
const historyStack = ref([]);
const historyIndex = ref(-1);
const maxHistorySize = 50;

const note = ref({
  id: '',
  title: '',
  content: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const isNew = ref(false);
let hasChanges = false;
let pendingSave = false;

// 保存历史记录
const saveHistory = () => {
  const state = { title: note.value.title, content: note.value.content };
  
  // 如果当前不在最新位置，删除后面的历史
  if (historyIndex.value < historyStack.value.length - 1) {
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
  }
  
  // 添加新历史
  historyStack.value.push(state);
  
  // 限制历史记录数量
  if (historyStack.value.length > maxHistorySize) {
    historyStack.value.shift();
  } else {
    historyIndex.value++;
  }
};

// 是否可以撤销
const canUndo = computed(() => historyIndex.value > 0);

// 撤销操作
const undo = () => {
  if (!canUndo.value) return;
  
  historyIndex.value--;
  const state = historyStack.value[historyIndex.value];
  note.value.title = state.title;
  note.value.content = state.content;
  hasChanges = true;
};

const charCount = computed(() => {
  return note.value.content ? note.value.content.length : 0;
});

const renderedContent = computed(() => {
  if (!note.value.content) return '';
  return marked(note.value.content);
});

onMounted(() => {
  store.loadNotes();
  const noteId = route.params.id;

  if (noteId === 'new') {
    isNew.value = true;
    note.value.color = '#fffef7';
  } else if (noteId) {
    const existingNote = store.getNoteById(noteId);
    if (existingNote) {
      note.value = { ...existingNote };
    } else {
      router.push('/');
    }
  }
  
  // 初始化历史记录
  saveHistory();
});

// 标题输入处理
const onTitleInput = () => {
  hasChanges = true;
  lastSaved.value = false;
  // 节流保存历史
  clearTimeout(window._historyTimer);
  window._historyTimer = setTimeout(() => {
    saveHistory();
  }, 500);
};

// 开始编辑标题
const startTitleEditing = () => {
  isTitleEditing.value = true;
  nextTick(() => {
    titleInputRef.value?.focus();
  });
};

// 标题失去光标保存并切换到预览
const onTitleBlur = async () => {
  isTitleEditing.value = false;
  
  if (!hasChanges) return;
  if (pendingSave) return;
  
  pendingSave = true;
  isSaving.value = true;
  
  try {
    await saveNote();
    lastSaved.value = true;
  } finally {
    pendingSave = false;
    setTimeout(() => {
      isSaving.value = false;
    }, 500);
  }
};

// 内容输入处理
const onContentInput = () => {
  hasChanges = true;
  lastSaved.value = false;
  // 节流保存历史
  clearTimeout(window._historyTimer);
  window._historyTimer = setTimeout(() => {
    saveHistory();
  }, 500);
};

// 开始编辑
const startEditing = () => {
  isEditing.value = true;
  nextTick(() => {
    textareaRef.value?.focus();
  });
};

// 失去光标时保存并切换到预览
const onBlur = async () => {
  isEditing.value = false;
  
  if (!hasChanges) return;
  if (pendingSave) return;
  
  pendingSave = true;
  isSaving.value = true;
  
  try {
    await saveNote();
    lastSaved.value = true;
  } finally {
    pendingSave = false;
    setTimeout(() => {
      isSaving.value = false;
    }, 500);
  }
};

const saveNote = async () => {
  // 如果内容为空，不保存
  if (!note.value.content && !note.value.title) {
    return;
  }

  try {
    if (isNew.value) {
      const result = await store.addNote({
        title: note.value.title || '无标题',
        content: note.value.content,
        color: note.value.color,
      });
      if (result) {
        note.value.id = result.id;
        note.value.created_at = result.created_at;
        note.value.updated_at = result.updated_at;
        isNew.value = false;
        router.replace(`/note/${result.id}`);
      }
    } else {
      await store.updateNote(note.value.id, {
        title: note.value.title || '无标题',
        content: note.value.content,
      });
    }
    hasChanges = false;
  } catch (e) {
    console.error('保存失败:', e);
  }
};

const confirmDelete = async () => {
  if (confirm('确定要删除这条便签吗？')) {
    await store.deleteNote(note.value.id);
    router.push('/');
  }
};

const goBack = async () => {
  if (hasChanges) {
    await saveNote();
  }
  router.push('/');
};

const formatDate = (dateString) => {
  if (!dateString) return new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
</script>

<style scoped>
.note-edit {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: -15px;
  background-color: #f0efe9;
}

/* 顶部工具栏 */
.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px;
  background-color: #e8e7e1;
  border-bottom: 1px solid #d8d7d1;
  flex-shrink: 0;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 返回按钮样式 */
.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.9em;
  font-family: 'Yozai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  color: #333;
  background-color: rgba(0, 0, 0, 0.06);
}

.back-btn svg {
  flex-shrink: 0;
}

.edit-date {
  font-size: 0.8em;
  color: #888;
}

.edit-count {
  font-size: 0.8em;
  color: #888;
  background-color: rgba(0, 0, 0, 0.06);
  padding: 2px 10px;
  border-radius: 10px;
}

/* 标题输入区 */
.title-bar {
  padding: 12px 24px 8px;
  background-color: #f0efe9;
  flex-shrink: 0;
}

.title-header {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #888;
  font-size: 0.75em;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.title-header svg {
  opacity: 0.7;
}

.title-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 1.3em;
  font-weight: 600;
  color: #2c2c2c;
  font-family: 'Yozai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  outline: none;
  padding: 0;
}

.title-input::placeholder {
  color: #bbb;
  font-weight: 400;
}

.title-preview {
  width: 100%;
  font-size: 1.3em;
  font-weight: 600;
  color: #2c2c2c;
  font-family: 'Yozai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  cursor: text;
  padding: 0;
}

.title-preview:hover {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.title-placeholder {
  color: #bbb;
  font-weight: 400;
}

/* 编辑区域 */
.edit-body {
  flex: 1;
  overflow-y: auto;
}

.text-area-card {
  min-height: calc(100vh - 240px);
  padding: 0 24px;
}

/* 编辑区 */
.edit-area {
  height: 100%;
  min-height: calc(100vh - 280px);
}

.md-input {
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 280px);
  border: none;
  background: transparent;
  font-size: 1em;
  line-height: 1.8;
  color: #2c2c2c;
  outline: none;
  resize: none;
  font-family: 'Yozai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding: 24px;
  box-sizing: border-box;
}

.md-input::placeholder {
  color: #c0bfb8;
  font-family: inherit;
}

/* 预览区 */
.preview-area {
  height: 100%;
  min-height: calc(100vh - 280px);
  cursor: text;
  padding: 24px;
  box-sizing: border-box;
}

.preview-body {
  min-height: calc(100vh - 280px);
}

.preview-placeholder {
  color: #bbb;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

.preview-empty {
  color: #bbb;
  font-style: italic;
  text-align: center;
  padding: 20px 0;
}

/* Markdown 渲染样式 */
.markdown-body {
  font-size: 1em;
  line-height: 1.8;
  color: #2c2c2c;
  word-wrap: break-word;
  font-family: 'Yozai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-top: 0;
}

.markdown-body :deep(*:first-child) {
  margin-top: 0;
}

.markdown-body :deep(h1) {
  font-size: 1.6em;
  font-weight: 700;
  margin: 16px 0 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid #e8e7e1;
}

.markdown-body :deep(h2) {
  font-size: 1.35em;
  font-weight: 700;
  margin: 14px 0 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e8e7e1;
}

.markdown-body :deep(h3) {
  font-size: 1.15em;
  font-weight: 600;
  margin: 12px 0 4px;
}

.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  font-weight: 600;
  margin: 10px 0 4px;
}

.markdown-body :deep(p) {
  margin: 8px 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 8px 0;
  padding-left: 24px;
}

.markdown-body :deep(li) {
  margin: 4px 0;
}

.markdown-body :deep(blockquote) {
  margin: 10px 0;
  padding: 8px 16px;
  border-left: 4px solid #bbb;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 0 6px 6px 0;
  color: #666;
}

.markdown-body :deep(code) {
  background-color: rgba(0, 0, 0, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.markdown-body :deep(pre) {
  margin: 10px 0;
  padding: 14px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  font-size: 0.88em;
  line-height: 1.6;
}

.markdown-body :deep(strong) {
  font-weight: 700;
}

.markdown-body :deep(em) {
  font-style: italic;
}

.markdown-body :deep(del) {
  text-decoration: line-through;
  color: #999;
}

.markdown-body :deep(a) {
  color: #4a90d9;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid #d8d7d1;
  margin: 16px 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 6px;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #d8d7d1;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background-color: rgba(0, 0, 0, 0.04);
  font-weight: 600;
}

/* 底部操作栏 */
.edit-footer {
  flex-shrink: 0;
  padding: 8px 16px 14px;
  background-color: #e8e7e1;
  border-top: 1px solid #d8d7d1;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

/* 保存状态 */
.save-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8em;
  color: #888;
  transition: color 0.2s;
}

.save-status.saving {
  color: #4a90d9;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .md-input,
  .preview-area {
    padding: 12px;
  }
  
  .md-input,
  .preview-body {
    min-height: 300px;
  }
}
</style>
