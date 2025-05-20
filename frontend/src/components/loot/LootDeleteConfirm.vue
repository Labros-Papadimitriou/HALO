<script setup lang="ts">
defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-[#2b2d31] text-white p-4 rounded-lg w-[300px] text-center shadow-lg">
      <p class="mb-4">Are you sure you want to delete this loot entry?</p>
      <div class="flex justify-center gap-4">
        <button
          @click="emit('confirm')"
          class="bg-[#4E5058] hover:bg-[#5C5E66] text-white px-4 py-1 rounded"
        >
          Yes, Delete
        </button>
        <button
          @click="emit('cancel')"
          class="bg-[#2b2d31] hover:bg-[#383a40] px-4 py-1 rounded border border-[#555] text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
