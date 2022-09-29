import { Router } from 'express'
import {
  createExercise,
  getAllExercises,
  deleteExercise,
  getExerciseById
} from '../controllers/exercise.js'

const router = Router()

router.post('/', createExercise)
router.get('/', getAllExercises)
router.delete('/:id', deleteExercise)
router.get('/:id', getExerciseById)

export default router
