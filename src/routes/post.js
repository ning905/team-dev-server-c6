import { Router } from 'express'
import { create, edit, getAll } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.patch('/:id', validateAuthentication, edit)

export default router
