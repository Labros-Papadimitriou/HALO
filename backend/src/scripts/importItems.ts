import fs from 'fs/promises';
import axios from 'axios';
import { db } from '../db.js';

const NAMESPACE = 'static-classic-us';
const REGION = 'us';
const LOCALE = 'en_US';
const BASE_URL = `https://${REGION}.api.blizzard.com`;
const TOKEN = process.env.BLIZZARD_TOKEN || 'YOUR_TOKEN_HERE';

async function fetchItemData(id: number) {
  const url = `${BASE_URL}/data/wow/item/${id}?namespace=${NAMESPACE}&locale=${LOCALE}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data;
}

async function fetchItemMedia(id: number) {
  const url = `${BASE_URL}/data/wow/media/item/${id}?namespace=${NAMESPACE}`;
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });
  return res.data.assets?.find((a: any) => a.key === 'icon')?.value || null;
}

async function main() {
  const raw = await fs.readFile('naxxramas.json', 'utf-8');
  const items = JSON.parse(raw);

  for (const entry of items) {
    try {
      const itemData = await fetchItemData(entry.wowId);
      const icon = await fetchItemMedia(entry.wowId);

      const name = itemData.name;
      const quality = itemData.quality?.type?.toLowerCase();
      const inventoryType = itemData.inventory_type?.type?.toLowerCase() || null;
      const itemClass = itemData.item_class?.name || null;
      const itemSubclass = itemData.item_subclass?.name || null;

      await db.query(
        `INSERT INTO items (
          wow_id, name, icon, quality, inventory_type,
          item_class, item_subclass, raid, boss
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (wow_id, boss) DO NOTHING`,
        [
          entry.wowId,
          name.trim(),
          icon,
          quality,
          inventoryType,
          itemClass,
          itemSubclass,
          entry.raid,
          entry.boss,
        ]
      );

      console.log(`✅ Imported: ${name}`);
    } catch (err: any) {
      console.error(`❌ Failed for item ${entry.wowId}`, err.message || err);
    }
  }

  await db.end();
}

main();
