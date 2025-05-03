import { Router } from 'express'
import { getLootHistoryHandler, addLootHistoryHandler } from '../controllers/lootHistory.controller'

const router = Router()

router.get('/', getLootHistoryHandler)
router.post('/', addLootHistoryHandler)

export default router
