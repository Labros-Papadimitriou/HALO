<script setup lang="ts">
const props = defineProps<{
  filters: {
    raider: string
    item: string
    class: string
    date: string
  }
  filterDisenchantOnly: boolean
  raiders: string[]
  classes: string[]
}>()

const emit = defineEmits<{
  (e: 'update:filters', val: typeof props.filters): void
  (e: 'update:filterDisenchantOnly', val: boolean): void
  (e: 'reset'): void
  (e: 'compare'): void
}>()

function updateField(field: keyof typeof props.filters, val: string) {
  emit('update:filters', { ...props.filters, [field]: val })
}

function handleDateClick(event: MouseEvent) {
  const input = event.target as HTMLInputElement
  event.preventDefault()
  input.showPicker?.()
}
</script>

<template>
  <div class="flex flex-wrap gap-2 items-center">
    <!-- Raider -->
    <select
      :value="filters.raider"
      @change="e => updateField('raider', (e.target as HTMLSelectElement).value)"
      class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
    >
      <option value="">All Raiders</option>
      <option v-for="name in raiders" :key="name" :value="name">{{ name }}</option>
    </select>

    <!-- Class -->
    <select
      :value="filters.class"
      @change="e => updateField('class', (e.target as HTMLSelectElement).value)"
      class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
    >
      <option value="">All Classes</option>
      <option v-for="cls in classes" :key="cls" :value="cls">{{ cls }}</option>
    </select>

    <!-- Item -->
    <input
      :value="filters.item"
      @input="e => updateField('item', (e.target as HTMLInputElement).value)"
      placeholder="Search Item"
      class="text-sm cursor-pointer bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
    />

    <!-- DE Toggle -->
    <label class="flex items-center gap-2 text-sm text-white cursor-pointer">
      <input type="checkbox" :checked="filterDisenchantOnly" @change="e => emit('update:filterDisenchantOnly', (e.target as HTMLInputElement).checked)" />
      Show DE Loot
    </label>

    <!-- Date -->
    <input
      :value="filters.date"
      @input="e => updateField('date', (e.target as HTMLInputElement).value)"
      type="date"
      class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer"
      @mousedown="handleDateClick"
    />

    <!-- Buttons -->
    <button
      @click="emit('reset')"
      class="bg-[#3a3b3f] hover:bg-[#4E5058] border border-[#555] rounded px-2 py-1 text-white"
    >
      Reset
    </button>
    <button
      @click="emit('compare')"
      class="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-1 rounded font-medium"
    >
      Compare
    </button>
  </div>
</template>
