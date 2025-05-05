import { createRouter, createWebHistory } from 'vue-router'
import LootHistory from '../components/LootHistory.vue'
import MembersTable from '../components/MembersTable.vue'
import ItemTable from '../components/ItemsTable.vue'
import MemberDetails from '../components/MemberDetails.vue'
import CompareLoot from '../components/CompareLoot.vue'

const routes = [
  { path: '/', redirect: '/loot' },
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

export default router
