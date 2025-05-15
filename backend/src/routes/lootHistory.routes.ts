import { Router } from 'express'
import { getLootHistoryHandler, addLootHistoryHandler, deleteLootHistoryHandler, updateLootHistoryHandler, importLootHistoryHandler } from '../controllers/lootHistory.controller.js'

const router = Router()

router.get('/', getLootHistoryHandler)
router.post('/', addLootHistoryHandler)
router.post('/import', importLootHistoryHandler)
router.delete('/:id', deleteLootHistoryHandler);
router.put('/:id', updateLootHistoryHandler);

export default router
