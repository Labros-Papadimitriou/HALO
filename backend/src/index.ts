import express from 'express'
import cors from 'cors'
import { initDB } from './models/loot.model'
import lootRoutes from './routes/loot.routes'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

initDB()

app.use('/api/loot', lootRoutes)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
