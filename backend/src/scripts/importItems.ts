import fs from 'fs/promises'
import axios from 'axios'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const NAMESPACE = 'static-classic1x-eu'
const REGION = 'eu'
const LOCALE = 'en_GB'
const BASE_URL = `https://${REGION}.api.blizzard.com`
const TOKEN = 'EU1tlb4U1Lht3688XBoOqvH4uSVxBQ1xVe'

// ✅ This fetches the main item data (name, quality, class, etc)
async function fetchItemData(id: number) {
  const url = `${BASE_URL}/data/wow/item/${id}?namespace=${NAMESPACE}&locale=${LOCALE}`
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })
  return res.data
}

// ✅ This fetches the item's icon
async function fetchItemMedia(id: number) {
  const url = `${BASE_URL}/data/wow/media/item/${id}?namespace=${NAMESPACE}`
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })
  return res.data.assets?.find((a: any) => a.key === 'icon')?.value || null
}

async function main() {
  const raw = await fs.readFile('items_to_import.json', 'utf-8')
  const items = JSON.parse(raw)

  const db = await open({ filename: '../../loot-council.db', driver: sqlite3.Database })

  for (const entry of items) {
    try {
      const itemData = await fetchItemData(entry.wowId)
      const icon = await fetchItemMedia(entry.wowId)

      const name = itemData.name
      const quality = itemData.quality.type.toLowerCase()
      const inventoryType = itemData.inventory_type?.type || null
      const itemClass = itemData.item_class?.name || null
      const itemSubclass = itemData.item_subclass?.name || null

      await db.run(
        `INSERT OR IGNORE INTO items (
          wow_id, name, icon, quality, inventory_type,
          item_class, item_subclass, raid, boss
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.wowId,
          name.trim(),
          icon,
          quality?.toLowerCase(),
          inventoryType?.toLowerCase(),
          itemClass,
          itemSubclass,
          entry.raid,
          entry.boss,
        ]
      )      

      console.log(`✅ Imported: ${name}`)
    } catch (err: any) {
      console.error(`❌ Failed for item ${entry.wowId}`, err.message || err)
    }
  }

  await db.close()
}

main()
