import { createRouter, createWebHistory } from 'vue-router'
import LootHistoryView from '@/views/LootHistoryView.vue'
import MembersTableView from '@/views/MembersTableView.vue'
import ItemTableView from '@/views/ItemsTableView.vue'
import MemberDetailsView from '@/views/MemberDetailsView.vue'
import CompareLootView from '@/views/CompareLootView.vue'
import LoginView from '@/views/LoginView.vue'
import CallbackView from '@/views/CallbackView.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', redirect: '/loot' },
  { path: '/loot', component: LootHistoryView },
  { path: '/members', component: MembersTableView },
  { path: '/items', component: ItemTableView },
  { path: '/member/:id', component: MemberDetailsView, props: true },
  { path: '/compare', component: CompareLootView },
  { path: '/login', component: LoginView },
  { path: '/callback', component: CallbackView }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
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
