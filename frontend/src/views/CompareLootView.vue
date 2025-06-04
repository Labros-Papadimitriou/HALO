<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { getAllLootHistory } from '@/api/lootHistoryApi'
import { getAllItems } from '@/api/itemApi'
import { getAllMembers } from '@/api/memberApi'
import { getEnchantStatus } from '@/api/enchantApi'
import type { Member } from '@/types/member'
import type { Item } from '@/types/item'
import type { FullLootHistoryRecord } from '@/types/lootHistory'

import ComparePriorityFilters from '@/components/compare/ComparePriorityFilters.vue'
import CompareClassSelector from '@/components/compare/CompareClassSelector.vue'
import CompareRaidersPicker from '@/components/compare/CompareRaidersPicker.vue'
import CompareLootTable from '@/components/compare/CompareLootTable.vue'

const memberMap = ref<Record<string, Member & { enchantStatus?: 'missing' | 'normal' | 'tryhard' }>>({})
const grouped = ref<{ [date: string]: Record<string, Item[]> }>({})
const allRaiders = ref<Member[]>([])
const items = ref<Item[]>([])
const rawLootHistory = ref<FullLootHistoryRecord[]>([])

const selectedRaiders = ref<string[]>(['', ''])
const selectedClasses = ref<string[]>([])

const priorityFilters = ref<Record<string, boolean>>({
  'BIS multiple phase': true,
  'BIS current phase': true,
  'Upgrade/MS': true,
  OffSpec: false,
  PVP: false
})

watch(
  () => [...selectedRaiders.value],
  (val) => {
    const nonEmptyCount = val.filter(Boolean).length
    if (nonEmptyCount === val.length && val.length < 20) {
      selectedRaiders.value = [...val, '']
    }
  }
)

watch(selectedClasses, (classes) => {
  selectedRaiders.value = ['', '']
  if (!classes.length) return
  const raiders = allRaiders.value
    .filter(r => classes.includes(r.class_name || ''))
    .map(r => r.name)
  selectedRaiders.value = [
    ...raiders.sort((a, b) => {
      const classA = memberMap.value[a]?.class_name || ''
      const classB = memberMap.value[b]?.class_name || ''
      if (classA !== classB) return classA.localeCompare(classB)
      return a.localeCompare(b)
    }),
    ''
  ]
})

const resetRaiders = () => {
  selectedRaiders.value = ['', '']
  selectedClasses.value = []
}

const uniqueClasses = computed(() => {
  const all = allRaiders.value
    .map(r => r.class_name?.trim())
    .filter((cls): cls is string => Boolean(cls))
  return [...new Set(all)]
})

onMounted(async () => {
  const raw: FullLootHistoryRecord[] = await getAllLootHistory()
  rawLootHistory.value = raw
  const allItems = await getAllItems()

  const [members, normalStatus, tryhardStatus] = await Promise.all([
    getAllMembers(),
    getEnchantStatus(false),
    getEnchantStatus(true)
  ])

  const normalMap = Object.fromEntries(normalStatus.map((s: { id: any }) => [s.id, s]))
  const tryhardMap = Object.fromEntries(tryhardStatus.map((s: { id: any }) => [s.id, s]))

  members.forEach((m) => {
    const id = m.id!
    const normal = normalMap[id]
    const tryhard = tryhardMap[id]

    if (tryhard?.fullyEnchanted && normal?.fullyEnchanted) {
      m.enchantStatus = 'tryhard'
    } else if (normal?.fullyEnchanted) {
      m.enchantStatus = 'normal'
    } else {
      m.enchantStatus = 'missing'
      m.missingEnchantSlots = normal?.missingSlots || []
    }

    memberMap.value[m.name] = m
  })

  const raiderSet = new Set<string>()
  const temp: typeof grouped.value = {}

  const excludedPriorities = ['disenchant', 'banking', 'autopass', 'pass']
  for (const entry of raw) {
    raiderSet.add(entry.raider)
    const item = allItems.find(i => i.name === entry.item)
    if (!temp[entry.date]) temp[entry.date] = {}
    if (!temp[entry.date][entry.raider]) temp[entry.date][entry.raider] = []
    if (item && !excludedPriorities.includes(entry.priority_note?.toLowerCase() || '')) {
      temp[entry.date][entry.raider].push(item)
    }
  }

  grouped.value = temp
  allRaiders.value = Array.from(raiderSet).map(name => memberMap.value[name]).filter(Boolean) as Member[]
  items.value = allItems
})

const filteredGrouped = computed(() => {
  const result: typeof grouped.value = {}
  const activePriorities = Object.keys(priorityFilters.value).filter(p => priorityFilters.value[p])

  for (const [date, raidersItems] of Object.entries(grouped.value)) {
    const filteredRaidersItems: typeof raidersItems = {}

    for (const raider of selectedRaiders.value.filter(Boolean)) {
      const items = raidersItems[raider] || []

      const filteredItems = items.filter(item => {
        const entry = rawLootHistory.value.find(
          e => e.raider === raider && e.item === item.name && e.date === date
        )
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
  <div class="flex flex-wrap items-start gap-8 px-6 mb-1">
    <!-- Left: Checkboxes -->
    <div class="flex flex-col gap-2 min-w-[160px]">
      <ComparePriorityFilters
        :priority-filters="priorityFilters"
        @update:priorityFilters="priorityFilters = $event"
      />
    </div>

    <!-- Right: Class Selector + Raider Selector -->
    <div class="flex flex-col flex-1 items-center gap-1 -ml-[10rem]">
      <CompareClassSelector
        :selected-classes="selectedClasses"
        :classes="uniqueClasses"
        @update:selectedClasses="selectedClasses = $event"
      />

      <CompareRaidersPicker
        :selected-raiders="selectedRaiders"
        :all-raiders="allRaiders.map(r => r.name)"
        @update:selectedRaiders="selectedRaiders = $event"
        @resetRaiders="resetRaiders"
      />
    </div>
  </div>

  <!-- Loot Table -->
  <div class="p-6 text-white bg-[#1e1f22] min-h-screen">
    <CompareLootTable
      :selected-raiders="selectedRaiders"
      :grouped="filteredGrouped"
      :member-map="memberMap"
    />
  </div>
</template>
