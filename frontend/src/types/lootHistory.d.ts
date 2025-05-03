export interface LootHistoryEntry {
  member_id: number
  item_id: number
  date: string
  note?: string
  council_note?: string
}
  
export interface FullLootHistoryRecord {
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
  
  