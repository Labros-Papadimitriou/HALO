export interface LootEntry {
    id?: number
    raider: string
    item: string
    raid: string
    date: string
  }
  
  export interface FullLootRecord {
    id: number
    raider: string
    item: string
    date: string
    notes?: string
    council_note?: string
    class: string
  }
  