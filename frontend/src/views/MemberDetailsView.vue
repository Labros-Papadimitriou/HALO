<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { Member } from '@/types/member';
import { onMounted, ref } from 'vue';
import { getAllMembers } from '@/api/memberApi';
import { getAllItems } from '@/api/itemApi';
import type { Item } from '@/types/item';
import { rarityColors } from '@/constants/colors'

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
</script>

<template>
  <div>
    COMING SOON
  </div>
</template>
