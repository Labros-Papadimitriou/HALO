<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Toast from './components/Toast.vue'
import { useAuthStore } from './stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

const tabs = [
  { label: 'Members', path: '/members' },
  { label: 'Items', path: '/items' },
  { label: 'Loot', path: '/loot' }
]

function showToast(msg: string) {
  toastRef.value?.showToast(msg)
}

const firstLetter = () => {
  const name = auth.user?.nick || auth.user?.username || ''
  return name.charAt(0).toUpperCase()
}

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function logout() {
  auth.logout()
  router.push('/login')
  showDropdown.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#1e1f22] text-white">
    <!-- ✅ Show NAVBAR only if user is logged in and allowed -->
    <nav
      v-if="auth.user?.canEdit"
      class="bg-[#2b2d31] p-4 flex justify-between items-center rounded-b-lg shadow-md border-b border-[#3f4147]"
    >
      <!-- Left: Logo -->
      <h1 class="text-3xl font-extrabold tracking-wide text-white drop-shadow-glow ml-2">
        HALO
      </h1>

      <!-- Center: Router Tabs -->
      <div class="flex gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.path"
          @click="router.push(tab.path)"
          class="px-4 py-2 rounded font-semibold transition-colors"
          :class="{
            'bg-blue-600 text-white': $route.path === tab.path,
            'bg-[#3f4147] text-gray-300 hover:bg-[#4e5056]': $route.path !== tab.path
          }"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Right: Avatar + Dropdown -->
      <div class="relative flex items-center gap-4" v-click-outside="() => (showDropdown = false)">
        <button @click="toggleDropdown" class="focus:outline-none">
          <template v-if="auth.user?.avatar">
            <img
              :src="`https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png`"
              alt="Avatar"
              class="w-10 h-10 rounded-full border border-gray-300 object-cover"
            />
          </template>
          <template v-else>
            <div
              class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border border-gray-300"
            >
              {{ firstLetter() }}
            </div>
          </template>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="showDropdown"
          class="absolute right-0 top-12 mt-2 w-36 bg-[#2b2d31] text-white rounded-lg shadow-lg border border-[#3f4147] z-50"
        >
          <button
            @click="logout"
            class="block w-full text-left px-4 py-2 hover:bg-[#3f4147] text-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- App content or login page -->
    <div class="p-6">
      <router-view :show-toast="showToast" />
    </div>

    <Toast ref="toastRef" />
  </div>
</template>

<style>
.drop-shadow-glow {
  text-shadow: 0 0 8px rgba(0, 162, 255, 0.8);
}
</style>
