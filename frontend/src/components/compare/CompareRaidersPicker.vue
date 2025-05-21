<script setup lang="ts">
import Multiselect from 'vue-multiselect'

const props = defineProps<{
  selectedRaiders: string[]
  allRaiders: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedRaiders', value: string[]): void
  (e: 'resetRaiders'): void
}>()

function filteredOptions(index: number) {
  const others = props.selectedRaiders.filter((_, i) => i !== index)
  return props.allRaiders.filter(name => !others.includes(name))
}

</script>

<template>
  <div class="flex flex-col items-center gap-2 mb-6 w-full px-4">
    <div class="flex flex-wrap justify-center gap-3 w-full max-w-5xl">
      <div
        v-for="(_, index) in selectedRaiders.length"
          :key="index"
          class="flex flex-col items-center w-40 min-w-[10rem]"
        >
        <label class="text-sm mb-1 text-gray-300">Raider {{ index + 1 }}</label>
        <Multiselect
          v-model="selectedRaiders[index]"
          class="bg-[#2b2d31] text-white rounded border border-[#555] w-40"
          placeholder="Select Raider"
          :options="filteredOptions(index)"
          :searchable="true"
          :allow-empty="true"
          :show-labels="false"
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
