<template>
  <div class="note-list" @contextmenu.prevent="onContextMenu">
    <!-- 顶部标题栏 -->
    <header class="list-header">
      <h1 class="list-title">我的便签</h1>
      <r-button @click="createNote" type="primary" circle>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="20" height="20">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </r-button>
    </header>

    <!-- 便签列表 -->
    <div class="notes-scroll">
      <div v-if="sortedNotes.length === 0" class="empty-state">
        <svg class="empty-icon" viewBox="0 0 64 64" fill="none" stroke="#ccc" stroke-width="2">
          <rect x="12" y="8" width="40" height="48" rx="4" />
          <line x1="20" y1="22" x2="44" y2="22" />
          <line x1="20" y1="30" x2="44" y2="30" />
          <line x1="20" y1="38" x2="36" y2="38" />
        </svg>
        <p class="empty-text">还没有便签</p>
        <p class="empty-hint">点击右上角 + 创建第一条便签</p>
      </div>

      <div v-else class="notes-container">
        <r-card
          v-for="note in filteredNotes"
          :key="note.id"
          class="note-card"
          :data-note-id="note.id"
          :class="{ 'show-actions': activeNoteId === note.id }"
          @click="handleCardClick(note.id)"
          @touchstart="onTouchStart($event, note.id)"
          @touchend="onTouchEnd"
          @touchmove="onTouchMove"
          @mousedown="onMouseDown(note.id)"
          @mouseup="onMouseUp"
          @mouseleave="onMouseUp"
          hoverable
        >
          <div class="card-body">
            <h3 class="note-title">{{ note.title || '新建便签' }}</h3>
            <p class="note-preview" v-if="note.content" v-html="renderPreview(note.content)"></p>
            <p class="note-preview empty" v-else>点击编辑内容...</p>
          </div>
          <div class="card-footer">
            <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
          </div>
          <!-- 长按显示的删除按钮 -->
          <transition name="slide">
            <div v-if="activeNoteId === note.id" class="card-actions" @click.stop="handleActionClick($event, note)">
              <r-button type="error" size="small">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
                删除
              </r-button>
            </div>
          </transition>
        </r-card>
      </div>
    </div>

    <!-- 点击空白区域取消 -->
    <div v-if="activeNoteId" class="overlay" @click="activeNoteId = null"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';
import { marked } from 'marked';

marked.setOptions({ breaks: true, gfm: true });

const store = useAppStore();
const router = useRouter();

const activeNoteId = ref(null);
let longPressTimer = null;
let touchMoved = false;
let isLongPress = false;

onMounted(() => {
  store.loadNotes();
});

onUnmounted(() => {
  clearTimeout(longPressTimer);
});

const sortedNotes = computed(() => {
  return [...store.notes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
});

const filteredNotes = computed(() => {
  return sortedNotes.value;
});

const createNote = () => {
  router.push('/note/new');
};

const handleCardClick = (id) => {
  // 如果是长按触发的，不跳转
  if (isLongPress) {
    isLongPress = false;
    return;
  }
  // 如果当前有激活的删除按钮，先关闭
  if (activeNoteId.value) {
    activeNoteId.value = null;
    return;
  }
  router.push(`/note/${id}`);
};

// 触摸长按（移动端）
const onTouchStart = (e, id) => {
  // 如果点击的是删除按钮区域，不处理长按
  if (e.target.closest('.card-actions')) return;
  touchMoved = false;
  isLongPress = false;
  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(() => {
    if (!touchMoved) {
      isLongPress = true;
      activeNoteId.value = id;
      if (navigator.vibrate) {
        navigator.vibrate(30);
      }
    }
  }, 600);
};

const onTouchEnd = () => {
  clearTimeout(longPressTimer);
};

const onTouchMove = () => {
  touchMoved = true;
  clearTimeout(longPressTimer);
};

// 鼠标长按（桌面端）
const onMouseDown = (id) => {
  isLongPress = false;
  clearTimeout(longPressTimer);
  longPressTimer = setTimeout(() => {
    isLongPress = true;
    activeNoteId.value = id;
  }, 600);
};

const onMouseUp = () => {
  clearTimeout(longPressTimer);
};

// 右键（桌面端备选）
const onLongPress = (id) => {
  isLongPress = true;
  activeNoteId.value = id;
};

// 全局右键菜单拦截
const onContextMenu = (e) => {
  // 如果右键点击的是卡片，触发长按逻辑
  const card = e.target.closest('.note-card');
  if (card) {
    // 找到对应 note 的 id — 通过遍历 v-for
    const noteId = filteredNotes.value.find(n => {
      return card.getAttribute('data-note-id') === String(n.id);
    })?.id;
    if (noteId) {
      onLongPress(noteId);
    }
  }
};

const confirmDelete = (note) => {
  isLongPress = false;
  if (window.confirm(`确定要删除"${note.title || '新建便签'}"吗？`)) {
    store.deleteNote(note.id);
    activeNoteId.value = null;
  }
};

// 删除按钮点击处理
const handleActionClick = (e, note) => {
  e.stopPropagation();
  e.preventDefault();
  confirmDelete(note);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay && now.getDate() === date.getDate()) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  } else if (diff < 2 * oneDay) {
    return '昨天';
  } else if (diff < 7 * oneDay) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[date.getDay()];
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
};

const renderPreview = (content) => {
  const html = marked(content);
  const text = html.replace(/<[^>]+>/g, '').substring(0, 80);
  return text;
};
</script>

<style scoped>
.note-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  margin: -15px;
  background-color: #f0efe9;
}

/* 顶部标题栏 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 12px;
  background-color: #f0efe9;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #d8d7d1;
}

.list-title {
  font-size: 1.8em;
  font-weight: 700;
  color: #2c2c2c;
  margin: 0;
  letter-spacing: -0.02em;
}

/* 列表滚动区 */
.notes-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px 40px;
  -webkit-overflow-scrolling: touch;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 1.1em;
  color: #666;
  margin-bottom: 6px;
}

.empty-hint {
  font-size: 0.85em;
  color: #999;
}

/* 便签容器 - 单列 */
.notes-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: 10px;
  margin-right: 10px;
}

.notes-container > :first-child {
  margin-top: 10px;
}

/* 便签卡片 */
.note-card {
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  touch-action: manipulation;
}

.note-card.show-actions {
  transform: scale(0.98);
}

.card-body {
  margin-bottom: 8px;
}

.note-title {
  font-size: 1.05em;
  font-weight: 600;
  color: #2c2c2c;
  margin: 0 0 6px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.note-preview {
  font-size: 0.88em;
  color: #888;
  line-height: 1.6;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.note-preview.empty {
  color: #bbb;
  font-style: italic;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-date {
  font-size: 0.75em;
  color: #aaa;
}

/* 删除操作按钮 */
.card-actions {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 5;
}

/* 滑入动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.9);
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
}

@media (max-width: 768px) {
  .notes-scroll {
    padding: 12px 12px 40px;
  }
}
</style>
