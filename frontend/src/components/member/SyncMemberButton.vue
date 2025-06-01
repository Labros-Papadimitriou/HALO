<script setup lang="ts">
import { ref } from 'vue'
import { syncMembers } from '@/api/memberApi'

const props = defineProps<{
  showToast: (msg: string) => void
}>()

const loading = ref(false)

const handleSync = async () => {
  loading.value = true
  try {
    const result = await syncMembers()
    props.showToast(`Synced: ${result.added} added, ${result.updated} updated, ${result.deleted} deleted`)
  } catch (error) {
    console.error('Sync error:', error)
    props.showToast('Failed to sync members')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <button
    @click="handleSync"
    :disabled="loading"
    :class="[
          'px-4 py-1 rounded font-medium cursor-pointer transition-colors',
          loading
            ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
            : 'bg-[#5865F2] hover:bg-[#4752C4] text-white'
        ]"
    >
    <span v-if="!loading">Sync Members</span>
    <span v-else>Syncing...</span>
  </button>
</template>