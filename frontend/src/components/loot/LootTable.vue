<script setup lang="ts">
import { classColors, rarityColors } from '@/constants/colors'
import type { FullLootHistoryRecord } from '@/types/lootHistory';

defineProps<{
  entries: FullLootHistoryRecord[]
  sortKey: 'raider' | 'date' | null
  sortAsc: boolean
  sortBy: (key: 'raider' | 'date') => void
  onEdit: (entry: FullLootHistoryRecord) => void
  onDeleteRequest: (id: number) => void
}>()

const getWowheadHtml = (entry: FullLootHistoryRecord) => {
  return `
    <a 
      href="https://classic.wowhead.com/item=${entry.wowid}"
      data-wowhead="item=${entry.wowid}&domain=classic" 
      target="_blank"
      style="color: ${rarityColors[entry.quality?.toLowerCase()] || '#fff'}; display: flex; align-items: center; gap: 0.5rem;"
      onclick="event.stopPropagation();"
    >
      <img src="${entry.icon}" class="w-5 h-5 border border-black" />
      ${entry.item}
    </a>
  `
}
</script>

<template>
  <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded shadow">
    <thead class="bg-[#3a3b3f]">
      <tr>
        <th @click="sortBy('raider')" class="p-3 text-left cursor-pointer">Raider</th>
        <th class="p-3 text-left">Class</th>
        <th class="p-3 text-left">Item</th>
        <th class="p-3 text-left">Priority Note</th>
        <th class="p-3 text-left">Raider Note</th>
        <th class="p-3 text-left">Council Note</th>
        <th @click="sortBy('date')" class="p-3 text-left cursor-pointer">Date</th>
        <th class="p-3 text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in entries" :key="entry.id" class="hover:bg-[#383a40]">
        <td class="p-3 border-b border-[#333] font-semibold" :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }">
          {{ entry.raider }}
        </td>
        <td class="p-3 border-b border-[#333] font-semibold" :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }">
          {{ entry.class }}
        </td>
        <td class="p-3 border-b border-[#333] flex items-center gap-2 font-medium" v-html="getWowheadHtml(entry)"></td>
        <td class="p-3 border-b border-[#333] text-gray-300 italic">
          {{ entry.priority_note || '—' }}
        </td>
        <td class="p-3 border-b border-[#333] text-gray-300 italic">
          {{ entry.note || '—' }}
        </td>
        <td class="p-3 border-b border-[#333] text-gray-400 italic">
          {{ entry.council_note || '—' }}
        </td>
        <td class="p-3 border-b border-[#333]">
          {{ new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
        </td>
        <td class="p-3 border-b border-[#333]">
          <button @click="onEdit(entry)" class="text-yellow-400 hover:text-yellow-500 mr-2">✏️</button>
          <button @click="onDeleteRequest(entry.id)" class="text-red-400 hover:text-red-600 text-sm">
            🗑
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
