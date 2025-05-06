import { Database } from 'sqlite'
import type { Member } from '../types/member.js'

let db: Database

export function setMemberDB(database: Database) {
  db = database
}

export async function getAllMembers(): Promise<Member[]> {
  return await db.all('SELECT * FROM members ORDER BY name ASC')
}

export async function addMember(member: Member): Promise<number> {
  const result = await db.run(
    `INSERT INTO members (name, class, spec, role) VALUES (?, ?, ?, ?)`,
    member.name,
    member.class,
    member.spec,
    member.role,
  )
  return result.lastID!
}
