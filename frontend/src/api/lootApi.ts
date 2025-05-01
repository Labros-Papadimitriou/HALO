import axios from 'axios'
import type { LootEntry } from '../types/loot'

const API_URL = 'http://localhost:3001/api/loot'

export const getAllLoot = async (): Promise<LootEntry[]> => {
  const res = await axios.get(API_URL)
  return res.data
}

export const addLoot = async (entry: LootEntry): Promise<number> => {
  const res = await axios.post(API_URL, entry)
  return res.data.id
}
