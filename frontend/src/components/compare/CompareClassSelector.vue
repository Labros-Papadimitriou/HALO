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
  <div class="flex justify-center mb-6">
    <label class="mr-2 font-medium text-gray-300">Compare by Class:</label>
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
