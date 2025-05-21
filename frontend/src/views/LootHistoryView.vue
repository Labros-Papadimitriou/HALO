<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllLootHistory, addLootHistory, deleteLootHistory, updateLootHistory, importLootHistoryFromJson } from '@/api/lootHistoryApi'
import { getAllMembers } from '@/api/memberApi'
import { getAllItems } from '@/api/itemApi'
import type { FullLootHistoryRecord, ImportJsonEntry, LootHistoryEntry } from '@/types/lootHistory'
import LootTable from '@/components/loot/LootTable.vue'
import LootFormModal from '@/components/loot/LootFormModal.vue'
import LootDeleteConfirm from '@/components/loot/LootDeleteConfirm.vue'
import LootImportModal from '@/components/loot/LootImportModal.vue'
import LootFilters from '@/components/loot/LootFilters.vue'
import type { Member } from '@/types/member'
import type { Item } from '@/types/item'
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
const filterDisenchantOnly = ref(false)
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
    const matchesFilters =
      (!filters.value.raider || entry.raider === filters.value.raider) &&
      (!filters.value.item || entry.item.toLowerCase().includes(filters.value.item.toLowerCase())) &&
      (!filters.value.date || entry.date === filters.value.date) &&
      (!filters.value.class || entry.class === filters.value.class)

    const priority = entry.priority_note?.toLowerCase() || ''

    if (filterDisenchantOnly.value) {
      return matchesFilters && (priority === 'disenchant' || priority === 'banking')
    } else {
      return matchesFilters && priority !== 'disenchant' && priority !== 'banking'
    }
  })

  results = results.slice().sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare
    return a.raider.localeCompare(b.raider)
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
    council_note: entry.council_note || '',
    priority_note: entry.priority_note || ''
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
    const result = await importLootHistoryFromJson(entry) as unknown as { inserted: number }
    loot.value = await getAllLootHistory()
    showToast(`Loot import successful! ${result.inserted} items imported.`)

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
    <LootFilters
      :filters="filters"
      :filter-disenchant-only="filterDisenchantOnly"
      :raiders="uniqueRaiders"
      :classes="uniqueClasses"
      @update:filters="filters = $event"
      @update:filterDisenchantOnly="filterDisenchantOnly = $event"
      @reset="resetFilters"
      @compare="goToCompare"
    />

      <!-- Right: Import + Add Loot Button -->
      <div class="flex gap-2">
        <button
          @click="showImportModal = true"
          class="bg-[#3a3b3f] hover:bg-[#4E5058] text-white px-4 py-1 rounded border border-[#555]"
        >
          Import
        </button>
        <button
          @click="showModal = true"
          class="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-1 rounded font-medium"
        >
          Add Loot
        </button>
      </div>
    </div>

    <LootTable
      :entries="filteredLoot"
      :sortKey="sortKey"
      :sortAsc="sortAsc"
      :sortBy="sortBy"
      :onEdit="editLoot"
      :onDeleteRequest="(id: number) => deleteTargetId = id"
    />

    <LootFormModal
      :visible="showModal"
      :editing-id="editingId"
      :form="form"
      :members="members"
      :items="items"
      @submit="submitLoot"
      @reset="resetForm"
      @preset:disenchant="applyDisenchantPreset"
      @update:visible="showModal = $event"
    />

    <LootDeleteConfirm
      :visible="deleteTargetId !== null"
      @confirm="handleDelete"
      @cancel="deleteTargetId = null"
    />

    <LootImportModal
      :visible="showImportModal"
      :import-json="importJson"
      :is-importing="isImporting"
      @submit="submitImport"
      @update:visible="showImportModal = $event"
      @update:importJson="importJson = $event"
    />
  </div>
</template>