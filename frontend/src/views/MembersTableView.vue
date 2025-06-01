<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAllMembers } from '@/api/memberApi'
import type { Member } from '@/types/member'
import { classColors } from '@/constants/colors'
import { getRecentReports } from '@/api/enchantApi'

const recentReports = ref<{ code: string; title: string; startTime: number }[]>([])

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
    <!-- Top Bar: Filters + Sync Controls -->
    <div class="flex justify-between items-center mb-4 flex-wrap gap-4">
      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <select v-model="filters.class" class="text-sm bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer">
          <option value="">All Classes</option>
          <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
        </select>

        <select v-model="filters.role" class="text-sm bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1 cursor-pointer">
          <option value="">All Roles</option>
          <option v-for="r in uniqueRoles" :key="r" :value="r">{{ r }}</option>
        </select>

        <button
          @click="() => {
            filters.class = ''
            filters.role = ''
          }"
          class="bg-[#3a3b3f] hover:bg-[#4E5058] border border-[#555] rounded px-2 py-1 text-white"
        >
          Reset
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
