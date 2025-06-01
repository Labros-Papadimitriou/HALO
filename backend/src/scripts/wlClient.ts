// src/models/enchant.model.ts

import axios from 'axios';
import { Pool } from 'pg';

let db: Pool;
export function setEnchantDB(pool: Pool) {
  db = pool;
}

const TOKEN_URL   = 'https://fresh.warcraftlogs.com/oauth/token';
const GRAPHQL_URL = 'https://fresh.warcraftlogs.com/api/v2/client';

// (1) Fetch OAuth token
async function getAccessToken(): Promise<string> {
  const CLIENT_ID     = process.env.WARCRAFT_LOGS_CLIENT_ID!;
  const CLIENT_SECRET = process.env.WARCRAFT_LOGS_CLIENT_SECRET!;
  const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await axios.post(
    TOKEN_URL,
    new URLSearchParams({ grant_type: 'client_credentials' }),
    {
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return res.data.access_token;
}

// (2) Run a GraphQL query
async function runGraphQLQuery(query: string, token: string): Promise<any> {
  const res = await axios.post(
    GRAPHQL_URL,
    { query },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

// (3) Get the two latest report codes
async function getTwoLatestReportCodes(token: string): Promise<string[]> {
  const query = `
    {
      reportData {
        reports(
          guildName: "Halo",
          guildServerSlug: "spineshatter",
          guildServerRegion: "EU",
          limit: 2
        ) {
          data {
            code
          }
        }
      }
    }
  `;
  const res = await runGraphQLQuery(query, token);
  const reports = res?.data?.reportData?.reports?.data;
  if (!Array.isArray(reports) || reports.length < 1) {
    throw new Error('No reports found.');
  }
  // If only 1 report exists, just return it once.
  if (reports.length === 1) {
    return [reports[0].code, reports[0].code];
  }
  return reports.slice(0, 2).map((r: any) => r.code as string);
}

// (4) Get all fights in a given report
async function getFights(
  reportCode: string,
  token: string
): Promise<{ id: number; name: string }[]> {
  const query = `
    {
      reportData {
        report(code: "${reportCode}") {
          fights {
            id
            name
          }
        }
      }
    }
  `;
  const res = await runGraphQLQuery(query, token);
  return res?.data?.reportData?.report?.fights ?? [];
}

// (5) Get playerDetails for a single fight
async function getPlayerDetails(
  reportCode: string,
  fightId: number,
  token: string
): Promise<any> {
  const query = `
    {
      reportData {
        report(code: "${reportCode}") {
          playerDetails(
            fightIDs: [${fightId}],
            includeCombatantInfo: true,
            translate: true
          )
        }
      }
    }
  `;
  const res = await runGraphQLQuery(query, token);
  return res?.data?.reportData?.report?.playerDetails;
}

// (6) Sync member_enchants, trying “previous” then falling back to “latest”
export async function syncMemberEnchants(): Promise<{ processed: number }> {
  // 1) Fetch OAuth token
  const token = await getAccessToken();
  console.log('✅ Token OK');

  // 2) Fetch the two latest report codes
  const [latestCode, previousCode] = await getTwoLatestReportCodes(token);
  console.log(`📄 Latest code: ${latestCode}, Previous code: ${previousCode}`);

  // Helper to process exactly one fight from a given reportCode
  async function processOneFight(reportCode: string): Promise<number> {
    const fights = await getFights(reportCode, token);
    console.log(`🎯 Report ${reportCode} has ${fights.length} fights`);

    if (!Array.isArray(fights) || fights.length === 0) {
      console.log(`  • No fights in report ${reportCode}`);
      return 0;
    }

    // Only the first fight
    const firstFight = fights[0];
    console.log(`⏳ Processing fight: ${firstFight.name} (ID: ${firstFight.id}) in report ${reportCode}`);

    const pd = await getPlayerDetails(reportCode, firstFight.id, token);
    if (!pd) {
      console.log(`  • No playerDetails for fight ${firstFight.name}`);
      return 0;
    }

    // Merge DPS / Tanks / Healers arrays
    const dpsPlayers    = Array.isArray(pd.dps)    ? pd.dps    : [];
    const tankPlayers   = Array.isArray(pd.tanks)  ? pd.tanks  : [];
    const healerPlayers = Array.isArray(pd.healers)? pd.healers: [];
    const allPlayers = [...dpsPlayers, ...tankPlayers, ...healerPlayers];
    console.log(`   → Found ${allPlayers.length} total players in "${firstFight.name}"`);

    if (allPlayers.length === 0) {
      return 0;
    }

    // Accumulate per‐player data
    const playersMap = new Map<
      string,
      { memberId: number; classRoleId: string; spec: string; seenEnchantIds: Set<number> }
    >();

    let count = 0;

    for (const p of allPlayers) {
      if (!p.name) continue;

      // a) Load member by in-game name
      if (!playersMap.has(p.name)) {
        const mRes = await db.query(
          `SELECT id, class_role_id
             FROM members
            WHERE name = $1
              AND class_role_id IS NOT NULL`,
          [p.name]
        );
        if (mRes.rowCount === 0) {
          console.warn(`⚠️  Skipping "${p.name}" (not in members table)`);
          continue;
        }
        const { id: memberId, class_role_id: classRoleId } = mRes.rows[0];
        playersMap.set(p.name, {
          memberId,
          classRoleId,
          spec: '',
          seenEnchantIds: new Set(),
        });
      }

      const entry = playersMap.get(p.name)!;

      // b) Determine “spec”:
      let playerSpec: string | null = null;
      if (Array.isArray(p.specs) && p.specs.length > 0) {
        playerSpec = p.specs[0].spec;
      }
      if (!playerSpec) {
        const specRes = await db.query(
          `SELECT spec FROM member_specs WHERE member_id = $1`,
          [entry.memberId]
        );
        if ((specRes.rowCount ?? 0) > 0) {
          playerSpec = specRes.rows[0].spec;
        }
      }
      if (!playerSpec) {
        console.warn(`⚠️  Skipping "${p.name}" (no spec available)`);
        continue;
      }

      // c) Upsert into member_specs
      await db.query(
        `INSERT INTO member_specs (member_id, spec)
         VALUES ($1, $2)
         ON CONFLICT (member_id) DO UPDATE SET spec = EXCLUDED.spec`,
        [entry.memberId, playerSpec]
      );
      entry.spec = playerSpec;

      // d) For each gear slot, if it has a permanentEnchant, check BIS
      for (const gear of p.combatantInfo.gear || []) {
        if (!gear.permanentEnchant) continue;

        const bisRow = await db.query(
          `SELECT id
             FROM bis_enchants
            WHERE enchant_id    = $1
              AND slot_number   = $2
              AND class_role_id = $3
              AND (spec = $4 OR spec = 'Any')`,
          [gear.permanentEnchant, gear.slot, entry.classRoleId, playerSpec]
        );
        if (bisRow.rowCount === 0) {
          continue;
        }
        entry.seenEnchantIds.add(gear.permanentEnchant);
      }

      count++;
    }

    // e) Write out each member’s seenEnchantIds into member_enchants
    for (const { memberId, classRoleId, spec, seenEnchantIds } of playersMap.values()) {
      // ensure their spec is up to date
      await db.query(
        `INSERT INTO member_specs (member_id, spec)
         VALUES ($1, $2)
         ON CONFLICT (member_id) DO UPDATE SET spec = EXCLUDED.spec`,
        [memberId, spec]
      );

      for (const eid of seenEnchantIds) {
        const idRes = await db.query(
          `SELECT id
             FROM bis_enchants
            WHERE enchant_id    = $1
              AND class_role_id = $2
              AND (spec = $3 OR spec = 'Any')`,
          [eid, classRoleId, spec]
        );
        if (idRes.rowCount === 0) {
          continue;
        }
        const bisEnchantId = idRes.rows[0].id;
        await db.query(
          `INSERT INTO member_enchants (member_id, bis_enchant_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [memberId, bisEnchantId]
        );
      }
    }

    return count;
  }

  // 3) Clear out old data first
  await db.query(`DELETE FROM member_enchants`);
  await db.query(`DELETE FROM member_specs`);

  // 4) Try “previous” report
  let processedCount = await processOneFight(previousCode);

  // 5) If that gave zero, fall back to “latest”
  if (processedCount === 0 && latestCode !== previousCode) {
    console.log('🔄 Previous report yielded 0 players; falling back to latest report');
    processedCount = await processOneFight(latestCode);
  }

  return { processed: processedCount };
}
