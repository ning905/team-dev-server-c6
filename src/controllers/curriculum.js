import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

import { myEmitter } from '../eventEmitter/index.js'
import { ServerErrorEvent, NotFoundEvent } from '../eventEmitter/utils.js'

export const createCurriculum = async (req, res) => {
  if (!req.body.name) {
    return sendMessageResponse(res, 400, 'missing curriculum name')
  }

  if (!req.body.description) {
    return sendMessageResponse(res, 400, 'missing curriculum description')
  }
  try {
    const newCurriculum = await dbClient.curriculum.create({
      data: {
        name: req.body.name,
        description: req.body.description
      }
    })
    myEmitter.emit('create-curriculum', newCurriculum, req.user)
    return sendDataResponse(res, 201, { curriculum: newCurriculum })
  } catch (err) {
    const error = new ServerErrorEvent(
      req.user,
      'create-curriculum',
      'Unable to create curriculum'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const getAllCurriculums = async (req, res) => {
  try {
    const currs = await dbClient.curriculum.findMany()

    return sendDataResponse(res, 200, currs)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'fetch-all-curriculums')
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }
}

export const updateCurriculumById = async (req, res) => {
  const id = Number(req.params.id)

  if (!req.body.name) {
    return sendMessageResponse(res, 400, 'missing curriculum name')
  }

  if (!req.body.description) {
    return sendMessageResponse(res, 400, 'missing curriculum description')
  }

  const foundCurriculum = await dbClient.curriculum.findUnique({
    where: { id }
  })

  if (!foundCurriculum) {
    const notFound = new NotFoundEvent(
      req.user,
      `edit-curriculum-${id}`,
      'curriculum'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }
  try {
    const updatedCurriculum = await dbClient.curriculum.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description
      }
    })
    myEmitter.emit(
      'update-curriculum',
      updatedCurriculum,
      req.user,
      foundCurriculum.name,
      foundCurriculum.description
    )
    return sendDataResponse(res, 201, updatedCurriculum)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, `update-curriculum-${id}`)
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const deleteCurriculumById = async (req, res) => {
  const id = Number(req.params.id)

  const foundCurr = await dbClient.curriculum.findUnique({ where: { id } })
  if (!foundCurr) {
    const notFound = new NotFoundEvent(
      req.user,
      `delete-curriculum-${id}`,
      'curriculum'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  try {
    const deleted = await dbClient.curriculum.delete({ where: { id } })
    myEmitter.emit('delete-curriculum', deleted, req.user)
    return sendDataResponse(res, 201, deleted)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, `delete-curriculum-${id}`)
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }
}

export const createModule = async (req, res) => {
  const { name, description, objectives } = req.body
  const currId = Number(req.params.id)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing module name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing module description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing module objectives')
  }

  try {
    const created = await dbClient.module.create({
      data: {
        name,
        description,
        objectives,
        curriculums: { connect: { id: currId } }
      }
    })
    myEmitter.emit('create-module', created, req.user)
    return sendDataResponse(res, 201, created)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'create-module')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const getAllModulesByCurr = async (req, res) => {
  const currId = Number(req.params.id)

  try {
    const modules = await dbClient.module.findMany({
      where: {
        curriculum: {
          some: {
            id: currId
          }
        }
      }
    })

    return sendDataResponse(res, 200, modules)
  } catch (err) {
    const error = new ServerErrorEvent(
      req.user,
      `fetch-modules-for-curriculum-${currId}`
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }
}

export const getAllModules = async (req, res) => {
  try {
    const allModules = await dbClient.module.findMany()
    return sendDataResponse(res, 201, { modules: allModules })
  } catch (err) {
    sendMessageResponse(res, 500, 'Unable to fetch modules')
    throw err
  }
}

export const getModuleById = async (req, res) => {
  const currId = Number(req.params.id)
  const moduleId = Number(req.params.moduleId)

  try {
    const foundModule = await dbClient.module.findFirst({
      where: {
        id: moduleId,
        curriculums: {
          some: {
            id: currId
          }
        }
      }
    })

    return sendDataResponse(res, 201, foundModule)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'fetch-module')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const updateModuleById = async (req, res) => {
  const { name, description, objectives } = req.body
  const currId = Number(req.params.id)
  const moduleId = Number(req.params.moduleId)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing module name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing module description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing module objectives')
  }

  const foundModule = await dbClient.module.findFirst({
    where: {
      id: moduleId,
      curriculums: {
        some: {
          id: currId
        }
      }
    }
  })

  if (!foundModule) {
    const notFound = new NotFoundEvent(
      req.user,
      `edit-module-${moduleId}`,
      'module'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  try {
    const updateModule = await dbClient.module.update({
      where: { id: moduleId },
      data: { name, description, objectives },
      include: {
        units: true,
        curriculums: true
      }
    })
    myEmitter.emit('update-module', updateModule, req.user)
    return sendDataResponse(res, 201, updateModule)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, `edit-module-${moduleId}`)
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const deleteModuleById = async (req, res) => {
  const moduleId = Number(req.params.moduleId)

  const foundModule = await dbClient.module.findUnique({
    where: {
      id: moduleId
    },
    include: {
      units: true
    }
  })

  if (!foundModule) {
    const notFound = new NotFoundEvent(
      req.user,
      `delete-module-${moduleId}`,
      'post'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  const deleteModule = await dbClient.module.delete({
    where: {
      id: moduleId
    },
    include: {
      units: true
    }
  })
  myEmitter.emit('delete-module', deleteModule, req.user)
  return sendDataResponse(res, 201, { deleteModule })
}

export const createUnit = async (req, res) => {
  const { name, description, objectives } = req.body
  const moduleId = Number(req.params.moduleId)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing unit name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing unit description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing unit objectives')
  }

  try {
    const newUnit = await dbClient.unit.create({
      data: {
        name,
        description,
        objectives,
        module: { connect: { id: moduleId } }
      }
    })
    myEmitter.emit('create-unit', newUnit, req.user)
    return sendDataResponse(res, 201, { unit: newUnit })
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'create-unit')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const getAllUnitsByModule = async (req, res) => {
  const moduleId = Number(req.params.moduleId)

  try {
    const units = await dbClient.unit.findMany({
      where: { moduleId }
    })

    return sendDataResponse(res, 200, units)
  } catch (err) {
    const error = new ServerErrorEvent(
      req.user,
      `fetch-units-for-module-${moduleId}`
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }
}

export const getAllUnits = async (req, res) => {
  try {
    const allUnits = await dbClient.unit.findMany()
    return sendDataResponse(res, 201, { units: allUnits })
  } catch (err) {
    sendMessageResponse(res, 500, 'Unable to fetch units')
    throw err
  }
}

export const getUnitById = async (req, res) => {
  const moduleId = Number(req.params.moduleId)
  const unitId = Number(req.params.unitId)

  try {
    const foundUnit = await dbClient.unit.findFirst({
      where: {
        id: unitId,
        moduleId
      }
    })

    return sendDataResponse(res, 201, foundUnit)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'fetch-unit')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const updateUnitById = async (req, res) => {
  const { name, description, objectives } = req.body
  const unitId = Number(req.params.unitId)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing unit name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing unit description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing unit objectives')
  }

  const foundUnit = await dbClient.unit.findFirst({
    where: { id: unitId }
  })

  if (!foundUnit) {
    const notFound = new NotFoundEvent(req.user, `edit-unit-${unitId}`, 'unit')
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  try {
    const updateUnit = await dbClient.unit.update({
      where: { id: unitId },
      data: { name, description, objectives },
      include: {
        lessons: true
      }
    })
    myEmitter.emit('update-unit', updateUnit, req.user)
    return sendDataResponse(res, 201, updateUnit)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, `edit-unit-${unitId}`)
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const deleteUnitById = async (req, res) => {
  const unitId = Number(req.params.unitId)

  const foundUnit = await dbClient.unit.findUnique({
    where: {
      id: unitId
    },
    include: {
      lessons: true
    }
  })

  if (!foundUnit) {
    const notFound = new NotFoundEvent(
      req.user,
      `delete-unit-${unitId}`,
      'unit'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  const deleteUnit = await dbClient.unit.delete({
    where: {
      id: unitId
    },
    include: {
      lessons: true
    }
  })
  myEmitter.emit('delete-unit', deleteUnit, req.user)
  return sendDataResponse(res, 201, { deleteUnit })
}

export const createLesson = async (req, res) => {
  const { name, description, objectives, dayNumber } = req.body
  const unitId = Number(req.params.unitId)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing lesson name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing lesson description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing lesson objectives')
  }

  try {
    const newLesson = await dbClient.lesson.create({
      data: {
        name,
        description,
        objectives,
        unit: { connect: { id: unitId } },
        dayNumber
      }
    })
    myEmitter.emit('create-lesson', newLesson, req.user)
    return sendDataResponse(res, 201, newLesson)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'create-lesson')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const getAllLessonsByUnit = async (req, res) => {
  const unitId = Number(req.params.unitId)

  try {
    const lessons = await dbClient.lesson.findMany({
      where: { unitId }
    })

    return sendDataResponse(res, 200, lessons)
  } catch (err) {
    const error = new ServerErrorEvent(
      req.user,
      `fetch-lessons-for-module-${unitId}`
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }
}

export const getAllLessons = async (req, res) => {
  try {
    const allLessons = await dbClient.lesson.findMany()
    return sendDataResponse(res, 201, { lessons: allLessons })
  } catch (err) {
    sendMessageResponse(res, 500, 'Unable to fetch lessons')
    throw err
  }
}

export const getLessonById = async (req, res) => {
  const unitId = Number(req.params.unitId)
  const lessonId = Number(req.params.lessonId)

  try {
    const foundLesson = await dbClient.lesson.findFirst({
      where: {
        id: lessonId,
        unitId
      }
    })

    return sendDataResponse(res, 201, foundLesson)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'fetch-lesson')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const updateLessonById = async (req, res) => {
  const { name, description, objectives, dayNumber } = req.body
  const lessonId = Number(req.params.lessonId)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing lesson name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing lesson description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing lesson objectives')
  }

  const foundLesson = await dbClient.lesson.findFirst({
    where: { id: lessonId }
  })

  if (!foundLesson) {
    const notFound = new NotFoundEvent(
      req.user,
      `edit-lesson-${lessonId}`,
      'lesson'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  try {
    const updateLesson = await dbClient.lesson.update({
      where: { id: lessonId },
      data: { name, description, objectives, dayNumber },
      include: {
        lessonPlans: true
      }
    })
    myEmitter.emit('update-lesson', updateLesson, req.user)
    return sendDataResponse(res, 201, updateLesson)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, `edit-lesson-${lessonId}`)
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const deleteLessonById = async (req, res) => {
  const lessonId = Number(req.params.lessonId)

  const foundLesson = await dbClient.lesson.findUnique({
    where: {
      id: lessonId
    },
    include: {
      lessonPlans: true,
      exercises: true
    }
  })

  if (!foundLesson) {
    const notFound = new NotFoundEvent(
      req.user,
      `delete-lesson-${lessonId}`,
      'lesson'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  const deleteLesson = await dbClient.lesson.delete({
    where: {
      id: lessonId
    }
  })
  myEmitter.emit('delete-lesson', deleteLesson, req.user)
  return sendDataResponse(res, 201, { deleteLesson })
}

export const createLessonPlan = async (req, res) => {
  const { name, description, objectives } = req.body
  const lessonId = Number(req.params.lessonId)
  const createdById = Number(req.user.id)
  const createdForId = Number(req.body.user.id)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing lesson plan name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing lesson plan description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing lesson plan objectives')
  }

  try {
    const createdLessonPlan = await dbClient.lessonPlan.create({
      data: {
        name,
        description,
        objectives,
        lessonId,
        createdById,
        createdForId
      }
    })
    myEmitter.emit('create-lesson-plan', createdLessonPlan, req.user)
    return sendDataResponse(res, 201, createdLessonPlan)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'create-lesson-plan')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const getAllLessonPlansByLesson = async (req, res) => {
  const lessonId = Number(req.params.lessonId)

  try {
    const lessonPlans = await dbClient.lessonPlan.findMany({
      where: { lessonId }
    })

    return sendDataResponse(res, 200, lessonPlans)
  } catch (err) {
    const error = new ServerErrorEvent(
      req.user,
      `fetch-lesson-plans-for-lesson-${lessonId}`
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }
}

export const getAllLessonPlans = async (req, res) => {
  try {
    const allLessonPlans = await dbClient.lessonPlan.findMany()
    return sendDataResponse(res, 201, { lessonPlans: allLessonPlans })
  } catch (err) {
    sendMessageResponse(res, 500, 'Unable to fetch lesson plans')
    throw err
  }
}

export const getLessonPlanById = async (req, res) => {
  const lessonId = Number(req.params.lessonId)
  const lessonPlanId = Number(req.params.lessonPlanId)

  try {
    const foundLessonPlan = await dbClient.lessonPlan.findFirst({
      where: {
        id: lessonPlanId,
        lessonId
      }
    })

    return sendDataResponse(res, 201, foundLessonPlan)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'fetch-lesson-plans')
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const updateLessonPlanById = async (req, res) => {
  const { name, description, objectives } = req.body
  const lessonPlanId = Number(req.params.lessonPlanId)

  if (!name) {
    return sendMessageResponse(res, 400, 'missing lesson plan name')
  }
  if (!description) {
    return sendMessageResponse(res, 400, 'missing lesson plan description')
  }
  if (!objectives) {
    return sendMessageResponse(res, 400, 'missing lesson plan objectives')
  }

  const foundLessonPlan = await dbClient.lesson.findFirst({
    where: { id: lessonPlanId }
  })

  if (!foundLessonPlan) {
    const notFound = new NotFoundEvent(
      req.user,
      `edit-lesson-${lessonPlanId}`,
      'lesson'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  try {
    const updateLessonPlan = await dbClient.lessonPlan.update({
      where: { id: lessonPlanId },
      data: { name, description, objectives }
    })
    myEmitter.emit('update-lesson-plan', updateLessonPlan, req.user)
    return sendDataResponse(res, 201, updateLessonPlan)
  } catch (err) {
    const error = new ServerErrorEvent(
      req.user,
      `update-lesson-plan-${lessonPlanId}`
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

export const deleteLessonPlanById = async (req, res) => {
  const lessonPlanId = Number(req.params.lessonPlanId)

  const foundLesson = await dbClient.lessonPlan.findUnique({
    where: {
      id: lessonPlanId
    }
  })

  if (!foundLesson) {
    const notFound = new NotFoundEvent(
      req.user,
      `delete-lesson-plan-${lessonPlanId}`,
      'lesson'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  const deleteLessonPlan = await dbClient.lesson.delete({
    where: {
      id: lessonPlanId
    }
  })
  myEmitter.emit('delete-lesson-plan', deleteLessonPlan, req.user)
  return sendDataResponse(res, 201, { deleteLessonPlan })
}
