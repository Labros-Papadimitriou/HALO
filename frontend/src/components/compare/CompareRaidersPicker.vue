<script setup lang="ts">
import Multiselect from 'vue-multiselect'

defineProps<{
  selectedRaiders: string[]
  allRaiders: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedRaiders', value: string[]): void
  (e: 'resetRaiders'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-4 mb-6">
    <div class="flex justify-center gap-4">
      <div
        v-for="(_, index) in selectedRaiders.length"
        :key="index"
        class="flex flex-col items-center"
      >
        <label class="text-sm mb-1 text-gray-300">Raider {{ index + 1 }}</label>
        <Multiselect
          v-model="selectedRaiders[index]"
          :options="allRaiders"
          placeholder="Select Raider"
          class="bg-[#2b2d31] text-white rounded border border-[#555] w-40"
          :searchable="true"
          :allowEmpty="true"
          :close-on-select="true"
        />
      </div>
    </div>

    <button
      @click="emit('resetRaiders')"
      class="mt-2 px-4 py-1.5 text-sm text-white bg-[#3a3b3f] hover:bg-[#4E5058] border border-[#555] rounded"
    >
      Reset Selection
    </button>
  </div>
</template>
