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
import { setEnchantDB } from './models/enchant.model.js';


export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});


export async function initDB() {
  setMemberDB(db);
  setItemDB(db);
  setLootHistoryDB(db);
  setEnchantDB(db);

  console.log('🐘 PostgreSQL database initialized.');
}
