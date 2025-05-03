import { Request, Response } from 'express'
import { getAllMembers, addMember } from '../models/member.model'
import type { Member } from '../types/member'

export async function getMembersHandler(_req: Request, res: Response): Promise<void> {
  const members = await getAllMembers()
  res.json(members)
}

export async function addMemberHandler(
  req: Request<{}, any, Member>,
  res: Response
): Promise<any> {
  const { name, class: className, spec, role } = req.body

  if (!name || !className || !spec || !role) {
    return res.status(400).json({ error: 'Missing required member fields' })
  }

  const id = await addMember({ name, class: className, spec, role })
  res.json({ id })
}
