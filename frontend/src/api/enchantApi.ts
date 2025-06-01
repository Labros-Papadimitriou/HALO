// src/api/enchantApi.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/api/enchants`;

export const getEnchantStatus = async (tryhard = false) => {
  const res = await axios.get(`${API_URL}/status`, {
    params: { tryhard },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
    },
  });
  return res.data;
};

export const syncEnchants = async (reportCode?: string, overwrite = true): Promise<{ processed: number }> => {
  const res = await axios.post(
    `${API_URL}/sync`,
    { reportCode, overwrite },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
      },
    }
  );
  return res.data;
};

export const getRecentReports = async (): Promise<{ code: string; title: string; startTime: number }[]> => {
  const res = await axios.get(`${API_URL}/reports`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
    },
  });
  return res.data;
};
