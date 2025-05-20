<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllItems } from '@/api/itemApi'
import type { Item } from '@/types/item'
import { rarityColors } from '@/constants/colors'

// Reactive item data
const items = ref<Item[]>([])

const removeDuplicates = ref(true)

// Filters
const filters = ref({
  name: '',
  slot: '',
  class: '',
  subclass: '',
  raid: '',
  boss: ''
})

function resetFilters() {
  filters.value = {
    name: '',
    slot: '',
    class: '',
    subclass: '',
    raid: '',
    boss: ''
  }
}

// Tooltip setup
onMounted(async () => {
  items.value = await getAllItems()
})

// Unique values
const unique = (key: keyof Item) =>
  computed(() => [...new Set(items.value.map(i => i[key]))])

  const filteredItems = computed(() => {
  let result = items.value.filter(i =>
    (!filters.value.name || i.name.toLowerCase().includes(filters.value.name.toLowerCase())) &&
    (!filters.value.slot || i.inventory_type === filters.value.slot) &&
    (!filters.value.class || i.item_class === filters.value.class) &&
    (!filters.value.subclass || i.item_subclass === filters.value.subclass) &&
    (!filters.value.raid || i.raid === filters.value.raid) &&
    (!filters.value.boss || i.boss === filters.value.boss)
  )

  if (removeDuplicates.value) {
    const seen = new Set()
    result = result.filter(i => {
      if (seen.has(i.wow_id)) return false
      seen.add(i.wow_id)
      return true
    })
  }

  return result
})
</script>

<template>
  <div>
    <!-- Filter bar (matches LootHistory) -->
    <div class="flex justify-between items-center mb-4">
      <!-- Left: Filters -->
      <div class="flex flex-wrap gap-2 items-center text-sm">
        <input
          v-model="filters.name"
          placeholder="Search Item"
          class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
        />
        <select v-model="filters.slot" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
          <option value="">All Slots</option>
          <option v-for="s in unique('inventory_type').value" :key="s" :value="s">{{ s }}</option>
        </select>
        <select v-model="filters.class" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
          <option value="">All Classes</option>
          <option v-for="c in unique('item_class').value" :key="c" :value="c">{{ c }}</option>
        </select>
        <select v-model="filters.subclass" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
          <option value="">All Subclasses</option>
          <option v-for="sc in unique('item_subclass').value" :key="sc" :value="sc">{{ sc }}</option>
        </select>
        <select v-model="filters.raid" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
          <option value="">All Raids</option>
          <option v-for="r in unique('raid').value" :key="r" :value="r">{{ r }}</option>
        </select>
        <select v-model="filters.boss" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
          <option value="">All Bosses</option>
          <option v-for="b in unique('boss').value" :key="b" :value="b">{{ b }}</option>
        </select>
        <button @click="resetFilters" class="bg-[#444] text-white px-3 py-1 rounded border border-[#666]">
          Reset
        </button>
        <label class="flex items-center gap-1 text-sm text-white">
          <input type="checkbox" v-model="removeDuplicates" class="accent-blue-500" />
          Hide Duplicates
        </label>
      </div>
    </div>

    <!-- Table -->
    <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded overflow-hidden shadow">
      <thead class="bg-[#3a3b3f] text-gray-300">
        <tr>
          <th class="p-3 text-left border-b border-[#444]">Name</th>
          <th class="p-3 text-left border-b border-[#444]">Slot</th>
          <th class="p-3 text-left border-b border-[#444]">Class</th>
          <th class="p-3 text-left border-b border-[#444]">Subclass</th>
          <th class="p-3 text-left border-b border-[#444]">Raid</th>
          <th class="p-3 text-left border-b border-[#444]">Boss</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-[#383a40]">
          <td
            class="p-3 border-b border-[#333] flex items-center gap-2 font-medium"
            :style="{ color: rarityColors[item.quality?.toLowerCase()] || '#fff' }"
          >
            <a
              :href="`https://classic.wowhead.com/item=${item.wow_id}`"
              :data-wowhead="`item=${item.wow_id}&domain=classic`"
              target="_blank"
              class="flex items-center gap-2 hover:underline"
            >
              <img :src="item.icon" class="w-5 h-5 rounded-sm border border-black" />
              {{ item.name }}
            </a>
          </td>
          <td class="p-3 border-b border-[#333]">
            {{ item.inventory_type.toLowerCase().replace(/^\w/, c => c.toUpperCase()) }}
          </td>
          <td class="p-3 border-b border-[#333]">{{ item.item_class }}</td>
          <td class="p-3 border-b border-[#333]">{{ item.item_subclass }}</td>
          <td class="p-3 border-b border-[#333]">{{ item.raid }}</td>
          <td class="p-3 border-b border-[#333]">{{ item.boss }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
