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
  if (!Array.isArray(reports) || reports.length < 2) {
    throw new Error('Not enough reports found.');
  }
  return reports.slice(0, 2).map((r: any) => r.code as string);
}

// (4) Get all fights in a given report
async function getFights(reportCode: string, token: string): Promise<{ id: number; name: string }[]> {
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
async function getPlayerDetails(reportCode: string, fightId: number, token: string): Promise<any> {
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

export async function syncMemberEnchants(
  forcedReportCode?: string,
  overwrite: boolean = true
): Promise<{ processed: number }> {
  const token = await getAccessToken();
  console.log('✅ Token OK');

  let reportCode = forcedReportCode;
  if (!reportCode) {
    const [latestCode] = await getTwoLatestReportCodes(token);
    reportCode = latestCode;
  }
  console.log(`📄 Using report code: ${reportCode}`);

  const fights = await getFights(reportCode, token);
  console.log(`🎯 fights count: ${fights.length}`);

  const playersMap = new Map<
    string,
    { memberId: number; classRoleId: string; spec: string; seenEnchantIds: Set<number> }
  >();

  for (const fight of fights) {
    const details = await getPlayerDetails(reportCode, fight.id, token);
    const pd = details?.data?.playerDetails;
    if (!pd) continue;

    const dpsPlayers    = Array.isArray(pd.dps)    ? pd.dps    : [];
    const tankPlayers   = Array.isArray(pd.tanks)  ? pd.tanks  : [];
    const healerPlayers = Array.isArray(pd.healers)? pd.healers: [];
    const allPlayers = [...dpsPlayers, ...tankPlayers, ...healerPlayers];

    for (const p of allPlayers) {
      if (!p.name) continue;

      if (!playersMap.has(p.name)) {
        const mRes = await db.query(
          `SELECT id, class_role_id
           FROM members
           WHERE name = $1
             AND class_role_id IS NOT NULL`,
          [p.name]
        );
        if (mRes.rowCount === 0) continue;
        const { id: memberId, class_role_id: classRoleId } = mRes.rows[0];
        playersMap.set(p.name, {
          memberId,
          classRoleId,
          spec: '',
          seenEnchantIds: new Set(),
        });
      }

      const entry = playersMap.get(p.name)!;

      let playerSpec: string | null = null;
      if (Array.isArray(p.specs) && p.specs.length > 0) {
        playerSpec = p.specs[0].spec;
      } else {
        const specRes = await db.query(
          `SELECT spec FROM member_specs WHERE member_id = $1`,
          [entry.memberId]
        );
        if ((specRes.rowCount ?? 0) > 0) {
          playerSpec = specRes.rows[0].spec;
        }
      }

      if (!playerSpec) continue;

      entry.spec = playerSpec;

      for (const gear of p.combatantInfo.gear || []) {
        if (!gear.permanentEnchant) continue;

        const bisRow = await db.query(
          `SELECT id
           FROM bis_enchants
           WHERE enchant_id = $1
             AND slot_number = $2
             AND class_role_id = $3
             AND (spec = $4 OR spec = 'Any')`,
          [gear.permanentEnchant, gear.slot, entry.classRoleId, playerSpec]
        );
        if (bisRow.rowCount === 0) continue;

        entry.seenEnchantIds.add(gear.permanentEnchant);
      }
    }
  }

  if (playersMap.size === 0) {
    console.warn('⚠️  No valid players found. Skipping DB write.');
    return { processed: 0 };
  }

  for (const { memberId, classRoleId, spec, seenEnchantIds } of playersMap.values()) {
    if (overwrite) {
      await db.query(`DELETE FROM member_specs WHERE member_id = $1`, [memberId]);
      await db.query(`DELETE FROM member_enchants WHERE member_id = $1`, [memberId]);
    }

    await db.query(
      `INSERT INTO member_specs (member_id, spec)
       SELECT $1, $2
       WHERE NOT EXISTS (SELECT 1 FROM member_specs WHERE member_id = $1)
       ON CONFLICT (member_id) DO UPDATE SET spec = EXCLUDED.spec`,
      [memberId, spec]
    );

    for (const eid of seenEnchantIds) {
      const idRes = await db.query(
        `SELECT id
         FROM bis_enchants
         WHERE enchant_id = $1
           AND class_role_id = $2
           AND (spec = $3 OR spec = 'Any')`,
        [eid, classRoleId, spec]
      );
      if (idRes.rowCount === 0) continue;

      const bisEnchantId = idRes.rows[0].id;
      await db.query(
        `INSERT INTO member_enchants (member_id, bis_enchant_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [memberId, bisEnchantId]
      );
    }
  }

  const totalProcessed = playersMap.size;
  console.log(`\n✅ syncMemberEnchants complete: ${totalProcessed} players recorded.`);
  return { processed: totalProcessed };
}


export async function getRecentReports(limit = 5): Promise<
  { code: string; title: string; startTime: number }[]
> {
  const token = await getAccessToken();

  const query = `
    {
      reportData {
        reports(
          guildName: "Halo",
          guildServerSlug: "spineshatter",
          guildServerRegion: "EU",
          limit: ${limit}
        ) {
          data {
            code
            title
            startTime
          }
        }
      }
    }
  `;

  const res = await runGraphQLQuery(query, token);
  const reports = res?.data?.reportData?.reports?.data;
  return reports.map((r: any) => ({
    code: r.code,
    title: r.title,
    startTime: r.startTime
  }));
}
