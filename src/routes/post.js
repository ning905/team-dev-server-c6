import { Router } from 'express'
import {
  create,
  getAll,
  deletePost,
  edit,
  createComment
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.patch('/:id', validateAuthentication, edit)
router.delete('/:id', validateAuthentication, deletePost)
router.post('/:id/comment', validateAuthentication, createComment)

export default router
