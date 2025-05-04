<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllLootHistory, addLootHistory, deleteLootHistory, updateLootHistory } from '../api/lootHistoryApi'
import { getAllMembers } from '../api/memberApi'
import { getAllItems } from '../api/itemApi'
import type { FullLootHistoryRecord, LootHistoryEntry } from '../types/lootHistory'
import { classColors, rarityColors } from '../constants/colors'
import type { Member } from '../types/member'
import type { Item } from '../types/item'

const loot = ref<FullLootHistoryRecord[]>([])
const members = ref<Member[]>([])
const items = ref<Item[]>([])
const showModal = ref(false)
const editingId = ref<number | null>(null)
const form = ref<LootHistoryEntry>({
  member_id: 0,
  item_id: 0,
  date: new Date().toISOString().split('T')[0],
  note: '',
  council_note: ''
})

onMounted(async () => {
  loot.value = await getAllLootHistory()
  members.value = await getAllMembers()
  items.value = await getAllItems()
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
  date: ''
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
    date: ''
  }
}

function getWowheadHtml(entry: FullLootHistoryRecord) {
  return `
    <a 
      href="https://classic.wowhead.com/item=${entry.wowId}" 
      data-wowhead="item=${entry.wowId}&domain=classic" 
      target="_blank"
      style="color: ${rarityColors[entry.quality?.toLowerCase()] || '#fff'}; display: flex; align-items: center; gap: 0.5rem;"
      onclick="event.stopPropagation();"
    >
      <img src="${entry.icon}" class="w-5 h-5 border border-black" />
      ${entry.item}
    </a>
  `
}

function handleDateClick(event: MouseEvent) {
  const input = event.target as HTMLInputElement
  event.preventDefault()
  input.showPicker?.()
}

async function submitLoot() {
  if (editingId.value) {
    await updateLootHistory(editingId.value, form.value)
  } else {
    await addLootHistory(form.value)
  }

  loot.value = await getAllLootHistory()
  resetForm()
  editingId.value = null
}

function editLoot(entry: FullLootHistoryRecord) {
  editingId.value = entry.id
  form.value = {
    member_id: members.value.find(m => m.name === entry.raider)?.id || 0,
    item_id: items.value.find(i => i.name === entry.item)?.id || 0,
    date: entry.date,
    note: entry.note || '',
    council_note: entry.council_note || ''
  }
  showModal.value = true
}

async function deleteLoot(id: number) {
  if (confirm('Are you sure you want to delete this loot entry?')) {
    await deleteLootHistory(id)
    loot.value = await getAllLootHistory()
  }
}

function resetForm() {
  form.value = {
    member_id: 0,
    item_id: 0,
    date: new Date().toISOString().split('T')[0],
    note: '',
    council_note: ''
  }
}


</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
    <!-- Left: Filters -->
    <div class="flex flex-wrap gap-2 items-center">
      <select v-model="filters.raider" class="cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Raiders</option>
        <option v-for="name in uniqueRaiders" :key="name" :value="name">{{ name }}</option>
      </select>

      <select v-model="filters.class" class="cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Classes</option>
        <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
      </select>

      <input v-model="filters.item" placeholder="Search Item" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1" />
      
      <input v-model="filters.date" type="date" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer" @mousedown="handleDateClick" />

      <button @click="resetFilters" class="bg-[#444] text-white px-3 py-1 rounded border border-[#666]">
        Reset
      </button>
    </div>

    <!-- Right: Add Loot Button -->
    <button @click="showModal = true" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">
      Add Loot
    </button>
  </div>

    <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded shadow">
      <thead class="bg-[#3a3b3f]">
        <tr>
          <th @click="sortBy('raider')" class="p-3 text-left cursor-pointer">Raider</th>
          <th class="p-3 text-left">Class</th>
          <th class="p-3 text-left">Item</th>
          <th @click="sortBy('date')" class="p-3 text-left cursor-pointer">Date</th>
          <th class="p-3 text-left">Note</th>
          <th class="p-3 text-left">Council Note</th>
          <th class="p-3 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="entry in filteredLoot" :key="entry.id" class="hover:bg-[#383a40]">
          <td class="p-3 border-b border-[#333] font-semibold" :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }">
            {{ entry.raider }}
          </td>
          <td class="p-3 border-b border-[#333] font-semibold" :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }">
            {{ entry.class }}
          </td>
          <td class="p-3 border-b border-[#333] flex items-center gap-2 font-medium" v-html="getWowheadHtml(entry)"></td>
          <td class="p-3 border-b border-[#333]">{{ entry.date }}</td>
          <td class="p-3 border-b border-[#333] text-gray-300 italic">
            {{ entry.note || '—' }}
          </td>
          <td class="p-3 border-b border-[#333] text-gray-400 italic">
            {{ entry.council_note || '—' }}
          </td>
          <td class="p-3 border-b border-[#333]">
            <button @click="editLoot(entry)" class="text-yellow-400 hover:text-yellow-500 mr-2">✏️</button>
            <button @click="deleteLoot(entry.id)" class="text-red-400 hover:text-red-500">🗑️</button>
          </td>
        </tr>
      </tbody>

    </table>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-[#2b2d31] p-6 rounded-lg w-[400px] shadow-xl">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingId ? 'Edit Loot' : 'Add Loot' }}
        </h3>

        <div class="mb-3">
          <label class="block text-sm mb-1">Raider</label>
          <select v-model="form.member_id" class="cursor-pointer w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1">
            <option value="0" disabled>Select Raider</option>
            <option
              v-for="m in members"
              :key="m.id"
              :value="m.id"
              :style="{ color: classColors[m.class?.replace(' ', '')] || '#ccc' }"
            >
              {{ m.name }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="block text-sm mb-1">Item</label>
          <select v-model="form.item_id" class="cursor-pointer w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1">
            <option value="0" disabled>Select Item</option>
            <option
              v-for="i in items"
              :key="i.id"
              :value="i.id"
              :style="{ color: rarityColors[i.quality.toLowerCase()] || '#ccc' }"
            >
              {{ i.name }}
            </option>
          </select>
        </div>

        <div class="mb-3">
          <label class="block text-sm mb-1">Date</label>
          <input v-model="form.date" type="date" class="cursor-pointer w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1" @mousedown="handleDateClick" />
        </div>

        <div class="mb-3">
          <label class="block text-sm mb-1">Note</label>
          <input v-model="form.note" type="text" class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1" />
        </div>

        <div class="mb-3">
          <label class="block text-sm mb-1">Council Note</label>
          <input v-model="form.council_note" type="text" class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1" />
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button @click="() => { showModal = false; editingId = null }" class="bg-gray-600 px-3 py-1 rounded text-white">
            Cancel
          </button>
          <button @click="submitLoot" class="bg-blue-600 px-3 py-1 rounded text-white">
            {{ editingId ? 'Save' : 'Add' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>