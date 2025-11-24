import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/movie/:id',
    name: 'MovieView',
    component: () => import('@/views/MovieView.vue')
  },
  
  {
    path: '/pais/:id',
    name: 'PaisView',
    component: () => import('@/views/PaisView.vue')
  },
  {
  path: '/ator/:id',
  name: 'AtorView',
  component: () => import('@/views/AtorView.vue')
}


]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router