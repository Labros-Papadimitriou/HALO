<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addLootHistory } from '../api/lootHistoryApi'
import { getAllMembers } from '../api/memberApi'
import { getAllItems } from '../api/itemApi'
import type { LootHistoryEntry } from '../types/lootHistory'
import type { Member } from '../types/member'
import type { Item } from '../types/item'

const members = ref<Member[]>([])
const items = ref<Item[]>([])

const form = ref<LootHistoryEntry>({
  member_id: 0,
  item_id: 0,
  date: '',
  note: '',
  council_note: ''
})

onMounted(async () => {
  members.value = await getAllMembers()
  items.value = await getAllItems()
})

const submitLootHistory = async () => {
  if (!form.value.member_id || !form.value.item_id || !form.value.date) {
    alert('Please fill all required fields.')
    return
  }

  await addLootHistory(form.value)
  alert('✅ Loot added!')

  form.value = { member_id: 0, item_id: 0, date: '', note: '', council_note: '' }
}
</script>

<template>
  <form @submit.prevent="submitLootHistory" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <select v-model="form.member_id" class="p-2 border rounded cursor-pointer">
        <option value="0" disabled>Select Raider</option>
        <option v-for="m in members" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>

      <select v-model="form.item_id" class="p-2 border rounded cursor-pointer">
        <option value="0" disabled>Select Item</option>
        <option v-for="i in items" :key="i.id" :value="i.id">{{ i.name }}</option>
      </select>

      <input v-model="form.date" type="date" class="p-2 border rounded" />

      <input v-model="form.note" placeholder="Note (optional)" class="p-2 border rounded" />
      <input v-model="form.council_note" placeholder="Council Note (optional)" class="p-2 border rounded" />
    </div>

    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">➕ Add Loot</button>
  </form>
</template>
