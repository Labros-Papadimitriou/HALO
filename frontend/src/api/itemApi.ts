import axios from 'axios'
import type { Item } from '../types/item'

const BASE_URL = import.meta.env.VITE_API_URL
const API_URL = `${BASE_URL}/items`

export const getAllItems = async (): Promise<Item[]> => {
  const res = await axios.get(API_URL, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
  return res.data
}

export const addItem = async (item: Item): Promise<number> => {
  const res = await axios.post(API_URL, item, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
  return res.data.id
}
