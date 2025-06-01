<script setup lang="ts">
import { classColors, rarityColors } from '@/constants/colors'
import type { Item } from '@/types/item'
import type { Member } from '@/types/member'

defineProps<{
  selectedRaiders: string[]
  grouped: { [date: string]: Record<string, Item[]> }
  memberMap: Record<string, Member>
}>()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full bg-[#2b2d31] text-sm text-gray-300 border border-[#444] rounded shadow">
      <thead class="bg-[#3a3b3f] text-white">
        <tr>
          <th
            v-for="raider in selectedRaiders.filter(Boolean)"
            :key="raider"
            class="p-2 border border-[#444]"
            :style="{ color: classColors[(memberMap[raider]?.class_name?.replace(' ', '') ?? '')] || '#ccc' }"
          >
            <span>{{ raider }}</span>

            <template v-if="memberMap[raider]?.enchantStatus === 'tryhard'">
              <span title="Fully BIS enchanted">⭐</span>
            </template>
            <template v-else-if="memberMap[raider]?.enchantStatus === 'normal'">
              <span title="Fully enchanted">✅</span>
            </template>
            <template v-else>
              <span title="Missing enchants">❌</span>
            </template>
          </th>
          <th class="p-2 border border-[#444] text-white">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(group, date) in grouped" :key="date" class="hover:bg-[#383a40]">
          <td
            v-for="raider in selectedRaiders.filter(Boolean)"
            :key="raider"
            class="p-2 border border-[#444]"
          >
            <div
              v-for="item in group[raider] || []"
              :key="item.id"
              :style="{ color: rarityColors[item.quality?.toLowerCase()] || '#aaa' }"
              class="flex items-center gap-2 justify-center"
            >
              <img :src="item.icon" class="w-5 h-5 border border-black rounded-sm" />
              <a
                :href="`https://classic.wowhead.com/item=${item.wow_id}`"
                :data-wowhead="`item=${item.wow_id}&domain=classic`"
                target="_blank"
                class="hover:underline"
              >
                {{ item.name }}
              </a>
            </div>
          </td>
          <td class="p-2 border border-[#444] text-gray-400 font-medium">
            {{ new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
