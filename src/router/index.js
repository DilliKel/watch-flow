import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/flow/:id',
      name: 'flow',
      component: () => import('@/views/FlowView.vue'),
    },
    {
      path: '/my-sagas',
      name: 'my-sagas',
      component: () => import('@/views/MySagasView.vue'),
    },
  ],
})

export default router
