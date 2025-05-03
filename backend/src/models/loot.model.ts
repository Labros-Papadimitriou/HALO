import { Database } from 'sqlite'

let db: Database

export function setLootDB(database: Database) {
  db = database
}

export async function getAllLoot(): Promise<any[]> {
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
      m.note,
      m.council_note
    FROM loot_history lh
    JOIN members m ON lh.member_id = m.id
    JOIN items i ON lh.item_id = i.id
    ORDER BY lh.date DESC
  `)
}

export async function addLoot(
  member_id: number,
  item_id: number,
  date: string,
  raid?: string,
  notes?: string,
  council_note?: string
): Promise<number> {
  const result = await db.run(
    `INSERT INTO loot_history (member_id, item_id, date, raid, notes, council_note)
     VALUES (?, ?, ?, ?, ?, ?)`,
    member_id,
    item_id,
    date,
    raid ?? null,
    notes ?? null,
    council_note ?? null
  )

  return result.lastID!
}
