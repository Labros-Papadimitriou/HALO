import { Router } from 'express'
import { getLootHandler, addLootHandler } from '../controllers/loot.controller'

const router = Router()

router.get('/', getLootHandler)
router.post('/', addLootHandler)

export default router
