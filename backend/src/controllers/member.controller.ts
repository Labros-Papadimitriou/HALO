import { Request, Response } from 'express'
import { getAllMembers, addMember, syncMembers } from '../models/member.model.js'
import type { Member } from '../types/member.js'

export async function getMembersHandler(_req: Request, res: Response): Promise<void> {
  const members = await getAllMembers()
  res.json(members)
}

export async function addMemberHandler(
  req: Request<{}, any, Member>,
  res: Response
): Promise<any> {
  const { name, discord_role_id, class_role_id } = req.body

  if (!name || !discord_role_id) {
    return res.status(400).json({ error: 'Missing required fields: name or discord_role_id' })
  }

  const id = await addMember({
    name,
    discord_id: '',
    discord_role_id,
    class_role_id
  })

  res.json({ id })
}


export async function syncMembersHandler(req: Request, res: Response) {
  try {
    const result = await syncMembers()
    res.json({ success: true, ...result })
  } catch (err) {
    console.error('Sync failed:', err)
    res.status(500).json({ error: 'Failed to sync members' })
  }
}
