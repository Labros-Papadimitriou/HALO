import { Pool } from 'pg';

let db: Pool;

export function setLootHistoryDB(pool: Pool) {
  db = pool;
}

export async function getAllLootHistory(): Promise<any[]> {
  const result = await db.query(`
    SELECT
      lh.id,
      m.name AS raider,
      m.class AS class,
      i.name AS item,
      i.wow_id AS wowId,
      i.icon AS icon,
      i.quality AS quality,
      i.inventory_type AS inventoryType,
      i.item_class AS itemClass,
      i.item_subclass AS itemSubclass,
      i.raid AS raid,
      i.boss AS boss,
      lh.date,
      lh.note,
      lh.council_note
    FROM loot_history lh
    JOIN members m ON lh.member_id = m.id
    JOIN items i ON lh.item_id = i.id
    ORDER BY lh.date DESC
  `);
  return result.rows;
}

export async function addLootHistory(
  member_id: number,
  item_id: number,
  date: string,
  note?: string,
  council_note?: string
): Promise<number> {
  const result = await db.query(
    `INSERT INTO loot_history (member_id, item_id, date, note, council_note)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [member_id, item_id, date, note ?? null, council_note ?? null]
  );
  return result.rows[0].id;
}

export async function deleteLootHistory(id: number): Promise<void> {
  await db.query('DELETE FROM loot_history WHERE id = $1', [id]);
}

export async function updateLootHistory(
  id: number,
  member_id: number,
  item_id: number,
  date: string,
  note?: string,
  council_note?: string
): Promise<void> {
  await db.query(
    `UPDATE loot_history
     SET member_id = $1, item_id = $2, date = $3, note = $4, council_note = $5
     WHERE id = $6`,
    [member_id, item_id, date, note ?? null, council_note ?? null, id]
  );
}
