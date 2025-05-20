<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getAllLootHistory } from '@/api/lootHistoryApi'
import type { Member } from '@/types/member'
import { getAllItems } from '@/api/itemApi'
import type { Item } from '@/types/item'
import { getAllMembers } from '@/api/memberApi'
import type { FullLootHistoryRecord } from '@/types/lootHistory'
import ComparePriorityFilters from '@/components/compare/ComparePriorityFilters.vue'
import CompareClassSelector from '@/components/compare/CompareClassSelector.vue'
import CompareRaidersPicker from '@/components/compare/CompareRaidersPicker.vue'
import CompareLootTable from '@/components/compare/CompareLootTable.vue'
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
  <ComparePriorityFilters
    :priority-filters="priorityFilters"
    @update:priorityFilters="priorityFilters = $event"
  />

  <div class="p-6 text-white bg-[#1e1f22] min-h-screen">
    <CompareClassSelector
      :selected-class="selectedClass"
      :classes="uniqueClasses"
      @update:selectedClass="selectedClass = $event"
    />

    <CompareRaidersPicker
      :selected-raiders="selectedRaiders"
      :all-raiders="allRaiders.map(r => r.name)"
      @update:selectedRaiders="selectedRaiders = $event"
      @resetRaiders="resetRaiders"
    />

    <!-- Comparison Table -->
    <div class="overflow-x-auto">
      <CompareLootTable
        :selected-raiders="selectedRaiders"
        :grouped="filteredGrouped"
        :member-map="memberMap"
      />
    </div>
  </div>
</template>


