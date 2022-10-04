import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateById,
  updateLoggedInUser,
  checkUserLoginDetails
} from '../controllers/user.js'
import { validateAuthentication, validateRole } from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch('/myprofile', validateAuthentication, updateLoggedInUser)
router.patch('/:id', validateAuthentication, validateRole, updateById)
router.post('/:id', validateAuthentication, checkUserLoginDetails)

export default router
