import { Router } from 'express'
import {
  createLog,
  deleteLogById,
  createLine,
  deleteLineById
} from '../controllers/deliveryLog.js'
import { validateAuthentication, validateRole } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateRole, createLog)
router.delete('/:id', validateAuthentication, validateRole, deleteLogById)
router.post('/line', validateAuthentication, validateRole, createLine)
router.delete('/line/:id', validateAuthentication, validateRole, deleteLineById)

export default router
