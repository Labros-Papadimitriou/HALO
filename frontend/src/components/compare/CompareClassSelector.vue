<script setup lang="ts">
defineProps<{
  selectedClass: string
  classes: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedClass', value: string): void
}>()
</script>

<template>
  <div class="flex items-baseline justify-center mb-4 gap-2">
    <label class="font-medium text-gray-300 leading-tight">Compare by Class:</label>
    <select
      :value="selectedClass"
      @change="e => emit('update:selectedClass', (e.target as HTMLSelectElement).value)"
      class="bg-[#2b2d31] text-white border border-[#444] rounded px-3 py-1"
    >
      <option value="">Select Class</option>
      <option v-for="cls in classes" :key="cls" :value="cls">
        {{ cls }}
      </option>
    </select>
  </div>
</template>
