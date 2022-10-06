import dbClient from '../utils/dbClient.js'
import { myEmitter } from './index.js'
import { CreateEventError } from './utils.js'

export const createLessonCreatedEvent = async (lesson, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `create-${lesson.name}`,
        createdById: user.id,
        createdAt: lesson.createdAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'create-lesson')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createRenameLessonEvent = async (
  lesson,
  user,
  oldName,
  oldDescription
) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `update-lesson-${lesson.name} `,
        content: `from-name-${oldName}-to-${lesson.name},-from-${oldDescription}-to-${lesson.description}`,
        createdById: user.id,
        createdAt: lesson.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'update-lesson')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createDeleteLessonEvent = async (lesson, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `deleted-${lesson.name}`,
        createdById: user.id,
        createdAt: lesson.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'delete-lesson')
    myEmitter.emit('error', error)
    throw err
  }
}
