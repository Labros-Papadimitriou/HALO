import axios from 'axios'
import type { Item } from '../types/item'

const API_URL = 'https://halo-xepper.onrender.com/api/items'

export const getAllItems = async (): Promise<Item[]> => {
  const res = await axios.get(API_URL)
  return res.data
}

export const addItem = async (item: Item): Promise<number> => {
  const res = await axios.post(API_URL, item)
  return res.data.id
}
