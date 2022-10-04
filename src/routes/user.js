import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateUserCohortById,
  updateUserById,
  updateUserPrivacy
} from '../controllers/user.js'
import { validateAuthentication, validateRole } from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, updateUserById)
router.patch(
  '/:id/cohort',
  validateAuthentication,
  validateRole,
  updateUserCohortById
)
router.patch('/:id/privacy', validateAuthentication, updateUserPrivacy)

export default router
