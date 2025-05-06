import { Request, Response } from 'express'
import { getAllItems, addItem } from '../models/item.model.js'
import type { Item } from '../types/item.js'

export async function getItemsHandler(_req: Request, res: Response): Promise<void> {
  const items = await getAllItems()
  res.json(items)
}

export async function addItemHandler(
  req: Request<{}, any, Item>,
  res: Response
): Promise<any> {
  const {
    wowId,
    name,
    icon,
    quality,
    inventory_type,
    item_class,
    item_subclass,
    raid,
    boss
  } = req.body

  if (!name || !wowId || !icon || !quality || !inventory_type || !item_class || !item_subclass || !raid || !boss) {
    return res.status(400).json({ error: 'Missing required item fields' })
  }

  const id = await addItem({
    wowId,
    name,
    icon,
    quality,
    inventory_type,
    item_class,
    item_subclass,
    raid,
    boss
  })

  res.json({ id })
}
