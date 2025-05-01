import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { LootEntry } from '../types/loot'

let db: Database | null = null

export async function initDB() {
  db = await open({
    filename: './loot-history.db',
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS loot (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      raider TEXT,
      item TEXT,
      raid TEXT,
      date TEXT
    );
  `)
}

export async function getAllLoot(): Promise<LootEntry[]> {
  if (!db) throw new Error('DB not initialized')
  return await db.all('SELECT * FROM loot ORDER BY date DESC')
}

export async function addLoot(loot: LootEntry): Promise<number> {
  if (!db) throw new Error('DB not initialized')
  const result = await db.run(
    'INSERT INTO loot (raider, item, raid, date) VALUES (?, ?, ?, ?)',
    loot.raider,
    loot.item,
    loot.raid,
    loot.date
  )
  return result.lastID!
}
