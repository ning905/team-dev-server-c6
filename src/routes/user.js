import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateById,
  updateUserById
} from '../controllers/user.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, validateTeacherRole, updateById)
router.put('/:id', validateAuthentication, updateUserById)

export default router
