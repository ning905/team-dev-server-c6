import { Router } from 'express'
import {
  create,
  getAll,
  deletePost,
  edit,
  createLike,
  deleteLike,
  createComment,
  setIsPrivate,
  setIsPinned,
  createCommentLike,
  deleteCommentLike,
  deleteComment,
  updateComment
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)

router.patch('/:id', validateAuthentication, edit)
router.patch('/:id/status', validateAuthentication, setIsPrivate)
router.patch('/:id/pinned', validateAuthentication, setIsPinned)
router.delete('/:id', validateAuthentication, deletePost)

router.post('/:id/like', validateAuthentication, createLike)
router.delete('/:id/like', validateAuthentication, deleteLike)

router.post(
  '/:postId/comment/:commentId/like',
  validateAuthentication,
  createCommentLike
)
router.delete(
  '/:postId/comment/:commentId/like',
  validateAuthentication,
  deleteCommentLike
)
router.post('/:id/comment', validateAuthentication, createComment)
router.delete(
  '/:postId/comment/:commentId',
  validateAuthentication,
  deleteComment
)
router.patch(
  '/:postId/comment/:commentId',
  validateAuthentication,
  updateComment
)

export default router
