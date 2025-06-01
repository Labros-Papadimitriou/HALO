<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAllMembers } from '@/api/memberApi'
import type { Member } from '@/types/member'
import SyncMemberButton from '@/components/member/SyncMemberButton.vue'
import SyncEnchantButton from '@/components/member/SyncEnchantButton.vue'
import { getRecentReports } from '@/api/enchantApi'

const recentReports = ref<{ code: string; title: string; startTime: number }[]>([])

const props = defineProps<{
  showToast: (msg: string) => void
}>()

const members = ref<Member[]>([])

async function fetchReports() {
  try {
    recentReports.value = await getRecentReports()
  } catch (err) {
    props.showToast?.('Failed to load reports')
  }
}

onMounted(async () => {
  members.value = await getAllMembers()
  await fetchReports()
})

</script>

<template>
  <div class="p-6 text-white space-y-6">

    <!-- Enchant Sync Controls -->
    <div class="bg-[#2b2d31] border border-[#444] rounded-xl p-4 shadow-md ">
      <h2 class="text-lg font-bold mb-3">Sync Enchants from Warcraft Logs</h2>
      <SyncEnchantButton :show-toast="props.showToast"/>
    </div>

    <!-- Member Sync Button -->
    <div class="bg-[#2b2d31] border border-[#444] rounded-xl p-4 shadow-md">
      <h2 class="text-lg font-bold mb-3">Sync Guild Members from Discord</h2>
      <SyncMemberButton :show-toast="props.showToast" />
    </div>

  </div>
</template>
