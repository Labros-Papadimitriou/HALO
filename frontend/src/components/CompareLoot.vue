<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllLootHistory } from '../api/lootHistoryApi'
import { classColors, rarityColors } from '../constants/colors'
import type { Member } from '../types/member'
import { getAllItems } from '../api/itemApi'
import type { Item } from '../types/item'
import { getAllMembers } from '../api/memberApi'
import type { FullLootHistoryRecord } from '../types/lootHistory'

const memberMap = ref<Record<string, Member>>({})
const grouped = ref<{ [date: string]: Record<string, Item[]> }>({})
const allRaiders = ref<Member[]>([])
const items = ref<Item[]>([])
const selectedRaiders = ref<string[]>(Array(7).fill(''))
  const resetRaiders = () => {
  selectedRaiders.value = Array(7).fill('');
};

onMounted(async () => {
  const raw: FullLootHistoryRecord[] = await getAllLootHistory()
  const allItems = await getAllItems()
  const members = await getAllMembers()

  const temp: typeof grouped.value = {}
  const raiderSet = new Set<string>()

  members.forEach(m => {
    memberMap.value[m.name] = m
  })

  for (const entry of raw) {
    raiderSet.add(entry.raider)

    const item = allItems.find(i => i.name === entry.item)

    if (!temp[entry.date]) temp[entry.date] = {}
    if (!temp[entry.date][entry.raider]) temp[entry.date][entry.raider] = []

    if (item) {
      temp[entry.date][entry.raider].push(item)
    }
  }

  grouped.value = temp
  allRaiders.value = Array.from(raiderSet).map(name => memberMap.value[name]).filter(Boolean) as Member[]
  items.value = allItems
})

const filteredGrouped = computed(() => {
  const result: typeof grouped.value = {}

  for (const [date, raidersItems] of Object.entries(grouped.value)) {
    // Check if any selected raider has items for this date
    const hasItems = selectedRaiders.value.some(raider => {
      return raider && raidersItems[raider]?.length
    })

    if (hasItems) {
      result[date] = raidersItems
    }
  }

  return result
})
</script>


<template>
  <div class="p-6 text-white">
    <!-- Centered Title -->
    <h2 class="text-2xl font-bold text-center mb-6">Compare Loot</h2>

    <!-- Raider Selector -->
    <div class="flex flex-col items-center gap-4 mb-6">
      <div class="flex justify-center gap-4">
        <div v-for="(_, index) in selectedRaiders.length" :key="index" class="flex flex-col items-center">
          <label class="text-sm mb-1 text-gray-300">Raider {{ index + 1 }}</label>
          <select
            v-model="selectedRaiders[index]"
            class="bg-[#2b2d31] text-white border border-[#444] rounded px-3 py-1 w-40 cursor-pointer"
          >
            <option value="">—</option>
            <option
              v-for="r in allRaiders"
              :key="r.name"
              :value="r.name"
              :style="{ color: classColors[memberMap[r.name]?.class?.replace(' ', '')] || '#ccc' }"
            >
              {{ r.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Reset Button -->
      <button
        @click="resetRaiders"
        class="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Reset Selection
      </button>
    </div>

    <!-- Table -->
    <table class="w-full border border-white text-sm text-center">
      <thead class="bg-[#2b2d31]">
        <tr>
          <th
            v-for="raider in selectedRaiders.filter(Boolean)"
            :key="raider"
            class="p-2 border"
            :style="{ color: classColors[memberMap[raider]?.class?.replace(' ', '')] || '#fff' }"
          >
            {{ raider }}
          </th>
          <th class="p-2 border">DATE</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, date) in filteredGrouped" :key="date">
          <td
            v-for="raider in selectedRaiders.filter(Boolean)"
            :key="raider"
            class="p-2 border"
          >
            <div
              v-for="item in group[raider] || []"
              :key="item.id"
              :style="{ color: rarityColors[item.quality?.toLowerCase()] || '#fff' }"
              class="flex items-center gap-2 justify-center"
            >
              <img :src="item.icon" class="w-5 h-5 border border-black" />
              <a
                :href="`https://classic.wowhead.com/item=${item.wow_id}`"
                :data-wowhead="`item=${item.wow_id}&domain=classic`"
                target="_blank"
                class="hover:underline"
              >
                {{ item.name }}
              </a>
            </div>
          </td>
          <td class="p-2 border">
            {{ new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

