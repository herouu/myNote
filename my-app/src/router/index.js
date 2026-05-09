import { createRouter, createWebHashHistory } from 'vue-router';
import NoteList from '../views/NoteList.vue';

const routes = [
  {
    path: '/',
    name: 'NoteList',
    component: NoteList,
  },
  {
    path: '/note/:id',
    name: 'NoteEdit',
    component: () => import('../views/NoteEdit.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
