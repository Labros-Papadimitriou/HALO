<script setup lang="ts">
import { toRefs } from 'vue'

const props = defineProps<{
  selectedClasses: string[]
  classes: string[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedClasses', value: string[]): void
}>()

const { selectedClasses, classes } = toRefs(props)

function toggleClass(cls: string) {
  const current = selectedClasses.value
  const next = current.includes(cls)
    ? current.filter(c => c !== cls)
    : [...current, cls]
  emit('update:selectedClasses', next)
}
</script>

<template>
  <div class="flex flex-col items-start gap-2 mb-2">
    <div class="text-sm text-gray-300 font-medium">Compare Classes:</div>

    <div class="grid grid-cols-2 gap-1 text-sm text-white">
      <label
        v-for="cls in classes"
        :key="cls"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          class="accent-[#5865F2]"
          :checked="selectedClasses.includes(cls)"
          @change="toggleClass(cls)"
        />
        {{ cls }}
      </label>
    </div>
  </div>
</template>
