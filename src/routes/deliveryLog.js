import { Router } from 'express'
import {
  createLog,
  deleteLog,
  createLine,
  deleteLine
} from '../controllers/deliveryLog.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, createLog)
router.delete('/:id', validateAuthentication, validateTeacherRole, deleteLog)
router.post('/lines', validateAuthentication, validateTeacherRole, createLine)
router.delete(
  '/lines/:id',
  validateAuthentication,
  validateTeacherRole,
  deleteLine
)

export default router
