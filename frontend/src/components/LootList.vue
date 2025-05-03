<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getAllLoot } from '../api/lootApi'
import type { FullLootRecord } from '../types/loot'

const loot = ref<FullLootRecord[]>([
  {
    id: 1,
    raider: 'Thalindra',
    item: 'Ashkandi, Greatsword of the Brotherhood',
    date: '2025-04-28',
    class: 'Warrior',
    notes: 'BiS for Fury Warrior',
    council_note: 'Consistently top DPS',
  },
  {
    id: 2,
    raider: 'Lynari',
    item: 'Staff of Dominance',
    date: '2025-04-15',
    class: 'Mage',
    notes: 'Best-in-slot caster staff',
    council_note: 'Awarded over alt',
  },
  {
    id: 3,
    raider: 'Mograk',
    item: 'Judgement Chestplate',
    date: '2025-04-20',
    class: 'Paladin',
    notes: 'Tank upgrade',
    council_note: 'High attendance',
  },
  {
    id: 4,
    raider: 'Zerok',
    item: 'Perdition’s Blade',
    date: '2025-04-13',
    class: 'Rogue',
    notes: 'Top parse dagger',
    council_note: '',
  },
  {
    id: 5,
    raider: 'Veladra',
    item: 'Nemesis Skullcap',
    date: '2025-05-01',
    class: 'Warlock',
    notes: '',
    council_note: 'Debuff uptime excellent',
  },
  {
    id: 6,
    raider: 'Tyranor',
    item: 'Earthfury Epaulets',
    date: '2025-04-18',
    class: 'Shaman',
    notes: 'Restoration role',
    council_note: '',
  },
  {
    id: 7,
    raider: 'Selistra',
    item: 'Cenarion Vestments',
    date: '2025-04-22',
    class: 'Druid',
    notes: 'Solid upgrade',
    council_note: 'Raid healer',
  },
  {
    id: 8,
    raider: 'Kaelynn',
    item: 'Circlet of Prophecy',
    date: '2025-04-25',
    class: 'Priest',
    notes: '',
    council_note: 'Attended all MC runs',
  },
  {
    id: 9,
    raider: 'Valthor',
    item: 'Cryptstalker Tunic',
    date: '2025-04-30',
    class: 'Hunter',
    notes: 'Highly contested',
    council_note: 'Performance-based assignment',
  },
  {
    id: 10,
    raider: 'Solmir',
    item: 'Glacial Robe',
    date: '2025-05-02',
    class: 'Death Knight',
    notes: 'Resistance gear',
    council_note: '',
  },
  {
    id: 11,
    raider: 'Ellyndra',
    item: 'Lightbringer Pauldrons',
    date: '2025-04-19',
    class: 'Paladin',
    notes: '',
    council_note: 'Given over main alt',
  },
  {
    id: 12,
    raider: 'Thalindra',
    item: 'Cloak of Firemaw',
    date: '2025-04-30',
    class: 'Warrior',
    notes: 'Fire resist slot',
    council_note: 'Low priority loot',
  },
  {
    id: 13,
    raider: 'Lynari',
    item: 'Mana Igniting Cord',
    date: '2025-04-16',
    class: 'Mage',
    notes: '',
    council_note: 'BiS belt',
  },
  {
    id: 14,
    raider: 'Mograk',
    item: 'Onslaught Girdle',
    date: '2025-04-29',
    class: 'Paladin',
    notes: '',
    council_note: 'Given for tank set',
  },
  {
    id: 15,
    raider: 'Zerok',
    item: 'Core Hound Tooth',
    date: '2025-04-18',
    class: 'Rogue',
    notes: '',
    council_note: 'Equal priority roll',
  },
  {
    id: 16,
    raider: 'Veladra',
    item: 'Choker of the Fire Lord',
    date: '2025-04-21',
    class: 'Warlock',
    notes: '',
    council_note: 'Top parse warlock',
  },
  {
    id: 17,
    raider: 'Tyranor',
    item: 'Shroud of Pure Thought',
    date: '2025-04-23',
    class: 'Shaman',
    notes: '',
    council_note: 'Best resto cloak',
  },
  {
    id: 18,
    raider: 'Kaelynn',
    item: 'Anathema',
    date: '2025-04-26',
    class: 'Priest',
    notes: '',
    council_note: 'Contested with new healer',
  },
  {
    id: 19,
    raider: 'Selistra',
    item: 'Stormrage Handguards',
    date: '2025-04-27',
    class: 'Druid',
    notes: '',
    council_note: 'No competition',
  },
  {
    id: 20,
    raider: 'Valthor',
    item: 'Dragonstalker Helm',
    date: '2025-05-01',
    class: 'Hunter',
    notes: '',
    council_note: 'Cleanup loot',
  },
  {
    id: 21,
    raider: 'Thalindra',
    item: 'Bloodfang Belt',
    date: '2025-04-12',
    class: 'Warrior',
    notes: '',
    council_note: 'Good performance',
  },
  {
    id: 22,
    raider: 'Lynari',
    item: 'Netherwind Robes',
    date: '2025-04-20',
    class: 'Mage',
    notes: '',
    council_note: '',
  },
  {
    id: 23,
    raider: 'Mograk',
    item: 'Bracers of Might',
    date: '2025-04-10',
    class: 'Paladin',
    notes: '',
    council_note: '',
  },
  {
    id: 24,
    raider: 'Zerok',
    item: 'Band of Accuria',
    date: '2025-05-03',
    class: 'Rogue',
    notes: '',
    council_note: 'Great uptime',
  },
  {
    id: 25,
    raider: 'Veladra',
    item: 'Felheart Robes',
    date: '2025-04-14',
    class: 'Warlock',
    notes: '',
    council_note: '',
  },
  {
    id: 26,
    raider: 'Tyranor',
    item: 'Eskhandar’s Collar',
    date: '2025-04-15',
    class: 'Shaman',
    notes: '',
    council_note: '',
  },
  {
    id: 27,
    raider: 'Kaelynn',
    item: 'Halo of Transcendence',
    date: '2025-04-19',
    class: 'Priest',
    notes: '',
    council_note: '',
  },
  {
    id: 28,
    raider: 'Selistra',
    item: 'Idol of Rejuvenation',
    date: '2025-04-17',
    class: 'Druid',
    notes: '',
    council_note: '',
  },
  {
    id: 29,
    raider: 'Valthor',
    item: 'Striker’s Mark',
    date: '2025-04-22',
    class: 'Hunter',
    notes: '',
    council_note: '',
  },
  {
    id: 30,
    raider: 'Solmir',
    item: 'Runed Bloodstained Hauberk',
    date: '2025-05-03',
    class: 'Death Knight',
    notes: '',
    council_note: '',
  },
])


const classColors: Record<string, string> = {
  Warrior: '#C79C6E',
  Paladin: '#F58CBA',
  Hunter: '#ABD473',
  Rogue: '#FFF569',
  Priest: '#FFFFFF',
  DeathKnight: '#C41F3B',
  Shaman: '#0070DE',
  Mage: '#69CCF0',
  Warlock: '#9482C9',
  Druid: '#FF7D0A',
}

const sortKey = ref<'raider' | 'date' | null>(null)
const sortAsc = ref(true)

function sortBy(key: 'raider' | 'date') {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const filters = ref({
  raider: '',
  item: '',
  class: '',
  date: '',
})

const uniqueRaiders = computed(() => [...new Set(loot.value.map(l => l.raider))])
const uniqueClasses = computed(() => [...new Set(loot.value.map(l => l.class))])
const filteredLoot = computed(() => {
  let results = loot.value.filter(entry => {
    return (
      (!filters.value.raider || entry.raider === filters.value.raider) &&
      (!filters.value.item || entry.item.toLowerCase().includes(filters.value.item.toLowerCase())) &&
      (!filters.value.date || entry.date === filters.value.date) &&
      (!filters.value.class || entry.class === filters.value.class)
    )
  })

  if (sortKey.value) {
    results = results.slice().sort((a, b) => {
      const aVal = a[sortKey.value!]
      const bVal = b[sortKey.value!]

      return sortAsc.value
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }

  return results
})

function resetFilters() {
  filters.value = {
    raider: '',
    item: '',
    class: '',
    date: '',
  }
}

// const loot = ref<FullLootRecord[]>([])

// onMounted(async () => {
//   loot.value = await getAllLoot()
// })
</script>


<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Loot History</h2>
    <div class="flex flex-wrap gap-4 mb-4 items-center text-sm">
      <select v-model="filters.raider" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
        <option value="">All Raiders</option>
        <option v-for="name in uniqueRaiders" :key="name" :value="name">{{ name }}</option>
      </select>

      <select v-model="filters.class" class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1">
      <option value="">All Classes</option>
      <option v-for="cls in uniqueClasses" :key="cls" :value="cls">{{ cls }}</option>
    </select>


      <input
        v-model="filters.item"
        type="text"
        placeholder="Search Item"
        class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
      />

      <input
        v-model="filters.date"
        type="date"
        class="bg-[#2b2d31] text-white border border-[#444] rounded px-2 py-1"
      />

      <button
        @click="resetFilters"
        class="bg-[#444] hover:bg-[#555] text-white px-3 py-1 rounded border border-[#666] transition"
      >
        Reset Filters
      </button>

    </div>
    <table class="w-full bg-[#2b2d31] text-sm text-gray-200 border border-[#3f4147] rounded overflow-hidden shadow">
      <thead class="bg-[#3a3b3f] text-gray-300">
        <tr>
          <th
            @click="sortBy('raider')"
            class="p-3 text-left border-b border-[#444] cursor-pointer hover:text-white"
          >
            Raider
            <span v-if="sortKey === 'raider'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th class="p-3 text-left border-b border-[#444]">Class</th>
          <th class="p-3 text-left border-b border-[#444]">Item</th>
          <th
            @click="sortBy('date')"
            class="p-3 text-left border-b border-[#444] cursor-pointer hover:text-white"
          >
            Date
            <span v-if="sortKey === 'date'">{{ sortAsc ? '▲' : '▼' }}</span>
          </th>
          <th class="p-3 text-left border-b border-[#444]">Note</th>
          <th class="p-3 text-left border-b border-[#444]">Council Note</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="entry in filteredLoot" :key="entry.id" class="hover:bg-[#383a40]">
          <td
            class="p-3 border-b border-[#333] font-semibold"
            :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }"
          >
            {{ entry.raider }}
          </td>
          <td
            class="p-3 border-b border-[#333] font-semibold"
            :style="{ color: classColors[entry.class.replace(' ', '')] || '#aaa' }"
          >
            {{ entry.class }}
          </td>
          <td class="p-3 border-b border-[#333]">{{ entry.item }}</td>
          <td class="p-3 border-b border-[#333]">{{ entry.date }}</td>
          <td class="p-3 border-b border-[#333] text-gray-300 italic">
            {{ entry.notes || '—' }}
          </td>
          <td class="p-3 border-b border-[#333] text-gray-400 italic">
            {{ entry.council_note || '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
