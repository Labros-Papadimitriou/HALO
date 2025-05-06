import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { setLootHistoryDB } from './models/lootHistory.model'
import { setItemDB } from './models/item.model'
import { setMemberDB } from './models/member.model'

let db: Database | undefined

export async function initDB() {
  db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      spec TEXT NOT NULL,
      role TEXT CHECK(role IN ('social', 'raider', 'council', 'master'))
    );
  `)
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wow_id INTEGER,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      quality TEXT CHECK(quality IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
      inventory_type TEXT,
      item_class TEXT,
      item_subclass TEXT,
      raid TEXT,
      boss TEXT
    );
  `)
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS loot_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      member_id INTEGER NOT NULL,
      item_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      note TEXT,
      council_note TEXT,
      FOREIGN KEY (member_id) REFERENCES members(id),
      FOREIGN KEY (item_id) REFERENCES items(id)
    );
  `)  

  setMemberDB(db)
  setItemDB(db)
  setLootHistoryDB(db)

  console.log('📦 SQLite database initialized.')
}

async function ensureColumnExists(table: string, column: string, definition: string) {
  const colInfo = await db!.all(`PRAGMA table_info(${table});`)
  const exists = colInfo.some(c => c.name === column)
  if (!exists) {
    await db!.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition};`)
    console.log(`🔧 Added column '${column}' to '${table}'`)
  }
}
