import { readFileSync } from 'fs';
import path from 'path';
import { db } from '../db.js';

interface LootEntryRaw {
  player: string;
  date: string;
  itemID: number;
  itemName: string;
  note?: string;
}

const loadAndImportLoot = async () => {
  const rawData = readFileSync(path.join('./loot_history.json'), 'utf-8');
  const entries: LootEntryRaw[] = JSON.parse(rawData);

  let inserted = 0;
  for (const entry of entries) {
    const playerName = entry.player.split('-')[0];
    const itemWowId = entry.itemID;

    try {
      const memberRes = await db.query(
        'SELECT id FROM members WHERE name = $1',
        [playerName]
      );
      const itemRes = await db.query(
        'SELECT id FROM items WHERE wow_id = $1',
        [itemWowId]
      );

      if (memberRes.rowCount === 0 || itemRes.rowCount === 0) {
        console.warn(`Skipping entry: player or item not found → ${playerName}, ${itemWowId}`);
        continue;
      }

      const member_id = memberRes.rows[0].id;
      const item_id = itemRes.rows[0].id;
      const date = new Date(entry.date).toISOString().split('T')[0];
      const note = entry.note ?? null;

      await db.query(
        'INSERT INTO loot_history (member_id, item_id, date, note) VALUES ($1, $2, $3, $4)',
        [member_id, item_id, date, note]
      );

      inserted++;
    } catch (err) {
      console.error(`Failed to insert entry for ${entry.player}, ${entry.itemID}`, err);
    }
  }

  console.log(`✅ Imported ${inserted} loot entries.`);
  process.exit();
};

loadAndImportLoot();
