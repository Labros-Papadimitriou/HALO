import { Database } from 'sqlite'
import type { Item } from '../types/item'

let db: Database

export function setItemDB(database: Database) {
  db = database
}

export async function getAllItems(): Promise<Item[]> {
  return await db.all('SELECT * FROM items ORDER BY name ASC')
}

export async function addItem(item: Item): Promise<number> {
  const result = await db.run(
    `INSERT INTO items (name, class_list, slot, boss, raid, wowId) VALUES (?, ?, ?, ?, ?, ?)`,
    item.name,
    item.class_list,
    item.slot,
    item.boss,
    item.raid,
    item.wowId ?? null
  )
  return result.lastID!
}
