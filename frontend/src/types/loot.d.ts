export interface LootEntry {
  member_id: number
  item_id: number
  date: string
  raid?: string
  notes?: string
  council_note?: string
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
  
  