<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllLoot } from '../api/lootApi'
import type { LootEntry } from '../types/loot'

const loot = ref<LootEntry[]>([])

onMounted(async () => {
  loot.value = await getAllLoot()
})
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Loot History</h2>
    <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded overflow-hidden shadow">
      <thead class="bg-[#3a3b3f] text-gray-300">
        <tr>
          <th class="p-3 text-left border-b border-[#444]">Raider</th>
          <th class="p-3 text-left border-b border-[#444]">Item</th>
          <th class="p-3 text-left border-b border-[#444]">Raid</th>
          <th class="p-3 text-left border-b border-[#444]">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in loot" :key="entry.id" class="hover:bg-[#383a40]">
          <td class="p-3 border-b border-[#333]">{{ entry.raider }}</td>
          <td class="p-3 border-b border-[#333]">{{ entry.item }}</td>
          <td class="p-3 border-b border-[#333]">{{ entry.raid }}</td>
          <td class="p-3 border-b border-[#333]">{{ entry.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
