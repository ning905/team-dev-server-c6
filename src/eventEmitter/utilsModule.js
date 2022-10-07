import dbClient from '../utils/dbClient.js'
import { myEmitter } from './index.js'
import { CreateEventError } from './utils.js'

export const createModuleCreatedEvent = async (module, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `create-module-${module.name}`,
        createdById: user.id,
        createdAt: module.createdAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'create-module')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createRenameModuleEvent = async (
  module,
  user,
  oldName,
  oldDescription
) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `update-module${module.id} `,
        content: `from-name-${oldName}-to-${module.name},-from-${oldDescription}-to-${module.description}`,
        createdById: user.id,
        createdAt: module.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'update-module')
    myEmitter.emit('error', error)
    throw err
  }
}

export const createDeleteModuleEvent = async (module, user) => {
  try {
    await dbClient.event.create({
      data: {
        type: 'CURRICULUM',
        topic: `deleted-module-${module.name}`,
        createdById: user.id,
        createdAt: module.updatedAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'delete-module')
    myEmitter.emit('error', error)
    throw err
  }
}
