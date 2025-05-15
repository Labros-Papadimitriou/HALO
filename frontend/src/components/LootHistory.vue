<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllLootHistory, addLootHistory, deleteLootHistory, updateLootHistory, importLootHistoryFromJson } from '../api/lootHistoryApi'
import { getAllMembers } from '../api/memberApi'
import { getAllItems } from '../api/itemApi'
import type { FullLootHistoryRecord, ImportJsonEntry, LootHistoryEntry } from '../types/lootHistory'
import { classColors, rarityColors } from '../constants/colors'
import type { Member } from '../types/member'
import type { Item } from '../types/item'
import { useRouter } from 'vue-router'

const { showToast } = defineProps<{
  showToast: (msg: string) => void
}>()

const router = useRouter()
const loot = ref<FullLootHistoryRecord[]>([])
const members = ref<Member[]>([])
const items = ref<Item[]>([])
const showModal = ref(false)
const showImportModal = ref(false)
const importJson = ref('')
const editingId = ref<number | null>(null)
const deleteTargetId = ref<number | null>(null)
const isImporting = ref(false)
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
  try {
    if (editingId.value) {
      await updateLootHistory(editingId.value, form.value)
      showToast('Loot edited!')
    } else {
      await addLootHistory(form.value)
      showToast('Loot added!')
    }

    loot.value = await getAllLootHistory()
    resetForm()
    editingId.value = null
  } catch (e) {
    console.error(e)
    showToast('Failed to add loot')
  }
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

async function handleDelete() {
  try {
    if (deleteTargetId.value) {
      await deleteLootHistory(deleteTargetId.value)
      loot.value = await getAllLootHistory()
      deleteTargetId.value = null
      showToast('Loot deleted!')
    }
  } catch (e) {
    console.error(e)
    showToast('Failed to delete loot')
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
  editingId.value = null
}

function cancelModal() {
  resetForm()
  showModal.value = false
}

function applyDisenchantPreset() {
  const disenchantRaider = members.value.find(m => m.name === 'Karthasar')
  if (disenchantRaider) {
    form.value.member_id = disenchantRaider.id ?? 0
  }
  form.value.note = 'disenchant'
}

function goToCompare() {
  router.push('/compare')
}

async function submitImport() {
  isImporting.value = true
  try {
    const entry: ImportJsonEntry = JSON.parse(importJson.value)
    await importLootHistoryFromJson(entry)
    loot.value = await getAllLootHistory()
    showToast('Loot import successful!')

    importJson.value = ''
    showImportModal.value = false
  } catch (e) {
    console.error('Error:', e)
    showToast('Invalid JSON format.')
  } finally {
    isImporting.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
    <!-- Left: Filters -->
    <div class="flex flex-wrap gap-2 items-center">
      <select v-model="filters.raider" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Raiders</option>
        <option v-for="name in uniqueRaiders" :key="name" :value="name">{{ name }}</option>
      </select>

      <select v-model="filters.class" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Classes</option>
        <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
      </select>

      <input v-model="filters.item" placeholder="Search Item" class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"/>
      
      <input v-model="filters.date" type="date" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer" @mousedown="handleDateClick" />

      <button @click="resetFilters" class="bg-[#444] text-white px-3 py-1 rounded border border-[#666]">
        Reset
      </button>
      <button @click="goToCompare" class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded">
        Compare
      </button>
    </div>


    <!-- Right: Add Loot Button -->
    <!-- Right: Import + Add Loot Buttons -->
    <div class="flex gap-2">
      <button @click="showImportModal = true" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">
        Import
      </button>
      <button @click="showModal = true" class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">
        Add Loot
      </button>
    </div>
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
          <td class="p-3 border-b border-[#333]">
            {{ new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
          </td>
          <td class="p-3 border-b border-[#333] text-gray-300 italic">
            {{ entry.note || '—' }}
          </td>
          <td class="p-3 border-b border-[#333] text-gray-400 italic">
            {{ entry.council_note || '—' }}
          </td>
          <td class="p-3 border-b border-[#333]">
            <button @click="editLoot(entry)" class="text-yellow-400 hover:text-yellow-500 mr-2">✏️</button>
            <button @click="deleteTargetId = entry.id" class="text-red-400 hover:text-red-600 text-sm">
              🗑
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="relative bg-[#2b2d31] p-6 rounded-lg w-[400px] shadow-xl">
        <!-- Close X -->
        <button
          @click="cancelModal"
          class="absolute top-2 right-3 text-gray-400 hover:text-white text-4xl font-extrabold leading-none"
        >
          &times;
        </button>
        <h3 class="text-lg font-semibold mb-4 text-center">
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

        <div class="flex justify-between items-center mt-4">
          <button @click="applyDisenchantPreset" class="text-sm text-gray-300 hover:text-white px-2 py-1 border border-gray-500 rounded">
          🧪 Disenchant
          </button>
          <div class="flex gap-2">
            <button @click="resetForm" class="bg-gray-600 px-3 py-1 rounded text-white">Reset</button>
            <button @click="submitLoot" class="bg-blue-600 px-3 py-1 rounded text-white">
              {{ editingId ? 'Save' : 'Add' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="deleteTargetId !== null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-[#2b2d31] text-white p-4 rounded-lg w-[300px] text-center shadow-lg">
        <p class="mb-4">Are you sure you want to delete this loot entry?</p>
        <div class="flex justify-center gap-4">
          <button
            @click="handleDelete"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
          >
            Yes, Delete
          </button>
          <button
            @click="deleteTargetId = null"
            class="bg-gray-500 hover:bg-gray-600 px-4 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    <!-- Import Modal -->
    <div v-if="showImportModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-[#2b2d31] p-6 rounded-lg w-[500px] shadow-xl relative text-white">
        <button
          @click="showImportModal = false"
          class="absolute top-2 right-3 text-gray-400 hover:text-white text-3xl font-bold leading-none"
        >
          &times;
        </button>
        <h3 class="text-lg font-semibold mb-4 text-center">Import Loot History (Paste JSON)</h3>
        
        <textarea
          v-model="importJson"
          rows="10"
          class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1 mb-4"
        ></textarea>

        <div class="flex justify-end gap-2">
          <button @click="showImportModal = false" class="bg-gray-600 px-4 py-1 rounded">
            Cancel
          </button>
          <button
            @click="submitImport"
            :disabled="isImporting"
            class="bg-green-600 px-4 py-1 rounded flex items-center gap-2 disabled:opacity-50"
          >
            <span v-if="isImporting" class="loader border-t-white border-2 rounded-full w-4 h-4 animate-spin"></span>
            <span>{{ isImporting ? 'Importing...' : 'Import' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>