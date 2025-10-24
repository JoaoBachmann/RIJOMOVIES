import { name } from '@vue/eslint-config-prettier/skip-formatting';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: '',
    component: () => import(''),
  },
  {
    path: '/',
    name: '',
    component: () => import(''),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;