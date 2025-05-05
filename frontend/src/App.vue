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
      <nav class="bg-[#2b2d31] p-4 flex gap-4 rounded-b-lg shadow-md border-b border-[#3f4147]">
        <h1 class="text-3xl font-extrabold tracking-wide text-white drop-shadow-glow pr-4">
          HALO
        </h1>
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