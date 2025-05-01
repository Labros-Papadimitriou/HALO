import express from 'express'
import cors from 'cors'
import lootRoutes from './routes/loot.routes'
import { initDB } from './db'
import memberRoutes from './routes/member.routes'
import itemRoutes from './routes/item.routes'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

initDB()

app.use('/api/loot', lootRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/items', itemRoutes)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
