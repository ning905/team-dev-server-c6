import { Router } from 'express'
import { updateById } from '../controllers/user.js'
import {
  validateAuthentication,
  validateAdminRole
} from '../middleware/auth.js'

const router = Router()

router.put('/user/:id', validateAuthentication, validateAdminRole, updateById)

export default router
