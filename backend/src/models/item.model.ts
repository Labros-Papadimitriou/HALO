import { Pool } from 'pg';
import type { Item } from '../types/item.js';

let db: Pool;

export function setItemDB(pool: Pool) {
  db = pool;
}

export async function getAllItems(): Promise<Item[]> {
  const result = await db.query('SELECT * FROM items ORDER BY name ASC');
  return result.rows;
}

export async function addItem(item: Item): Promise<number> {
  const result = await db.query(
    `INSERT INTO items (
      wow_id, name, icon, quality,
      inventory_type, item_class, item_subclass,
      raid, boss
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id`,
    [
      item.wowId,
      item.name,
      item.icon,
      item.quality,
      item.inventory_type,
      item.item_class,
      item.item_subclass,
      item.raid,
      item.boss,
    ]
  );
  return result.rows[0].id;
}
