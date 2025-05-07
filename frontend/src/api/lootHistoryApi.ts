import axios from 'axios'
import type { LootHistoryEntry, FullLootHistoryRecord } from '../types/lootHistory'

const API_URL = 'https://halo-xepper.onrender.com/api/lootHistory'

// GET returns the joined records (with item/raider names)
export const getAllLootHistory = async (): Promise<FullLootHistoryRecord[]> => {
  const res = await axios.get(API_URL)
  return res.data
}

// POST still expects a minimal LootEntry (with member_id and item_id)
export const addLootHistory = async (entry: LootHistoryEntry): Promise<number> => {
  const res = await axios.post(API_URL, entry)
  return res.data.id
}

export const deleteLootHistory = async (id: number): Promise<void> => {
  await axios.delete(`https://halo-xepper.onrender.com/api/lootHistory/${id}`);
};

export const updateLootHistory = async (id: number, entry: LootHistoryEntry): Promise<void> => {
  await axios.put(`https://halo-xepper.onrender.com/api/lootHistory/${id}`, entry);
};
