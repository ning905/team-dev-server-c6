import { Router } from 'express'
import { create, getAll, deletePost, edit } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.patch('/:id', validateAuthentication, edit)
router.delete('/:id', validateAuthentication, deletePost)

export default router
