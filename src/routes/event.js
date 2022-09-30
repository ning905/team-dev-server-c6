import { Router } from 'express'
import { getEvents } from '../controllers/event.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getEvents)

export default router
