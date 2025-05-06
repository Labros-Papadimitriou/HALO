import { Database } from 'sqlite'
import type { Item } from '../types/item.js'

let db: Database

export function setItemDB(database: Database) {
  db = database
}

export async function getAllItems(): Promise<Item[]> {
  return await db.all('SELECT * FROM items ORDER BY name ASC')
}

export async function addItem(item: Item): Promise<number> {
  const result = await db.run(
    `INSERT INTO items (
      wow_id, name, icon, quality,
      inventory_type, item_class, item_subclass,
      raid, boss
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    item.wowId,
    item.name,
    item.icon,
    item.quality,
    item.inventory_type,
    item.item_class,
    item.item_subclass,
    item.raid,
    item.boss
  )
  return result.lastID!
}
