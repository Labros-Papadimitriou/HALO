<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAllMembers } from '@/api/memberApi'
import type { Member } from '@/types/member'
import { classColors } from '@/constants/colors'

const members = ref<Member[]>([])
const router = useRouter()

const filters = ref({
  class: '',
  rank: '',
  profession: '',
  role: ''
})

const uniqueClasses = computed(() => [...new Set(members.value.map(m => m.class))])
const uniqueRoles = computed(() => [...new Set(members.value.map(m => m.role))])

const filteredMembers = computed(() => {
  return members.value.filter(m =>
    (!filters.value.class || m.class === filters.value.class) &&
    // (!filters.value.rank || m.rank === filters.value.rank) &&
    // (!filters.value.profession || m.professions === filters.value.profession) &&
    (!filters.value.role || m.role === filters.value.role)
  )
})


onMounted(async () => {
  members.value = await getAllMembers()
})

function goToDetails(id: number) {
  router.push(`/member/${id}`)
}
</script>

<template>
  <div>
     <!-- Filters -->
    <div class="flex flex-wrap gap-2 mb-4 text-sm">
      <select v-model="filters.class" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Classes</option>
        <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
      </select>
      <!-- <select v-model="filters.rank" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Ranks</option>
        <option v-for="r in uniqueRanks" :key="r" :value="r">{{ r }}</option>
      </select>
      <select v-model="filters.profession" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Professions</option>
        <option v-for="p in uniqueProfessions" :key="p" :value="p">{{ p }}</option>
      </select> -->
      <select v-model="filters.role" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Roles</option>
        <option v-for="r in uniqueRoles" :key="r" :value="r">{{ r }}</option>
      </select>
    </div>
    <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded overflow-hidden shadow">
      <thead class="bg-[#3a3b3f] text-gray-300">
        <tr>
          <th class="p-3 text-left border-b border-[#444]">Name</th>
          <th class="p-3 text-left border-b border-[#444]">Class</th>
          <th class="p-3 text-left border-b border-[#444]">PvP Rank</th>
          <th class="p-3 text-left border-b border-[#444]">Professions</th>
          <th class="p-3 text-left border-b border-[#444]">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-[#383a40] cursor-pointer">
          <td
            class="p-3 border-b border-[#333] font-semibold hover:underline"
            :style="{ color: classColors[member.class.replace(' ', '')] || '#fff' }"
            @click="goToDetails(member.id)"
          >
            {{ member.name }}
          </td>
          <td
            class="p-3 border-b border-[#333] font-semibold"
            :style="{ color: classColors[member.class.replace(' ', '')] || '#aaa' }"
          >
            {{ member.class }}
          </td>
          <td class="p-3 border-b border-[#333]">{{ '-' }}</td>
          <td class="p-3 border-b border-[#333]">{{ '-' }}</td>
          <td class="p-3 border-b border-[#333]">{{ member.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
