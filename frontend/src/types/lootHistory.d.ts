export interface LootHistoryEntry {
  member_id: number
  item_id: number
  date: string
  note?: string
  council_note?: string
  priority_note?: string;
}
  
export interface FullLootHistoryRecord {
  id: number
  raider: string
  class: string
  item: string
  wowid: number
  icon: string
  quality: string
  date: string
  note?: string
  council_note?: string
  priority_note?: string;
}
  
export interface ImportJsonEntry {
  player: string
  date: string
  time: string
  id: string
  itemID: number
  itemString: string
  response: string
  votes: number
  class: string
  instance: string
  boss: string
  gear1: string
  gear2: string
  responseID: string
  isAwardReason: string
  rollType: string
  subType: string
  equipLoc: string
  note: string
  owner: string
  itemName: string
  servertime: string
}
