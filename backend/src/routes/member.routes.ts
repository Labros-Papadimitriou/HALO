import { Router } from 'express'
import { addMemberHandler, getMembersHandler, syncMembersHandler } from '../controllers/member.controller.js'

const router = Router()

router.get('/', getMembersHandler)
router.post('/', addMemberHandler)
router.post('/sync', syncMembersHandler)

export default router
