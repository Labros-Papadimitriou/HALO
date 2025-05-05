<script setup lang="ts">
  import { ref } from 'vue'
  import MemberTable from './components/MemberTable.vue'
  import ItemTable from './components/ItemsTable.vue'
  import LootHistory from './components/LootHistory.vue'
  import LandingPage from './components/LandingPage.vue'

  const entered = ref(false)
  const tabs = ['Members Table', 'Items Table', 'Loot History']
  const activeTab = ref('Loot History')
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
        <!-- Center: Tabs -->
        <div class="flex gap-4">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-4 py-2 rounded font-semibold transition-colors',
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-[#3f4147] text-gray-300 hover:bg-[#4e5056]'
            ]"
          >
            {{ tab }}
          </button>
        </div>
        <!-- Right: Profile area -->
        <div class="flex items-center gap-4">
          <!-- Circle avatar placeholder -->
          <div class="w-10 h-10 bg-gray-500 rounded-full border border-gray-300"></div>
        </div>
      </nav>
      <div class="p-6">
        <MemberTable v-if="activeTab === 'Members Table'" />
        <ItemTable v-if="activeTab === 'Items Table'" />
        <LootHistory v-if="activeTab === 'Loot History'" />
      </div>
    </div>
  </div>
</template>

<style>
.drop-shadow-glow {
  text-shadow: 0 0 8px rgba(0, 162, 255, 0.8);
}
</style>