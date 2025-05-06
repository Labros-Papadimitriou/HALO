import { Router } from 'express'
import { getItemsHandler, addItemHandler } from '../controllers/item.controller.js'

const router = Router()

router.get('/', getItemsHandler)
router.post('/', addItemHandler)

export default router
