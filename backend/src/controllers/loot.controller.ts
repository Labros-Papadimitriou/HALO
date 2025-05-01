import { Request, Response } from 'express'
import { getAllLoot, addLoot } from '../models/loot.model'
import { LootEntry } from '../types/loot'

export async function getLootHandler(_req: Request, res: Response) {
  const loot = await getAllLoot()
  res.json(loot)
}

export async function addLootHandler(req: Request<{}, any, LootEntry>, res: Response): Promise<any> {
  const { raider, item, raid, date } = req.body

  if (!raider || !item || !raid || !date) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const id = await addLoot({ raider, item, raid, date })
  res.json({ id })
}