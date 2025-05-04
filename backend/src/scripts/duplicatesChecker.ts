const fs = require('fs');

// Load the JSON file
const data = JSON.parse(fs.readFileSync('zg_items.json', 'utf8'));

// Count occurrences of wowId
const wowIdCounts = {};
const duplicates = [];

data.forEach(entry => {
  const id = entry.wowId;
  wowIdCounts[id] = (wowIdCounts[id] || 0) + 1;
});

// Find and collect duplicates
for (const [id, count] of Object.entries(wowIdCounts)) {
  if (count as number > 1) {
    duplicates.push({ wowId: Number(id), count });
  }
}

// Output result
if (duplicates.length > 0) {
  console.log('Duplicate wowId values found:');
  console.table(duplicates);
} else {
  console.log('No duplicate wowId values found.');
}
