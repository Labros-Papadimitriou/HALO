import axios from 'axios'
import type { LootHistoryEntry, FullLootHistoryRecord, ImportJsonEntry } from '../types/lootHistory'

const BASE_URL = import.meta.env.VITE_API_URL
const API_URL = `${BASE_URL}/api/lootHistory`

// GET returns the joined records (with item/raider names)
export const getAllLootHistory = async (): Promise<FullLootHistoryRecord[]> => {
  const res = await axios.get(API_URL, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
  return res.data
}

// POST expects a minimal LootEntry (with member_id and item_id)
export const addLootHistory = async (entry: LootHistoryEntry): Promise<number> => {
  const res = await axios.post(API_URL, entry, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
  return res.data.id
}

export const importLootHistoryFromJson = async (entry: ImportJsonEntry): Promise<void> => {
  const inserted = await axios.post(`${API_URL}/import`, entry, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
  return inserted.data
}

export const deleteLootHistory = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
}

export const updateLootHistory = async (id: number, entry: LootHistoryEntry): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, entry, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
}
