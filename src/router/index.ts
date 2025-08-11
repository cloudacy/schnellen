import {createRouter, createWebHistory} from 'vue-router'

import GameView from '@/views/GameView.vue'
import StartView from '@/views/StartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', component: StartView},
    {path: '/game', component: GameView}
  ]
})

export default router
