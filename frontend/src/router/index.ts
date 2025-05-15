import { createRouter, createWebHistory } from 'vue-router'
import LootHistory from '../components/LootHistory.vue'
import MembersTable from '../components/MembersTable.vue'
import ItemTable from '../components/ItemsTable.vue'
import MemberDetails from '../components/MemberDetails.vue'
import CompareLoot from '../components/CompareLoot.vue'
import LandingPage from '../components/LandingPage.vue' 

const routes = [
  { path: '/', redirect: '/loot' },
  { path: '/', component: LandingPage },
  { path: '/loot', component: LootHistory },
  { path: '/members', component: MembersTable },
  { path: '/items', component: ItemTable },
  { path: '/member/:id', component: MemberDetails, props: true },
  { path: '/compare', component: CompareLoot }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const stored = localStorage.getItem('unlocked')
  let unlocked = false

  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      unlocked = parsed.value === true && Date.now() < parsed.expiresAt
      if (!unlocked) localStorage.removeItem('unlocked')
    } catch {
      localStorage.removeItem('unlocked')
    }
  }

  if (!unlocked && to.path !== '/unlock') {
    next('/unlock')
  } else if (unlocked && to.path === '/unlock') {
    next('/loot')
  } else {
    next()
  }
})

export default router
