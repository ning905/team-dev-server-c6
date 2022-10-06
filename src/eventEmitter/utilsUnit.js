import dbClient from '../utils/dbClient.js'
import { myEmitter } from './index.js'
import { CreateEventError } from './utils.js'

// UNIT
export const createUnitCreatedEvent = async (unit, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `create-unit-${unit.name}`,
        createdById: user.id,
        createdAt: unit.createdAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'create-unit')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createRenameUnitEvent = async (
  unit,
  user,
  oldName,
  oldDescription
) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `update-unit-${unit.name} `,
        content: `from-name-${oldName}-to-${unit.name},-from-${oldDescription}-to-${unit.description}`,
        createdById: user.id,
        createdAt: unit.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'update-module')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createDeleteUnitEvent = async (unit, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `deleted-unit-${unit.name}`,
        createdById: user.id,
        createdAt: unit.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'delete-unit')
    myEmitter.emit('error', error)
    throw err
  }
}
