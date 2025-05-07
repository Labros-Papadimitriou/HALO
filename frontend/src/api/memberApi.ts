import axios from 'axios'
import type { Member } from '../types/member'

const API_URL = 'https://halo-xepper.onrender.com/api/members'

export const getAllMembers = async (): Promise<Member[]> => {
  const res = await axios.get(API_URL)
  return res.data
}

export const addMember = async (member: Member): Promise<number> => {
  const res = await axios.post(API_URL, member)
  return res.data.id
}
