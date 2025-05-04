import { Router } from 'express'
import { getLootHistoryHandler, addLootHistoryHandler, deleteLootHistoryHandler } from '../controllers/lootHistory.controller'

const router = Router()

router.get('/', getLootHistoryHandler)
router.post('/', addLootHistoryHandler)
router.delete('/:id', deleteLootHistoryHandler);

export default router
