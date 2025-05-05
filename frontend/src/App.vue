<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LandingPage from './components/LandingPage.vue'

const entered = ref(false)
const router = useRouter()

const tabs = [
  { label: 'Members', path: '/members' },
  { label: 'Items', path: '/items' },
  { label: 'Loot', path: '/loot' }
]
</script>

<template>
  <div class="min-h-screen bg-[#1e1f22] text-white">
    <LandingPage v-if="!entered" @enter="entered = true" />

    <div v-else>
      <nav class="bg-[#2b2d31] p-4 flex justify-between items-center rounded-b-lg shadow-md border-b border-[#3f4147]">
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

        <!-- Right: Avatar -->
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-gray-500 rounded-full border border-gray-300"></div>
        </div>
      </nav>

      <!-- Route Display -->
      <div class="p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style>
.drop-shadow-glow {
  text-shadow: 0 0 8px rgba(0, 162, 255, 0.8);
}
</style>
