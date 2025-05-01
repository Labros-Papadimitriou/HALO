<template>
  <div class="min-h-screen bg-[#1e1f22] text-white">
    <LandingPage v-if="!entered" @enter="entered = true" />

    <div v-else>
      <nav class="bg-[#2b2d31] p-4 flex gap-4 rounded-b-lg shadow-md border-b border-[#3f4147]">
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
        <LootList v-if="activeTab === 'Loot History'" />
        <AddLootForm v-if="activeTab === 'Add Loot'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LootList from './components/LootList.vue'
import AddLootForm from './components/AddLootForm.vue'
import LandingPage from './components/LandingPage.vue'

const entered = ref(false)
const tabs = ['Loot History', 'Add Loot']
const activeTab = ref('Loot History')
</script>
