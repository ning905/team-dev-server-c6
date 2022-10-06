import { Router } from 'express'
import { validateAuthentication, validateRole } from '../middleware/auth.js'
import {
  getAllCurriculums,
  updateCurriculumById,
  deleteCurriculumById,
  createCurriculum,
  createModule,
  getAllModulesByCurr,
  getAllModules,
  getModuleById,
  updateModuleById,
  deleteModuleById,
  createUnit,
  getAllUnitsByModule,
  getAllUnits,
  getUnitById,
  updateUnitById,
  deleteUnitById,
  createLesson
} from '../controllers/curriculum.js'

const router = Router()

router.post('/', validateAuthentication, validateRole, createCurriculum)
router.get('/', validateAuthentication, getAllCurriculums)
router.put('/:id', validateAuthentication, validateRole, updateCurriculumById)
router.delete(
  '/:id',
  validateAuthentication,
  validateRole,
  deleteCurriculumById
)

router.post('/:id/module', validateAuthentication, createModule)
router.get('/:id/module', validateAuthentication, getAllModulesByCurr)
router.get('/moduels', validateAuthentication, getAllModules)
router.get('/:id/module/:moduleId', validateAuthentication, getModuleById)
router.put(
  '/:id/module/:moduleId',
  validateAuthentication,
  validateRole,
  updateModuleById
)
router.delete(
  '/:id/module/:moduleId',
  validateAuthentication,
  validateRole,
  deleteModuleById
)

router.post('/:id/module/:moduleId/unit', validateAuthentication, createUnit)
router.get(
  '/:id/module/:moduleId/units',
  validateAuthentication,
  getAllUnitsByModule
)
router.get('/modules/units', validateAuthentication, getAllUnits)
router.get(
  '/:id/module/:moduleId/unit/:unitId',
  validateAuthentication,
  getUnitById
)
router.put(
  '/:id/module/:moduleId/unit/:unitId',
  validateAuthentication,
  validateRole,
  updateUnitById
)
router.delete(
  '/:id/module/:moduleId/unit/:unitId',
  validateAuthentication,
  validateRole,
  deleteUnitById
)

router.post(
  '/:id/module/:moduleId/unit/:unitId/lesson',
  validateAuthentication,
  createLesson
)
// router.get(
//   '/:id/module/:moduleId/unit/:unitId/lesson',
//   validateAuthentication,
//   getAllLessons
// )
// router.get(
//   '/:id/module/:moduleId/unit/:unitId/lesson/:lessonId',
//   validateAuthentication,
//   getLessonById
// )
// router.put(
//   '/:id/module/:moduleId/unit/:unitId/lesson/:lessonId',
//   validateAuthentication, validateRole
//   updateLessonById
// )
// router.delete(
//   '/:id/module/:moduleId/unit/:unitId/lesson/:lessonId',
//   validateAuthentication, validateRole
//   deleteLessonById
// )

// router.post(
//   '/:id/module/:moduleId/unit/:unitId/lesson/:lessonId/lessonPlan',
//   validateAuthentication,
//   createLessonPlan
// )
// router.get(
//   '/:id/module/:moduleId/unit/:unitId/lesson/:lessonId/lessonPlan',
//   validateAuthentication,
//   getLessonPlan
// )
// router.put(
//   '/:id/module/:moduleId/unit/:unitId/lesson/:lessonId/lessonPlan',
//   validateAuthentication, validateRole
//   updateLessonPlan
// )
// router.delete(
//   '/:id/module/:moduleId/unit/:unitId/lesson/:lessonId/lessonPlan',
//   validateAuthentication, validateRole
//   deleteLessonPlan
// )

export default router
