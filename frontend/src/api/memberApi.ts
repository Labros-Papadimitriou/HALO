import axios from 'axios'
import type { Member } from '../types/member'

const BASE_URL = import.meta.env.VITE_API_URL
const API_URL = `${BASE_URL}/api/members`

export const getAllMembers = async (): Promise<Member[]> => {
  const res = await axios.get(API_URL, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
  return res.data
}

export const addMember = async (member: Member): Promise<number> => {
  const res = await axios.post(API_URL, member, {
    headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  }})
  return res.data.id
}
