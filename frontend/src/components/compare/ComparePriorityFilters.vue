<script setup lang="ts">
const props = defineProps<{
  priorityFilters: Record<string, boolean>
}>()

const emit = defineEmits<{
  (e: 'update:priorityFilters', value: Record<string, boolean>): void
}>()

function togglePriority(priority: string) {
  emit('update:priorityFilters', {
    ...props.priorityFilters,
    [priority]: !props.priorityFilters[priority],
  })
}
</script>

<template>
  <div style="position: relative; z-index: 50;">
    <div class="flex justify-start mb-6 ml-6 flex-col gap-2">
      <div
        v-for="(checked, priority) in priorityFilters"
        :key="priority"
        class="flex items-center gap-2 cursor-pointer"
      >
        <input
          type="checkbox"
          :checked="checked"
          @change="togglePriority(priority)"
          :id="priority"
          class="accent-[#5865F2] w-4 h-4 cursor-pointer"
        />
        <label :for="priority" class="text-sm text-gray-300 cursor-pointer">
          {{ priority }}
        </label>
      </div>
    </div>
  </div>
</template>
