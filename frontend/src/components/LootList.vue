<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllLoot } from '../api/lootApi'
import type { FullLootRecord } from '../types/loot'
import { classColors, rarityColors } from '../constants/colors'

const loot = ref<FullLootRecord[]>([])

onMounted(async () => {
  loot.value = await getAllLoot()
  console.log(loot.value)
})

const sortKey = ref<'raider' | 'date' | null>(null)
const sortAsc = ref(true)

function sortBy(key: 'raider' | 'date') {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const filters = ref({
  raider: '',
  item: '',
  class: '',
  date: '',
})

const uniqueRaiders = computed(() => [...new Set(loot.value.map(l => l.raider))])
const uniqueClasses = computed(() => [...new Set(loot.value.map(l => l.class))])
const filteredLoot = computed(() => {
  let results = loot.value.filter(entry => {
    return (
      (!filters.value.raider || entry.raider === filters.value.raider) &&
      (!filters.value.item || entry.item.toLowerCase().includes(filters.value.item.toLowerCase())) &&
      (!filters.value.date || entry.date === filters.value.date) &&
      (!filters.value.class || entry.class === filters.value.class)
    )
  })

  if (sortKey.value) {
    results = results.slice().sort((a, b) => {
      const aVal = a[sortKey.value!]
      const bVal = b[sortKey.value!]

      return sortAsc.value
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }

  return results
})

function resetFilters() {
  filters.value = {
    raider: '',
    item: '',
    class: '',
    date: '',
  }
}
</script>


<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Loot History</h2>
    <div class="flex flex-wrap gap-4 mb-4 items-center text-sm">
      <select v-model="filters.raider" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Raiders</option>
        <option v-for="name in uniqueRaiders" :key="name" :value="name">{{ name }}</option>
      </select>

      <select v-model="filters.class" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
      <option value="">All Classes</option>
      <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
    </select>


      <input
        v-model="filters.item"
        type="text"
        placeholder="Search Item"
        class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
      />

      <input
        v-model="filters.date"
        type="date"
        class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
      />

      <button
        @click="resetFilters"
        class="bg-[#444] hover:bg-[#555] text-white px-3 py-1 rounded border border-[#666] transition"
      >
        Reset Filters
      </button>

    </div>
    <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded overflow-hidden shadow">
      <thead class="bg-[#3a3b3f] text-gray-300">
        <tr>
          <th
            @click="sortBy('raider')"
            class="p-3 text-left border-b border-[#444] cursor-pointer hover:text-white"
          >
            Raider
            <span v-if="sortKey === 'raider'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th class="p-3 text-left border-b border-[#444]">Class</th>
          <th class="p-3 text-left border-b border-[#444]">Item</th>
          <th
            @click="sortBy('date')"
            class="p-3 text-left border-b border-[#444] cursor-pointer hover:text-white"
          >
            Date
            <span v-if="sortKey === 'date'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th class="p-3 text-left border-b border-[#444]">Note</th>
          <th class="p-3 text-left border-b border-[#444]">Council Note</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="entry in filteredLoot" :key="entry.id" class="hover:bg-[#383a40]">
          <td
            class="p-3 border-b border-[#333] font-semibold"
            :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }"
          >
            {{ entry.raider }}
          </td>
          <td
            class="p-3 border-b border-[#333] font-semibold"
            :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }"
          >
            {{ entry.class }}
          </td>
          <td
            class="p-3 border-b border-[#333] flex items-center gap-2 font-medium"
            :style="{ color: rarityColors[entry.rarity] || '#fff' }"
          >
            <img
              :src="entry.icon"
              alt="icon"
              class="w-5 h-5 rounded-sm border border-black"
              @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
            />
            {{ entry.item }}
          </td>
          <td class="p-3 border-b border-[#333]">{{ entry.date }}</td>
          <td class="p-3 border-b border-[#333] text-gray-300 italic">
            {{ entry.note || '—' }}
          </td>
          <td class="p-3 border-b border-[#333] text-gray-400 italic">
            {{ entry.council_note || '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
