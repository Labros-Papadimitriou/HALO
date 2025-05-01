<script setup lang="ts">
import { ref } from 'vue'
import { addLoot } from '../api/lootApi'
import type { LootEntry } from '../types/loot'

const form = ref<LootEntry>({
  raider: '',
  item: '',
  raid: '',
  date: ''
})

const submitLoot = async () => {
  await addLoot(form.value)
  alert('Loot added!')
  form.value = { raider: '', item: '', raid: '', date: '' }
}
</script>

<template>
  <form @submit.prevent="submitLoot" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <input v-model="form.raider" placeholder="Raider" class="p-2 border rounded" />
      <input v-model="form.item" placeholder="Item" class="p-2 border rounded" />
      <input v-model="form.raid" placeholder="Raid" class="p-2 border rounded" />
      <input v-model="form.date" type="date" class="p-2 border rounded" />
    </div>
    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Add Loot</button>
  </form>
</template>
