import { Pool } from 'pg';
import type { Member } from '../types/member.js';

let db: Pool;

export function setMemberDB(pool: Pool) {
  db = pool;
}

export async function getAllMembers(): Promise<Member[]> {
  const result = await db.query('SELECT * FROM members ORDER BY name ASC');
  return result.rows;
}

export async function addMember(member: Member): Promise<number> {
  const result = await db.query(
    `INSERT INTO members (name, class, spec, role) VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [member.name, member.class, member.spec, member.role]
  );
  return result.rows[0].id;
}
