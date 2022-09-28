import { Router } from 'express'
import { getEvents } from '../controllers/event'
import { validateAuthentication } from '../middleware/auth'

const router = Router()

router.get('/', validateAuthentication, getEvents)

export default router
