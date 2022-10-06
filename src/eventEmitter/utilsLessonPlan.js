import dbClient from '../utils/dbClient.js'
import { myEmitter } from './index.js'
import { CreateEventError } from './utils.js'

export const createLessonPlanCreatedEvent = async (lessonPlan, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `create-lesson-plan-${lessonPlan.name}`,
        createdById: user.id,
        createdAt: lessonPlan.createdAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'create-lesson-plan')
    myEmitter.emit('error', error)
    throw err
  }
}
export const createRenameLessonPlanEvent = async (
  lessonPlan,
  user,
  oldName,
  oldDescription
) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `update-lesson-plan-${lessonPlan.name} `,
        content: `from-name-${oldName}-to-${lessonPlan.name},-from-${oldDescription}-to-${lessonPlan.description}`,
        createdById: user.id,
        createdAt: lessonPlan.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'update-lesson-plan')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createDeleteLessonPlanEvent = async (lessonPlan, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `deleted-${lessonPlan.name}`,
        createdById: user.id,
        createdAt: lessonPlan.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'delete-lesson-plan')
    myEmitter.emit('error', error)
    throw err
  }
}
