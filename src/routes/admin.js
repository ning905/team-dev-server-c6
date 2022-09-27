import { Router } from 'express'
import { updateUserById } from '../controllers/user.js'
import {
  validateAuthentication,
  validateAdminRole
} from '../middleware/auth.js'

const router = Router()

router.put(
  '/user/:id',
  validateAuthentication,
  validateAdminRole,
  updateUserById
)

export default router
