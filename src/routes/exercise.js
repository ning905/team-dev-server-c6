import { Router } from 'express'
import {
  createExercise,
  getAllExercises,
  deleteExercise,
  getExerciseById
} from '../controllers/exercise.js'
import { validateAuthentication } from '../middleware/auth.js'
const router = Router()

router.post('/', validateAuthentication, createExercise)
router.get('/', validateAuthentication, getAllExercises)
router.delete('/:id', validateAuthentication, deleteExercise)
router.get('/:id', validateAuthentication, getExerciseById)

export default router
