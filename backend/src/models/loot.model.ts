import { Database } from 'sqlite'

let db: Database

export function setLootDB(database: Database) {
  db = database
}

export async function getAllLoot(): Promise<any[]> {
  return await db.all(`
    SELECT lh.id, m.name AS raider, i.name AS item, lh.date, lh.raid, lh.notes
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
  notes?: string
): Promise<number> {
  const result = await db.run(
    `INSERT INTO loot_history (member_id, item_id, date, raid, notes)
     VALUES (?, ?, ?, ?, ?)`,
    member_id,
    item_id,
    date,
    raid ?? null,
    notes ?? null
  )

  return result.lastID!
}
