<script setup lang="ts">
const gearSlots = [
  'Head', 'Hands',
  'Neck', 'Waist',
  'Shoulder', 'Legs',
  'Back', 'Feet',
  'Chest', 'Finger1',
  'Wrist', 'Finger2',
  'Legs', 'Trinket1',
  'Finger1', 'Trinket2',
  'Weapon', 'Off-Hand',
  '2-Hand','Ranged',
]
</script>

<template>
    <div class="flex">
      <!-- Gear Grid -->
      <div class="grid grid-cols-2 gap-1 p-4 bg-[#1e1f22]">
        <div v-for="slot in gearSlots" :key="slot" class="w-14 h-14 border border-gray-600 bg-[#2b2d31] rounded cursor-pointer hover:border-blue-400 flex items-center justify-center">
          <!-- You can replace this with item icon later -->
          <span class="text-xs text-gray-400">{{ slot }}</span>
        </div>
      </div>
  
      <!-- Placeholder for right side -->
      <div class="ml-6 text-white">
      </div>
    </div>
  </template>
    
  <style scoped>
  /* Adjust square size if needed */
  </style>
  