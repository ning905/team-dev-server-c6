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

// need both of these routes?
router.post('/log', validateAuthentication, validateTeacherRole, createLog)
router.delete(
  '/log/:id',
  validateAuthentication,
  validateTeacherRole,
  deleteLogById
)
router.post(
  '/log/line',
  validateAuthentication,
  validateTeacherRole,
  createLine
)
router.delete(
  '/log/line/:id',
  validateAuthentication,
  validateTeacherRole,
  deleteLineById
)

export default router
