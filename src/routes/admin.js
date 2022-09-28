import { Router } from 'express'
import { updateUserRoleById } from '../controllers/admin.js'
import {
  validateAuthentication,
  validateAdminRole
} from '../middleware/auth.js'

const router = Router()

router.put(
  '/user/:id',
  validateAuthentication,
  validateAdminRole,
  updateUserRoleById
)

export default router
