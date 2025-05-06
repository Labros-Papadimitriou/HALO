import { Router } from 'express'
import { getLootHistoryHandler, addLootHistoryHandler, deleteLootHistoryHandler, updateLootHistoryHandler } from '../controllers/lootHistory.controller.js'

const router = Router()

router.get('/', getLootHistoryHandler)
router.post('/', addLootHistoryHandler)
router.delete('/:id', deleteLootHistoryHandler);
router.put('/:id', updateLootHistoryHandler);

export default router
