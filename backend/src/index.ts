import dotenv from 'dotenv'
dotenv.config({ path: process.env.ENV_PATH || '.env' })

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import lootHistoryRoutes from './routes/lootHistory.routes.js'
import memberRoutes from './routes/member.routes.js'
import itemRoutes from './routes/item.routes.js'
import authRoutes from './auth.js'
import { initDB } from './db.js'
import enchantRoutes from './routes/enchant.routes.js'

const app = express()
const port = process.env.PORT || 3001

// === CORS Setup ===
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(express.json({ limit: '10mb' }))

// === Init DB ===
initDB()

// === Auth Middleware ===
const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (token !== process.env.API_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  next()
}

// === Discord OAuth Routes ===
app.use('/auth', authRoutes);

// === Apply Auth to API Routes ===
app.use('/api', requireAuth)
app.use('/api/lootHistory', lootHistoryRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/enchants', enchantRoutes);

// === Serve Frontend ===
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const clientPath = path.resolve(__dirname, '../../frontend/dist')
app.use(express.static(clientPath))

const indexPath = path.join(clientPath, 'index.html')
if (!fs.existsSync(indexPath)) {
  console.error('index.html not found at:', indexPath)
  process.exit(1)
}

app.get('/{*splat}', (req, res) => {
  res.sendFile('index.html', { root: clientPath })
})

// === Start Server ===
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
