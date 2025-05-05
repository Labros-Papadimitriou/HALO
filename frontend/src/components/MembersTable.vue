<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAllMembers } from '../api/memberApi'
import type { Member } from '../types/member'
import { classColors } from '../constants/colors'

const members = ref<Member[]>([])
const router = useRouter()

onMounted(async () => {
  members.value = await getAllMembers()
})

function goToDetails(id: number) {
  router.push(`/member/${id}`)
}
</script>

<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Members</h2>
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
        <tr
          v-for="member in members"
          :key="member.id"
          class="hover:bg-[#383a40] cursor-pointer"
        >
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
          <td class="p-3 border-b border-[#333]">{{ 'R14' }}</td>
          <td class="p-3 border-b border-[#333]">{{ 'Fishing' }}</td>
          <td class="p-3 border-b border-[#333]">{{ member.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
