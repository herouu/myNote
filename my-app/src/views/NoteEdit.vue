<template>
  <div class="note-edit">
    <!-- 顶部工具栏 -->
    <header class="edit-header">
      <r-button @click="goBack" type="text">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        返回
      </r-button>
      <div class="header-info">
        <span class="edit-date">{{ formatDate(note.updated_at) }}</span>
        <span class="edit-count">{{ charCount }} 字</span>
      </div>
      <r-button v-if="!isNew" @click="confirmDelete" type="error" size="small">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        </svg>
      </r-button>
    </header>

    <!-- Markdown 工具栏 -->
    <div class="md-toolbar" v-if="mode === 'edit'">
      <button class="tool-btn" @click="insertMd('heading')" title="标题">
        <strong>H</strong>
      </button>
      <button class="tool-btn" @click="insertMd('bold')" title="加粗">
        <strong>B</strong>
      </button>
      <button class="tool-btn" @click="insertMd('italic')" title="斜体">
        <em>I</em>
      </button>
      <button class="tool-btn" @click="insertMd('strikethrough')" title="删除线">
        <span style="text-decoration:line-through">S</span>
      </button>
      <span class="tool-sep"></span>
      <button class="tool-btn" @click="insertMd('list')" title="列表">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" />
        </svg>
      </button>
      <button class="tool-btn" @click="insertMd('orderedList')" title="有序列表">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" />
          <text x="2" y="8" font-size="8" fill="currentColor" stroke="none">1</text><text x="2" y="14" font-size="8" fill="currentColor" stroke="none">2</text><text x="2" y="20" font-size="8" fill="currentColor" stroke="none">3</text>
        </svg>
      </button>
      <button class="tool-btn" @click="insertMd('checklist')" title="待办">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <rect x="3" y="5" width="6" height="6" rx="1" /><line x1="14" y1="8" x2="21" y2="8" />
          <rect x="3" y="14" width="6" height="6" rx="1" /><polyline points="5 17 6.5 18.5 9 15" /><line x1="14" y1="17" x2="21" y2="17" />
        </svg>
      </button>
      <span class="tool-sep"></span>
      <button class="tool-btn" @click="insertMd('code')" title="代码">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
        </svg>
      </button>
      <button class="tool-btn" @click="insertMd('quote')" title="引用">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z" />
        </svg>
      </button>
      <button class="tool-btn" @click="insertMd('link')" title="链接">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
      </button>
    </div>

    <!-- 编辑/预览区域 -->
    <div class="edit-body">
      <r-card class="text-area-card">
        <!-- 编辑模式 -->
        <div v-if="mode === 'edit'" class="editor-wrap">
          <textarea
            ref="textareaRef"
            v-model="note.content"
            class="md-textarea"
            placeholder="支持 Markdown 语法输入..."
            @input="markChanged"
          ></textarea>
        </div>
        <!-- 预览模式 -->
        <div v-else class="preview-wrap">
          <div v-if="note.content" class="markdown-body" v-html="renderedContent"></div>
          <div v-else class="preview-empty">暂无内容</div>
        </div>
      </r-card>
    </div>

    <!-- 底部操作栏 -->
    <footer class="edit-footer">
      <div class="footer-row">
        <!-- 编辑/预览切换 -->
        <div class="mode-toggle">
          <button
            class="mode-btn"
            :class="{ active: mode === 'edit' }"
            @click="mode = 'edit'"
          >编辑</button>
          <button
            class="mode-btn"
            :class="{ active: mode === 'preview' }"
            @click="mode = 'preview'"
          >预览</button>
        </div>
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
const mode = ref('edit');

const note = ref({
  id: '',
  title: '',
  content: '',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const colorOptions = [
  { value: '#fffef7', name: '米白' },
  { value: '#fff9c4', name: '黄色' },
  { value: '#c8e6c9', name: '绿色' },
  { value: '#bbdefb', name: '蓝色' },
  { value: '#ffccbc', name: '橙色' },
  { value: '#e1bee7', name: '紫色' },
];

const isNew = ref(false);
let hasChanges = false;

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
});

const markChanged = () => {
  hasChanges = true;
};

const selectColor = (color) => {
  note.value.color = color;
  markChanged();
};

// Markdown 快捷插入
const insertMd = (type) => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = note.value.content || '';
  const selected = text.substring(start, end);

  const inserts = {
    heading: { before: '## ', after: '', placeholder: '标题' },
    bold: { before: '**', after: '**', placeholder: '加粗文字' },
    italic: { before: '*', after: '*', placeholder: '斜体文字' },
    strikethrough: { before: '~~', after: '~~', placeholder: '删除线文字' },
    list: { before: '- ', after: '', placeholder: '列表项' },
    orderedList: { before: '1. ', after: '', placeholder: '列表项' },
    checklist: { before: '- [ ] ', after: '', placeholder: '待办项' },
    code: { before: '```\n', after: '\n```', placeholder: '代码' },
    quote: { before: '> ', after: '', placeholder: '引用文字' },
    link: { before: '[', after: '](url)', placeholder: '链接文字' },
  };

  const item = inserts[type];
  if (!item) return;

  const insertText = selected || item.placeholder;
  const newText = text.substring(0, start) + item.before + insertText + item.after + text.substring(end);
  note.value.content = newText;
  hasChanges = true;

  nextTick(() => {
    textarea.focus();
    const cursorPos = start + item.before.length + insertText.length + item.after.length;
    textarea.setSelectionRange(start + item.before.length, selected ? cursorPos : start + item.before.length + insertText.length);
  });
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
  padding: 10px 16px;
  background-color: #e8e7e1;
  border-bottom: 1px solid #d8d7d1;
  flex-shrink: 0;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
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

/* Markdown 工具栏 */
.md-toolbar {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #e8e7e1;
  border-bottom: 1px solid #d8d7d1;
  gap: 4px;
  flex-shrink: 0;
  overflow-x: auto;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 0.9em;
  flex-shrink: 0;
  transition: background-color 0.15s;
}

.tool-btn:hover {
  background-color: rgba(0, 0, 0, 0.06);
}

.tool-btn:active {
  background-color: rgba(0, 0, 0, 0.12);
}

.tool-sep {
  width: 1px;
  height: 20px;
  background-color: #d0cfca;
  margin: 0 4px;
  flex-shrink: 0;
}

/* 编辑区域 */
.edit-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.text-area-card {
  min-height: calc(100vh - 260px);
}

.editor-wrap {
  min-height: calc(100vh - 260px);
}

.md-textarea {
  width: 100%;
  min-height: calc(100vh - 260px);
  border: none;
  background: transparent;
  font-size: 1em;
  line-height: 1.8;
  color: #2c2c2c;
  outline: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  padding: 0;
  box-sizing: border-box;
}

.md-textarea::placeholder {
  color: #c0bfb8;
  font-family: inherit;
}

/* 预览模式 */
.preview-wrap {
  min-height: calc(100vh - 260px);
  padding: 4px 0;
}

.preview-empty {
  color: #bbb;
  font-style: italic;
  text-align: center;
  padding: 60px 0;
}

/* Markdown 渲染样式 */
.markdown-body {
  font-size: 0.95em;
  line-height: 1.8;
  color: #2c2c2c;
  word-wrap: break-word;
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
  justify-content: space-between;
  gap: 12px;
}

/* 编辑/预览切换 */
.mode-toggle {
  display: flex;
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.mode-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.82em;
  color: #888;
  transition: all 0.2s;
  font-weight: 500;
}

.mode-btn.active {
  background-color: #fff;
  color: #2c2c2c;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 颜色选择器 */
.color-bar {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.color-dot:active {
  transform: scale(0.9);
}

.color-dot.active {
  border-color: #555;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  transform: scale(1.1);
}

.color-dot .check {
  font-size: 0.7em;
  color: #555;
  font-weight: bold;
}

.color-dot[style*="rgb(255, 255, 247)"],
.color-dot[style*="#fffef7"],
.color-dot[style*="rgb(255, 255, 255)"],
.color-dot[style*="#ffffff"] {
  border-color: rgba(0, 0, 0, 0.18);
}

@media (max-width: 768px) {
  .edit-body {
    padding: 12px;
  }

  .text-area-card,
  .editor-wrap,
  .md-textarea,
  .preview-wrap {
    min-height: calc(100vh - 240px);
  }

  .md-textarea {
    min-height: calc(100vh - 240px);
  }

  .footer-row {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
