<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  importJson: string
  isImporting: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'update:importJson', value: string): void
  (e: 'submit'): void
}>()

function handleClose() {
  emit('update:visible', false)
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-[#2b2d31] p-6 rounded-lg w-[500px] shadow-lg text-white">
      <h3 class="text-lg font-semibold mb-4">Import Loot History (Paste JSON)</h3>

      <textarea
        :value="importJson"
        @input="e => emit('update:importJson', (e.target as HTMLTextAreaElement).value)"
        rows="10"
        class="w-full bg-[#1e1f22] text-white border border-[#555] rounded px-3 py-2 text-sm mb-4 resize-y"
        placeholder='Paste JSON from RC history here...'
      ></textarea>

      <div class="flex justify-end gap-2">
        <button
          @click="handleClose"
          class="bg-[#2b2d31] hover:bg-[#383a40] px-4 py-1 rounded border border-[#555] text-white"
        >
          Cancel
        </button>
        <button
          @click="emit('submit')"
          :disabled="isImporting"
          class="bg-[#5865F2] hover:bg-[#4752C4] px-4 py-1 rounded text-white font-medium flex items-center gap-2 disabled:opacity-50"
        >
          <span v-if="isImporting" class="loader border-t-white border-2 rounded-full w-4 h-4 animate-spin"></span>
          <span>{{ isImporting ? 'Importing...' : 'Import' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
