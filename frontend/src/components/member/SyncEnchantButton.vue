<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecentReports, syncEnchants } from '@/api/enchantApi'

const props = defineProps<{
  showToast: (msg: string) => void
}>()

const reports = ref<{ code: string; title: string; startTime: number }[]>([])
const selectedReport = ref<string>('')
const overwrite = ref<boolean>(false)
const syncing = ref<boolean>(false)

onMounted(async () => {
  reports.value = await getRecentReports()
})

async function handleSync() {
  if (!selectedReport.value) return
  syncing.value = true
  try {
    const res = await syncEnchants(selectedReport.value, overwrite.value)
    props.showToast(`Synced ${res.processed} players`)
  } catch (err) {
    const error = err as Error
    props.showToast(`Synced failed: ${error.message || 'Unknown error'}`)
  } finally {
    syncing.value = false
  }
}
</script>

<template>
  <div>
    <select
      v-model="selectedReport"
      class="w-[320px] bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer  mr-2"
    >
      <option value="" disabled>Select a report</option>
      <option
        v-for="r in reports"
        :key="r.code"
        :value="r.code"
      >
        {{ r.title }} — {{ new Date(r.startTime).toLocaleString() }}
      </option>
    </select>

    <label class="text-sm text-white ml-2 cursor-pointer mr-3">
      <input type="checkbox" v-model="overwrite" />
      Overwrite existing data
    </label>

    <button
      @click="handleSync"
      :disabled="!selectedReport || syncing"
      :class="[
        'px-4 py-1 rounded font-medium cursor-pointer transition-colors',
        syncing || !selectedReport
          ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
          : 'bg-[#5865F2] hover:bg-[#4752C4] text-white'
      ]"
    >
      {{ syncing ? 'Syncing...' : 'Sync Enchants' }}
    </button>
  </div>
</template>
