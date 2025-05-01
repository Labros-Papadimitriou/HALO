import { Request, Response } from 'express'
import { getAllItems, addItem } from '../models/item.model'
import type { Item } from '../types/item'

export async function getItemsHandler(_req: Request, res: Response): Promise<void> {
  const items = await getAllItems()
  res.json(items)
}

export async function addItemHandler(
  req: Request<{}, any, Item>,
  res: Response
): Promise<any> {
  const { name, class_list, slot, boss, raid, wowId } = req.body

  if (!name || !slot || !boss || !raid) {
    return res.status(400).json({ error: 'Missing required item fields' })
  }

  const id = await addItem({ name, class_list, slot, boss, raid, wowId })
  res.json({ id })
}
