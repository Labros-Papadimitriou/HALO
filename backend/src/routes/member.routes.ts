import { Router } from 'express'
import { addMemberHandler, getMembersHandler } from '../controllers/member.controller'

const router = Router()

router.get('/', getMembersHandler)
router.post('/', addMemberHandler)

export default router
