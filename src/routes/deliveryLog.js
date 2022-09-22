import { Router } from 'express'
import {
  createLog,
  deleteLogById,
  createLine,
  deleteLineById
} from '../controllers/deliveryLog.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, createLog)
router.delete(
  '/:id',
  validateAuthentication,
  validateTeacherRole,
  deleteLogById
)
router.post('/line', validateAuthentication, validateTeacherRole, createLine)
router.delete(
  '/line/:id',
  validateAuthentication,
  validateTeacherRole,
  deleteLineById
)

export default router
