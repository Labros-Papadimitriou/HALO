import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { setLootDB } from './models/loot.model'
import { setItemDB } from './models/item.model'
import { setMemberDB } from './models/member.model'

let db: Database | undefined

export async function initDB() {
  db = await open({
    filename: './loot-council.db',
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      spec TEXT NOT NULL,
      role TEXT CHECK(role IN ('social', 'raider', 'council', 'master')),
      note TEXT
    );
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class_list TEXT,
      slot TEXT NOT NULL,
      boss TEXT NOT NULL,
      raid TEXT NOT NULL,
      wowId INTEGER
    );
  `)

  await db.exec(`
    CREATE TABLE IF NOT EXISTS loot_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      raid TEXT,
      notes TEXT,
      FOREIGN KEY (member_id) REFERENCES members(id),
      FOREIGN KEY (item_id) REFERENCES items(id)
    );
  `)

  setMemberDB(db)
  setItemDB(db)
  setLootDB(db)

  console.log('📦 SQLite database initialized.')
}
