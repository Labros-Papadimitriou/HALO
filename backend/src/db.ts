import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { Pool } from 'pg';
import { setLootHistoryDB } from './models/lootHistory.model.js';
import { setItemDB } from './models/item.model.js';
import { setMemberDB } from './models/member.model.js';


export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});


export async function initDB() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS members (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      class TEXT NOT NULL,
      spec TEXT NOT NULL,
      role TEXT CHECK(role IN ('social', 'raider', 'council', 'master'))
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
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
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS loot_history (
      id SERIAL PRIMARY KEY,
      member_id INTEGER NOT NULL REFERENCES members(id),
      item_id INTEGER NOT NULL REFERENCES items(id),
      date TEXT NOT NULL,
      note TEXT,
      council_note TEXT
    );
  `);

  setMemberDB(db);
  setItemDB(db);
  setLootHistoryDB(db);

  console.log('🐘 PostgreSQL database initialized.');
}
