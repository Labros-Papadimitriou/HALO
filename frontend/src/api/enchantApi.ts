// src/api/enchantApi.ts
import axios from 'axios'
import type { EnchantStatus } from '@/types/enchant'

const BASE_URL = import.meta.env.VITE_API_URL
const API_URL = `${BASE_URL}/api/enchants`

const AUTH_HEADER = {
  Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
}

// Fetch enchant status (optionally tryhard = true)
export const getEnchantStatus = async (tryhard: boolean = false): Promise<EnchantStatus[]> => {
  const res = await axios.get(`${API_URL}/enchant-status`, {
    headers: AUTH_HEADER,
    params: { tryhard }
  })
  return res.data
}

// Trigger sync (optionally with specific report code)
export const syncEnchants = async (reportCode?: string): Promise<{ processed: number }> => {
  const res = await axios.post(
    `${API_URL}/sync${reportCode ? `?code=${reportCode}` : ''}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
      }
    }
  );
  return res.data;
};

// Get recent Warcraft Logs reports (for selection UI)
export const getRecentReports = async (): Promise<Array<{ code: string; title: string; startTime: number }>> => {
  const res = await axios.get(`${API_URL}/reports`, {
    headers: AUTH_HEADER
  })
  return res.data
}
