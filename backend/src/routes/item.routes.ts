import { Router } from 'express'
import { getItemsHandler, addItemHandler } from '../controllers/item.controller'

const router = Router()

router.get('/', getItemsHandler)
router.post('/', addItemHandler)

export default router
