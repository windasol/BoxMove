import { createRouter, createWebHistory } from 'vue-router'
import MoveBox from '@/components/MoveBox.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'moveBox',
      component: MoveBox
    },
  ]
})

export default router
