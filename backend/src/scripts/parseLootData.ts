import * as fs from "fs";
import * as path from "path";

interface LootEntry {
  player: string;
  date: string;
  time: string;
  id: string;
  item_id: number;
  itemString: string;
  response: string;
  votes: number;
  class: string;
  instance: string;
  boss: string;
  gear1: string;
  gear2: string;
  responseID: string;
  isAwardReason: string;
  rollType: string;
  subType: string;
  equipLoc: string;
  note: string;
  owner: string;
  itemName: string;
  servertime: string;
}

const LUA_PATH = path.join(
  "D:",
  "World of Warcraft",
  "_classic_era_",
  "WTF",
  "Account",
  "SENTENCED91",
  "SavedVariables",
  "RCLootCouncil_Classic.lua"
);

function extractJSONFromLua(filePath: string): LootEntry[] | null {
  const content = fs.readFileSync(filePath, "utf8");

  // Match the quoted JSON string assigned to ["json"]
  const match = content.match(/\["json"\]\s*=\s*"((?:\\.|[^\\"])*)"/);

  if (!match) {
    console.error("❌ Could not extract JSON string.");
    return null;
  }

  let rawJson = match[1];

  // Unescape WoW-style Lua string encoding
  const fixedJson = rawJson
    .replace(/\\"/g, '"')    // Unescape quotes
    .replace(/\\n/g, '')     // Remove newlines
    .replace(/\\\\/g, '\\'); // Unescape backslashes

  try {
    const data = JSON.parse(fixedJson);
    if (!Array.isArray(data)) throw new Error("Parsed data is not an array.");
    return data;
  } catch (err: any) {
    console.error("❌ JSON parsing failed:", err.message);
    return null;
  }
}

const lootData = extractJSONFromLua(LUA_PATH);

if (lootData) {
  console.log(`✅ Parsed ${lootData.length} loot entries.`);
  console.log("🧾 First entry:", lootData[0]);
} else {
  console.log("⚠️ No data found.");
}
