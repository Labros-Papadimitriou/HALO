import { createRouter, createWebHistory } from 'vue-router'
import LootHistory from '../components/LootHistory.vue'
import MembersTable from '../components/MembersTable.vue'
import ItemTable from '../components/ItemsTable.vue'
import MemberDetails from '../components/MemberDetails.vue'
import CompareLoot from '../components/CompareLoot.vue'
import LoginPage from '../components/LoginPage.vue'
import Callback from '../components/Callback.vue'
import { useAuthStore } from '../stores/authStore'

const routes = [
  { path: '/', redirect: '/loot' },
  { path: '/loot', component: LootHistory },
  { path: '/members', component: MembersTable },
  { path: '/items', component: ItemTable },
  { path: '/member/:id', component: MemberDetails, props: true },
  { path: '/compare', component: CompareLoot },
  { path: '/login', component: LoginPage },
  { path: '/callback', component: Callback }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // Allow login and callback pages through
  if (['/login', '/callback'].includes(to.path)) {
    return next();
  }

  // If not logged in or no permission, redirect to /login
  if (!auth.user || !auth.user.canEdit) {
    return next('/login');
  }

  // Otherwise, allow access
  next();
});

export default router
