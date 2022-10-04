import { Router } from 'express'
import {
  create,
  deleteCohortById,
  getAll,
  getById,
  updateCohortName
} from '../controllers/cohort.js'
import { validateAuthentication, validateRole } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateRole, create)
router.get('/', validateAuthentication, validateRole, getAll)
router.get('/:id', validateAuthentication, validateRole, getById)
router.patch('/:id', validateAuthentication, validateRole, updateCohortName)
router.delete('/:id', validateAuthentication, deleteCohortById)

export default router
