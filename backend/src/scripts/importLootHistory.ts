import { db } from '../db.js';

export const loadAndImportLoot = async (parsedJsonData: any) => {
  let inserted = 0;
  for (const entry of parsedJsonData) {
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
      const priority_note = entry.priority_note ?? null;

      await db.query(
        `INSERT INTO loot_history (member_id, item_id, date, note, priority_note)
         VALUES ($1, $2, $3, $4, $5)`,
        [member_id, item_id, date, note, priority_note]
      );

      inserted++;
    } catch (err) {
      console.error(`Failed to insert entry for ${entry.player}, ${entry.itemID}`, err);
    }
  }
  console.log(`✅ Imported ${inserted} loot entries.`);
  return inserted;
};

export const updatePriorityNotes = async (parsedJsonData: any) => {
  let updated = 0;

  for (const entry of parsedJsonData) {
    const playerName = entry.player.split('-')[0];
    const itemWowId = entry.itemID;
    const priority_note = entry.response ?? null;
    const date = new Date(entry.date).toISOString().split('T')[0];
    console.log(`Processing entry for ${playerName}, ${itemWowId}, ${priority_note}, ${date}`);

    if (!priority_note) continue;

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
        console.warn(`Skipping update: player or item not found → ${playerName}, ${itemWowId}`);
        continue;
      }

      const member_id = memberRes.rows[0].id;
      const item_id = itemRes.rows[0].id;

      const result = await db.query(
        `UPDATE loot_history
         SET priority_note = $1
         WHERE member_id = $2 AND item_id = $3 AND (priority_note IS NULL OR priority_note = '')`,
        [priority_note, member_id, item_id]
      );      

      if (result.rowCount && result.rowCount > 0) {
        updated++;
      }
    } catch (err) {
      console.error(`Failed to update priority_note for ${entry.player}, ${entry.itemID}`, err);
    }
  }

  console.log(`✅ Updated ${updated} entries with priority_note.`);
};
