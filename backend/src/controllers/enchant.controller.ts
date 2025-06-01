// src/controllers/enchant.controller.ts
import { Request, Response } from 'express';
import {
  getBisEnchantsByClass,
  getMemberEnchantIds,
  getMembersWithSpec
} from '../models/member.model.js';
import { syncMemberEnchants, getRecentReports } from '../models/enchant.model.js';

export async function getEnchantStatusHandler(req: Request, res: Response) {
  const onlyHardcore = req.query.tryhard === 'true';
  const members = await getMembersWithSpec();

  const statusList: Array<{ id: number; name: string; fullyEnchanted: boolean; missingSlots: number[] }> = [];

  for (const m of members) {
    const { id: memberId, name, class_role_id, spec } = m;

    const bisDefs = await getBisEnchantsByClass(class_role_id, onlyHardcore, spec);
    if (bisDefs.length === 0) continue;

    const memberIds = await getMemberEnchantIds(memberId);

    const bisBySlot = new Map<number, number[]>();
    for (const row of bisDefs) {
      if (!bisBySlot.has(row.slot_number)) bisBySlot.set(row.slot_number, []);
      bisBySlot.get(row.slot_number)!.push(row.enchant_id);
    }

    const missingSlots: number[] = [];
    for (const [slot, enchantList] of bisBySlot.entries()) {
      if (!enchantList.some((eid) => memberIds.includes(eid))) {
        missingSlots.push(slot);
      }
    }

    statusList.push({
      id: memberId,
      name,
      fullyEnchanted: missingSlots.length === 0,
      missingSlots
    });
  }

  res.json(statusList);
}

export async function syncMemberEnchantsHandler(req: Request, res: Response) {
  try {
    const reportCode = req.body.reportCode as string | undefined;
    const overwrite = req.body.overwrite !== false;
    const result = await syncMemberEnchants(reportCode, overwrite);
    res.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Sync member enchants failed:', err);
    res.status(500).json({ error: err.message || 'Sync failed' });
  }
}

export async function getRecentReportsHandler(_req: Request, res: Response) {
  try {
    const reports = await getRecentReports(5);
    res.json(reports);
  } catch (err: any) {
    console.error('Get reports failed:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
}
