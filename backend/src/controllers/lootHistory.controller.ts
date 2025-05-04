import { Request, Response } from 'express'
import { getAllLootHistory, addLootHistory, deleteLootHistory } from '../models/lootHistory.model'
import { LootHistoryEntry } from '../types/lootHistory'

export async function getLootHistoryHandler(_req: Request, res: Response) {
  const loot = await getAllLootHistory()
  res.json(loot)
}

export async function addLootHistoryHandler(
  req: Request<{}, any, LootHistoryEntry>,
  res: Response
): Promise<any> {
  const { member_id, item_id, date, note, council_note } = req.body

  if (!member_id || !item_id || !date) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const id = await addLootHistory(member_id, item_id, date, note, council_note)
  res.json({ id })
}

export async function deleteLootHistoryHandler(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'Missing ID' });
    return;
  }

  await deleteLootHistory(Number(id));
  res.status(204).send(); // No content
}
