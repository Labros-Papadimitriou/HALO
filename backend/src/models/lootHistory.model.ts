import { Database } from 'sqlite'

let db: Database

export function setLootHistoryDB(database: Database) {
  db = database
}

export async function getAllLootHistory(): Promise<any[]> {
  return await db.all(`
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
  `)
}

export async function addLootHistory(
  member_id: number,
  item_id: number,
  date: string,
  note?: string,
  council_note?: string
): Promise<number> {
  const result = await db.run(
    `INSERT INTO loot_history (member_id, item_id, date, note, council_note)
     VALUES (?, ?, ?, ?, ?)`,
    member_id,
    item_id,
    date,
    note ?? null,
    council_note ?? null
  )

  return result.lastID!
}

export async function deleteLootHistory(id: number): Promise<void> {
  await db.run('DELETE FROM loot_history WHERE id = ?', id);
}

export async function updateLootHistory(
  id: number,
  member_id: number,
  item_id: number,
  date: string,
  note?: string,
  council_note?: string
): Promise<void> {
  await db.run(
    `UPDATE loot_history
     SET member_id = ?, item_id = ?, date = ?, note = ?, council_note = ?
     WHERE id = ?`,
    member_id,
    item_id,
    date,
    note ?? null,
    council_note ?? null,
    id
  );
}


