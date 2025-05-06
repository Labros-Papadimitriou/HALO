import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import lootRoutes from './routes/lootHistory.routes.js';
import memberRoutes from './routes/member.routes.js';
import itemRoutes from './routes/item.routes.js';
import { initDB } from './db.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize SQLite DB
initDB();

// API Routes
app.use('/api/lootHistory', lootRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/items', itemRoutes);

// --- Serve Frontend ---
// This resolves __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files
const clientPath = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(clientPath));

// Handle client-side routing in Vue (history mode)
const indexPath = path.join(clientPath, 'index.html');
console.log('Resolved __dirname:', __dirname);
console.log('Resolved clientPath:', clientPath);
console.log('Resolved indexPath:', indexPath);
console.log('index.html exists:', fs.existsSync(indexPath));

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.html not found at:', indexPath);
  process.exit(1);
}

app.get('/{*splat}', (req, res) => {
  res.sendFile('index.html', { root: clientPath });
});


// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
