import axios from 'axios'
import type { LootEntry, FullLootRecord } from '../types/loot'

const API_URL = 'http://localhost:3001/api/loot'

// GET returns the joined records (with item/raider names)
export const getAllLoot = async (): Promise<FullLootRecord[]> => {
  const res = await axios.get(API_URL)
  console.log('------------------')
  console.log(res.data)
  console.log('------------------')
  return res.data
}

// POST still expects a minimal LootEntry (with member_id and item_id)
export const addLoot = async (entry: LootEntry): Promise<number> => {
  const res = await axios.post(API_URL, entry)
  return res.data.id
}
