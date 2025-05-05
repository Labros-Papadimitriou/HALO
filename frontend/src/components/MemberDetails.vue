<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { Member } from '../types/member';
import { onMounted, ref } from 'vue';
import { getAllMembers } from '../api/memberApi';
import { getAllItems } from '../api/itemApi';
import type { Item } from '../types/item';
import { rarityColors } from '../constants/colors'

const route = useRoute()
const memberId = Number(route.params.id)
const member = ref<Member | null>(null)
const items = ref<Item[]>([])

const gearSlots = [
  'Head', 'Neck', 'Shoulder', 'Back',
  'Chest', 'Wrist', 'Hands', 'Waist',
  'Legs', 'Feet', 'Finger1', 'Finger2',
  'Trinket1', 'Trinket2', 'Weapon', 'Off-Hand',
  '2-Hand', 'Ranged',
]

// Equipped items + dropdown visibility
const equipped = ref<Record<string, Item | null>>({})
const showDropdown = ref<Record<string, boolean>>({})

gearSlots.forEach(slot => {
  equipped.value[slot] = null
  showDropdown.value[slot] = false
})

onMounted(async () => {
  const allMembers = await getAllMembers()
  member.value = allMembers.find(m => m.id === memberId) || null
  items.value = await getAllItems()


})

function assignItemToSlot(slot: string, item: Item | null) {
  equipped.value[slot] = item
  showDropdown.value[slot] = false
}
</script>

<template>
  <div class="min-h-screen bg-[#1e1f22] text-white flex items-center justify-center">
    <div class="flex gap-10 items-start">
      <!-- Left Info Column -->
      <div class="w-64 space-y-4">
        <div class="text-lg font-bold border-b border-gray-600 pb-2">Character Info</div>
        <div><strong>Name:</strong> {{member?.name}}</div>
        <div><strong>Role:</strong> {{member?.role[0].toUpperCase()}}{{ member?.role.substring(1) }}</div>
        <div><strong>Professions:</strong> Alchemy / Herbalism</div>
        <div><strong>PvP Rank:</strong> Field Marshal</div>
        <div><strong>Enchants:</strong> Fully Enchanted</div>
      </div>

      <!-- Gear Grid -->
      <div class="grid grid-cols-2 gap-1 bg-[#1e1f22] p-4">
        <div
          v-for="slot in gearSlots"
          :key="slot"
          class="relative w-14 h-14 border border-gray-600 bg-[#2b2d31] rounded cursor-pointer hover:border-blue-400 flex items-center justify-center text-xs text-gray-400 text-center"
          @click="showDropdown[slot] = !showDropdown[slot]"
        >
        <!-- Icon or Slot Name -->
        <template v-if="equipped[slot]">
          <img
            :src="equipped[slot]!.icon"
            :alt="equipped[slot]!.name"
            class="w-full h-full object-cover rounded"
            :data-wowhead="`item=${equipped[slot]!.wow_id}&domain=classic`"
          />
          </template>
          <template v-else>
            {{ slot }}
          </template>

          <!-- Custom Dropdown -->
          <div
            v-if="showDropdown[slot]"
            class="absolute z-50 top-16 left-0 w-48 max-h-48 overflow-y-auto bg-[#1e1f22] border border-[#555] rounded shadow-lg" 
          >
          <div
            @click.stop="assignItemToSlot(slot, null)"
            class="flex items-center gap-2 p-1 hover:bg-[#333] cursor-pointer text-sm text-gray-400 italic"
          >
            — Select Item —
          </div>
          <div
            v-for="item in items"
            :key="item.id"
            @click.stop="assignItemToSlot(slot, item)"
            class="flex items-center gap-2 p-1 hover:bg-[#333] cursor-pointer text-sm"
            :style="{ color: rarityColors[item.quality?.toLowerCase()] || '#fff' }"
          >
            <img :src="item.icon" class="w-5 h-5 border border-black" />
            {{ item.name }}
          </div>
        </div>
      </div>
      </div>


      <!-- Right Placeholder -->
      <div class="w-64 text-sm space-y-3">
        <div class="text-lg font-bold border-b border-gray-600 pb-2">Summary</div>
        <div><strong>Gear Score:</strong> 340</div>
        <div><strong>Spell Power:</strong> 350</div>
        <div><strong>Hit Chance:</strong> 4%</div>
        <div><strong>Crit Chance:</strong> 10%</div>
      </div>
    </div>
  </div>
</template>
