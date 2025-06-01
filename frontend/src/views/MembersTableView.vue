<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAllMembers } from '@/api/memberApi'
import type { Member } from '@/types/member'
import { classColors } from '@/constants/colors'
import SyncMemberButton from '@/components/member/SyncMemberButton.vue'
import { getRecentReports, syncEnchants } from '@/api/enchantApi'

const recentReports = ref<{ code: string; title: string; startTime: number }[]>([])
const selectedReport = ref('')

const syncing = ref(false)

const rolePriority: Record<string, number> = {
  'Master': 1,
  'Officer': 2,
  'Council': 3,
  'Raider': 4,
  'Trial': 5,
}

const props = defineProps<{
  showToast: (msg: string) => void
}>()

const members = ref<Member[]>([])
const router = useRouter()

const filters = ref({
  class: '',
  role: ''
})

const uniqueClasses = computed(() =>
  [...new Set(members.value.map(m => m.class_name).filter(Boolean))]
)
const uniqueRoles = computed(() =>
  [...new Set(members.value.map(m => m.role_name).filter(Boolean))]
)

const filteredMembers = computed(() => {
  return members.value
    .filter(m =>
      (!filters.value.class || m.class_name === filters.value.class) &&
      (!filters.value.role || m.role_name === filters.value.role)
    )
    .sort((a, b) => {
      const roleA = rolePriority[a.role_name ?? ''] ?? 999
      const roleB = rolePriority[b.role_name ?? ''] ?? 999
      if (roleA !== roleB) return roleA - roleB
      return a.name.localeCompare(b.name)
    })
})

async function fetchReports() {
  try {
    recentReports.value = await getRecentReports()
  } catch (err) {
    props.showToast?.('Failed to load reports')
  }
}

async function syncSelectedReport() {
  if (!selectedReport.value) return
  syncing.value = true
  try {
    console.log('Syncing report code:', selectedReport.value);
    const result = await syncEnchants(selectedReport.value)
    props.showToast?.(`Synced: ${result.processed} players`)
  } catch (err) {
    props.showToast?.('Sync failed')
  } finally {
    syncing.value = false
  }
}

onMounted(async () => {
  members.value = await getAllMembers()
  await fetchReports()
})

function goToDetails(id: number) {
  router.push(`/member/${id}`)
}
</script>

<template>
  <div>
    <!-- Top Bar: Filters + Sync Button -->
    <div class="flex justify-between items-center mb-4 gap-4 flex-wrap">
      <!-- Filters -->
      <div class="flex gap-2 flex-wrap">
        <select v-model="filters.class" class="text-sm bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer">
          <option value="">All Classes</option>
          <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
        </select>

        <select v-model="filters.role" class="text-sm bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer">
          <option value="">All Roles</option>
          <option v-for="r in uniqueRoles" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <!-- Sync Button -->
      <SyncMemberButton :show-toast="props.showToast" />
      
      <!-- Report Sync Controls -->
      <div class="flex gap-2 items-center">
        <select v-model="selectedReport" class="text-sm bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer">
          <option disabled value="">Select Report</option>
          <option v-for="r in recentReports" :key="r.code" :value="r.code">
            {{ new Date(r.startTime).toLocaleDateString() }} - {{ r.title || r.code }}
          </option>
        </select>
        <button
          :disabled="!selectedReport || syncing"
          @click="syncSelectedReport"
          class="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded disabled:opacity-40"
        >
          {{ syncing ? 'Syncing...' : 'Sync Enchants' }}
        </button>
      </div>
    </div>

    <!-- Members Table -->
    <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded shadow">
      <thead class="bg-[#3a3b3f] text-gray-300">
        <tr>
          <th class="p-3 text-left border-b border-[#444] font-medium w-10">#</th>
          <th class="p-3 text-left border-b border-[#444] font-medium">Name</th>
          <th class="p-3 text-left border-b border-[#444] font-medium">Class</th>
          <th class="p-3 text-left border-b border-[#444] font-medium">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(member, index) in filteredMembers"
          :key="member.id"
          class="hover:bg-[#383a40] cursor-pointer"
        >
          <td class="p-3 border-b border-[#333] text-gray-400 font-mono">
            {{ index + 1 }}
          </td>
          <td
            class="p-3 border-b border-[#333] font-semibold hover:underline"
            :style="{ color: member.class_name ? classColors[member.class_name.replace(' ', '')] || '#fff' : '#fff' }"
            @click="goToDetails(member.id!)"
          >
            {{ member.name }}
          </td>
          <td
            class="p-3 border-b border-[#333] font-semibold"
            :style="{ color: member.class_name ? classColors[member.class_name.replace(' ', '')] || '#aaa' : '#aaa' }"
          >
            {{ member.class_name || '-' }}
          </td>
          <td class="p-3 border-b border-[#333]">
            <span class="text-gray-300">{{ member.role_name || '-' }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Total Count -->
    <div class="text-sm text-gray-400 mt-2">
      Total Members: {{ filteredMembers.length }}
    </div>
  </div>
</template>
