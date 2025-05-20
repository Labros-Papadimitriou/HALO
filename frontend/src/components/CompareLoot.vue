<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getAllLootHistory } from '../api/lootHistoryApi'
import { classColors, rarityColors } from '../constants/colors'
import type { Member } from '../types/member'
import { getAllItems } from '../api/itemApi'
import type { Item } from '../types/item'
import { getAllMembers } from '../api/memberApi'
import type { FullLootHistoryRecord } from '../types/lootHistory'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css'

const memberMap = ref<Record<string, Member>>({})
const grouped = ref<{ [date: string]: Record<string, Item[]> }>({})
const allRaiders = ref<Member[]>([])
const items = ref<Item[]>([])

const selectedRaiders = ref<string[]>(['', ''])
  watch(
  () => [...selectedRaiders.value],
  (val) => {
    console.log('Selected changed:', val)
    const nonEmptyCount = val.filter(Boolean).length
    const total = val.length

    if (nonEmptyCount === total && total < 15) {
      selectedRaiders.value = [...val, '']
    }
  }
)

const resetRaiders = () => {
  selectedRaiders.value = ['', '']
  selectedClass.value = ''
}

const selectedClass = ref('')
const uniqueClasses = computed(() => {
  const all = allRaiders.value.map(r => r.class?.trim()).filter(Boolean)
  return [...new Set(all)]
})

watch(selectedClass, (cls) => {
  if (!cls) return

  const raidersOfClass = allRaiders.value
    .filter(r => r.class === cls)
    .map(r => r.name)

  selectedRaiders.value = [...raidersOfClass, '']
})


onMounted(async () => {
  const raw: FullLootHistoryRecord[] = await getAllLootHistory()
  rawLootHistory.value = raw
  const allItems = await getAllItems()
  const members = await getAllMembers()

  const temp: typeof grouped.value = {}
  const raiderSet = new Set<string>()

  members.forEach(m => {
    memberMap.value[m.name] = m
  })

  const excludedPriorities = ['disenchant', 'banking', 'autopass', 'pass']
  for (const entry of raw) {
    raiderSet.add(entry.raider)

    const item = allItems.find(i => i.name === entry.item)

    if (!temp[entry.date]) temp[entry.date] = {}
    if (!temp[entry.date][entry.raider]) temp[entry.date][entry.raider] = []

    if (
      item &&
      !excludedPriorities.includes(entry.priority_note?.toLowerCase() || '')
      ) {
        temp[entry.date][entry.raider].push(item)
      }
  }

  grouped.value = temp
  allRaiders.value = Array.from(raiderSet).map(name => memberMap.value[name]).filter(Boolean) as Member[]
  items.value = allItems
})

const priorityFilters = ref<Record<string, boolean>>({
  'BIS multiple phase': true,
  'BIS current phase': true,
  'Upgrade/MS': true,
  PVP: false,
})
const rawLootHistory = ref<FullLootHistoryRecord[]>([])

const filteredGrouped = computed(() => {
  const result: typeof grouped.value = {}

  const activePriorities = Object.keys(priorityFilters.value).filter(p => priorityFilters.value[p])

  for (const [date, raidersItems] of Object.entries(grouped.value)) {
    const filteredRaidersItems: typeof raidersItems = {}

    for (const raider of selectedRaiders.value.filter(Boolean)) {
      const items = raidersItems[raider] || []

      const filteredItems = items.filter(item => {
        const entry = rawLootHistory.value.find(e => e.raider === raider && e.item === item.name && e.date === date)
        const note = entry?.priority_note?.trim()
        return note && activePriorities.includes(note)
      })

      if (filteredItems.length) {
        filteredRaidersItems[raider] = filteredItems
      }
    }

    if (Object.keys(filteredRaidersItems).length) {
      result[date] = filteredRaidersItems
    }
  }

  return result
})

</script>

<template>
  <!-- Priority Filters -->
  <div class="flex justify-start mb-6 ml-6 flex-col gap-2">
    <div
      v-for="(checked, priority) in priorityFilters"
      :key="priority"
      class="flex items-center gap-2 cursor-pointer"
    >
      <input
        type="checkbox"
        v-model="priorityFilters[priority]"
        :id="priority"
        class="accent-[#5865F2] w-4 h-4 cursor-pointer"
      />
      <label
        :for="priority"
        class="text-sm text-gray-300 cursor-pointer"
      >
        {{ priority }}
      </label>
    </div>
  </div>

  <div class="p-6 text-white bg-[#1e1f22] min-h-screen">
    <!-- Class Dropdown -->
    <div class="flex justify-center mb-6">
      <label class="mr-2 font-medium text-gray-300">Compare by Class:</label>
      <select
        v-model="selectedClass"
        class="bg-[#2b2d31] text-white border border-[#444] rounded px-3 py-1"
      >
        <option value="">Select Class</option>
        <option v-for="cls in uniqueClasses" :key="cls" :value="cls">
          {{ cls }}
        </option>
      </select>
    </div>

    <!-- Raider Selector -->
    <div class="flex flex-col items-center gap-4 mb-6">
      <div class="flex justify-center gap-4">
        <div v-for="(_, index) in selectedRaiders.length" :key="index" class="flex flex-col items-center">
          <label class="text-sm mb-1 text-gray-300">Raider {{ index + 1 }}</label>
          <Multiselect
            v-model="selectedRaiders[index]"
            :options="allRaiders.map(r => r.name)"
            placeholder="Select Raider"
            class="bg-[#2b2d31] text-white rounded border border-[#555] w-40"
            :searchable="true"
            :allowEmpty="true"
            :close-on-select="true"
          />
        </div>
      </div>

      <button
        @click="resetRaiders"
        class="mt-2 px-4 py-1.5 text-sm text-white bg-[#3a3b3f] hover:bg-[#4E5058] border border-[#555] rounded"
      >
        Reset Selection
      </button>
    </div>

    <!-- Comparison Table -->
    <div class="overflow-x-auto">
      <table class="w-full bg-[#2b2d31] text-sm text-gray-300 border border-[#444] rounded shadow">
        <thead class="bg-[#3a3b3f] text-white">
          <tr>
            <th
              v-for="raider in selectedRaiders.filter(Boolean)"
              :key="raider"
              class="p-2 border border-[#444]"
              :style="{ color: classColors[memberMap[raider]?.class?.replace(' ', '')] || '#ccc' }"
            >
              {{ raider }}
            </th>
            <th class="p-2 border border-[#444] text-white">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(group, date) in filteredGrouped" :key="date" class="hover:bg-[#383a40]">
            <td
              v-for="raider in selectedRaiders.filter(Boolean)"
              :key="raider"
              class="p-2 border border-[#444]"
            >
              <div
                v-for="item in group[raider] || []"
                :key="item.id"
                :style="{ color: rarityColors[item.quality?.toLowerCase()] || '#aaa' }"
                class="flex items-center gap-2 justify-center"
              >
                <img :src="item.icon" class="w-5 h-5 border border-black rounded-sm" />
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
            <td class="p-2 border border-[#444] text-gray-400 font-medium">
              {{ new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


