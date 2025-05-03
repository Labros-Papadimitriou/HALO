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
    class: string
    item: string
    wowId: number
    icon: string
    quality: string
    date: string
    note?: string
    council_note?: string
  }
  
  