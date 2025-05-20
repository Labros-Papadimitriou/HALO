<script setup lang="ts">
import { classColors, rarityColors } from '@/constants/colors'
import type { LootHistoryEntry } from '@/types/lootHistory'
import type { Member } from '@/types/member'
import type { Item } from '@/types/item'

defineProps<{
  visible: boolean
  editingId: number | null
  form: LootHistoryEntry
  members: Member[]
  items: Item[]
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'submit'): void
  (e: 'reset'): void
  (e: 'preset:disenchant'): void
}>()

const handleClose = () => {
  emit('reset')
  emit('update:visible', false)
}

const handleSubmit = () => {
  emit('submit')
  emit('update:visible', false)
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="relative bg-[#2b2d31] p-6 rounded-lg w-[400px] shadow-xl text-white">
      <!-- Close Button -->
      <button
        @click="handleClose"
        class="absolute top-2 right-3 text-gray-400 hover:text-white text-4xl font-extrabold leading-none"
      >
        &times;
      </button>

      <h3 class="text-lg font-semibold mb-4 text-center">
        {{ editingId ? 'Edit Loot' : 'Add Loot' }}
      </h3>

      <!-- Raider -->
      <div class="mb-3">
        <label class="block text-sm mb-1">Raider</label>
        <select v-model="form.member_id" class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1">
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

      <!-- Item -->
      <div class="mb-3">
        <label class="block text-sm mb-1">Item</label>
        <select v-model="form.item_id" class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1">
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

      <!-- Date -->
      <div class="mb-3">
        <label class="block text-sm mb-1">Date</label>
        <input
          v-model="form.date"
          type="date"
          class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1"
        />
      </div>

      <!-- Priority Note -->
      <div class="mb-3">
        <label class="block text-sm mb-1">Priority Note</label>
        <select v-model="form.priority_note" class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1">
          <option value="">— Select Priority —</option>
          <option v-for="opt in [
            'BIS multiple phase',
            'BIS current phase',
            'Upgrade/MS',
            'OffSpec',
            'PVP',
            'Disenchant'
          ]" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
      </div>

      <!-- Notes -->
      <div class="mb-3">
        <label class="block text-sm mb-1">Raider Note</label>
        <input v-model="form.note" type="text" class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1" />
      </div>

      <div class="mb-3">
        <label class="block text-sm mb-1">Council Note</label>
        <input v-model="form.council_note" type="text" class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-2 py-1" />
      </div>

      <!-- Buttons -->
      <div class="flex justify-between items-center mt-4">
        <button
          @click="emit('preset:disenchant')"
          class="text-sm text-gray-300 hover:text-white px-2 py-1 border border-gray-600 rounded"
        >
          🧪 Disenchant
        </button>
        <div class="flex gap-2">
          <button
            @click="emit('reset')"
            class="bg-[#3a3b3f] hover:bg-[#4E5058] px-3 py-1 rounded text-white border border-[#555]"
          >
            Reset
          </button>
          <button
            @click="handleSubmit"
            class="bg-[#5865F2] hover:bg-[#4752C4] px-3 py-1 rounded text-white font-medium"
          >
            {{ editingId ? 'Save' : 'Add' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
