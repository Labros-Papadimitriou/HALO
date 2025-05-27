import { Pool } from 'pg';
import type { Member } from '../types/member.js';
import axios from 'axios'

let db: Pool;

export function setMemberDB(pool: Pool) {
  db = pool;
}

export async function getAllMembers(): Promise<Member[]> {
  const result = await db.query(`
    SELECT 
      m.*, 
      r.name AS role_name, 
      cr.name AS class_name
    FROM members m
    LEFT JOIN roles r ON m.discord_role_id = r.discord_role_id
    LEFT JOIN class_roles cr ON m.class_role_id = cr.class_role_id
    ORDER BY r.name, m.name
  `)
  return result.rows
}

export async function addMember(member: Member): Promise<number> {
  const result = await db.query(
    `INSERT INTO members (name, class, class_role, discord_role_id, discord_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [
      member.name,
      member.class_role_id,
      member.discord_role_id,
      member.discord_id
    ]
  )
  return result.rows[0].id
}

export async function syncMembers(): Promise<{ added: number; updated: number; deleted: number }> {
  const {
    DISCORD_BOT_TOKEN,
    DISCORD_GUILD_ID,
    DISCORD_MEMBER_ROLE_IDS,
    DISCORD_CLASS_ROLE_IDS
  } = process.env;

  const memberRoleIds = DISCORD_MEMBER_ROLE_IDS!.split(',');
  const classRoleIds = DISCORD_CLASS_ROLE_IDS!.split(',');

  const allMembers: any[] = [];
  let after = '0';

  while (true) {
    const res = await axios.get(
      `https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/members`,
      {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` },
        params: { limit: 1000, after },
      }
    );

    const batch = res.data;
    if (batch.length === 0) break;

    allMembers.push(...batch);
    after = batch[batch.length - 1].user.id;
  }

  let added = 0;
  let updated = 0;
  const syncedDiscordIds: string[] = [];

  for (const m of allMembers) {
    const hasValidRole = m.roles.some((r: string) => memberRoleIds.includes(r));
    if (!hasValidRole) continue;

    const discordId = m.user.id;
    const name = m.nick || m.user.username;

    let discordRoleId: string | undefined;
    for (const allowedRole of memberRoleIds) {
      if (m.roles.includes(allowedRole)) {
        discordRoleId = allowedRole;
        break;
      }
    }

    if (!discordRoleId) continue;

    const classRoleId = m.roles.find((r: string) => classRoleIds.includes(r)) || null;

    syncedDiscordIds.push(discordId);

    const exists = await db.query(`SELECT 1 FROM members WHERE discord_id = $1`, [discordId]);

    if ((exists.rowCount ?? 0) > 0) {
      await db.query(
        `UPDATE members SET name = $1, discord_role_id = $2, class_role_id = $3 WHERE discord_id = $4`,
        [name, discordRoleId, classRoleId, discordId]
      );
      updated++;
    } else {
      await db.query(
        `INSERT INTO members (discord_id, name, discord_role_id, class_role_id) VALUES ($1, $2, $3, $4)`,
        [discordId, name, discordRoleId, classRoleId]
      );
      added++;
    }
  }

  // 🔥 Delete members not in synced list
  const deleteResult = await db.query(
    `DELETE FROM members WHERE discord_id IS NOT NULL AND discord_id != ALL($1::text[])`,
    [syncedDiscordIds]
  );
  const deleted = deleteResult.rowCount ?? 0;

  return { added, updated, deleted };
}
