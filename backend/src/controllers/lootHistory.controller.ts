import { Request, Response } from 'express'
import { getAllLootHistory, addLootHistory, deleteLootHistory, updateLootHistory } from '../models/lootHistory.model.js'
import { LootHistoryEntry } from '../types/lootHistory.js'
import { loadAndImportLoot, updatePriorityNotes } from '../scripts/importLootHistory.js'

export async function getLootHistoryHandler(_req: Request, res: Response) {
  const loot = await getAllLootHistory()
  res.json(loot)
}

export async function addLootHistoryHandler(
  req: Request<{}, any, LootHistoryEntry>,
  res: Response
): Promise<any> {
  const { member_id, item_id, date, note, council_note, priority_note } = req.body

  if (!member_id || !item_id || !date) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const id = await addLootHistory(member_id, item_id, date, note, council_note, priority_note)
  res.json({ id })
}

export async function importLootHistoryHandler(
  req: Request<{}, any, LootHistoryEntry>,
  res: Response
): Promise<any> {
  const jsonData: any = req.body
  await updatePriorityNotes(jsonData)
  res.status(200).json({ success: true });
}

export async function deleteLootHistoryHandler(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Missing ID' });
    return;
  }

  await deleteLootHistory(Number(id));
  res.status(204).send();
}

export async function updateLootHistoryHandler(req: Request<{ id: string }, any, LootHistoryEntry>, res: Response): Promise<void> {
  const { id } = req.params;
  const { member_id, item_id, date, note, council_note, priority_note } = req.body;

  if (!id || !member_id || !item_id || !date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  await updateLootHistory(Number(id), member_id, item_id, date, note, council_note, priority_note);
  res.status(200).json({ success: true });
}
