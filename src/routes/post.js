import { Router } from 'express'
import {
  create,
  getAll,
  deletePost,
  edit,
  createLike,
  deleteLike,
  createComment,
  setIsPrivate
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.patch('/:id', validateAuthentication, edit)
router.patch('/:id/status', validateAuthentication, setIsPrivate)
router.delete('/:id', validateAuthentication, deletePost)
router.post('/:id/comment', validateAuthentication, createComment)
router.post('/:id/like', validateAuthentication, createLike)
router.delete('/:id/like', validateAuthentication, deleteLike)

export default router
