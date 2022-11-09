import { Router } from 'express'
import { login } from '../controllers/auth.js'
import { sendMessageResponse } from '../utils/responses.js'

const router = Router()

router.get('/', (req, res) => sendMessageResponse(res, 200, 'OK'))
router.post('/login', login)

export default router
