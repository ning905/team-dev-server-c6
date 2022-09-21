import { Router } from 'express'
import {
  create,
  getAll,
  getById,
  updateCohortName
} from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/', validateAuthentication, validateTeacherRole, getAll)
router.get('/:id', validateAuthentication, validateTeacherRole, getById)
router.patch(
  '/:id',
  validateAuthentication,
  validateTeacherRole,
  updateCohortName
)

export default router
