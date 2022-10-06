import dbClient from '../utils/dbClient.js'
import { myEmitter } from './index.js'
import { CreateEventError } from './utils.js'

export const createCurriculumCreatedEvent = async (curriculum, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `create-curriculum-${curriculum.name}`,
        createdById: user.id,
        createdAt: curriculum.createdAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'create-curriculum')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createRenameCurriculumEvent = async (
  curriculum,
  user,
  oldName,
  oldDescription
) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `update-curriculum-${curriculum.name}`,
        content: `from-name-${oldName}-to-${curriculum.name},-from-${oldDescription}-to-${curriculum.description}`,
        createdById: user.id,
        createdAt: curriculum.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'rename-curriculum')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createDeleteCurriculumEvent = async (curriculum, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `deleted-curriculum-${curriculum.name}`,
        createdById: user.id,
        createdAt: curriculum.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'delete-curriculum')
    myEmitter.emit('error', error)
    throw err
  }
}
