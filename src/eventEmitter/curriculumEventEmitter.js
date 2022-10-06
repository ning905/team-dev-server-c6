import dbClient from '../utils/dbClient.js'
import { myEmitter } from './index.js'

export const createRegisterEvent = async (user) => {
  let type = 'USER'
  if (user.role === 'ADMIN') {
    type = 'ADMIN'
  }

  try {
    await dbClient.event.create({
      data: {
        type: type,
        topic: 'register',
        content: user.role,
        receivedById: user.id,
        createdAt: user.createdAt
      }
    })
  } catch (err) {
    const error = new CreateEventError(user, 'register')
    myEmitter.emit('error', error)
    throw err
  }
}

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

export const createErrorEvent = async (errorEvent) => {
  let userId
  if (errorEvent.user) {
    userId = errorEvent.user.id
  }

  await dbClient.event.create({
    data: {
      type: 'ERROR',
      topic: errorEvent.topic,
      content: `${errorEvent.code} ${errorEvent.message}`,
      receivedById: userId
    }
  })
}

class ErrorEventBase {
  constructor(user, topic) {
    this.user = user
    this.topic = topic
  }
}

export class BadRequestEvent extends ErrorEventBase {
  constructor(user, topic, message = 'Incorrect request syntax') {
    super(user, topic)
    this.code = 400
    this.message = message
  }
}

export class NoValidationEvent {
  constructor(
    message = 'Unable to verify user',
    topic = 'validate-authentication'
  ) {
    this.user = null
    this.topic = topic
    this.code = 401
    this.message = message
  }
}

export class NoPermissionEvent extends ErrorEventBase {
  constructor(
    user,
    topic,
    message = 'You are not authorized to perform this action'
  ) {
    super(user, topic)
    this.code = 403
    this.message = message
  }
}

export class NotFoundEvent extends ErrorEventBase {
  constructor(user, topic, target) {
    super(user, topic)
    this.code = 404
    this.message = `The ${target} with the provided id does not exist`
  }
}

export class ConfictEvent extends ErrorEventBase {
  constructor(user, topic, message = 'Request conflicts with data on server') {
    super(user, topic)
    this.code = 409
    this.message = message
  }
}

export class DeactivatedUserEvent extends ErrorEventBase {
  constructor(user, topic) {
    super(user, topic)
    this.code = 400
    this.message = 'The target user account has been deactivated'
  }
}

export class ServerErrorEvent extends ErrorEventBase {
  constructor(user, topic, message = 'Internal Server Error') {
    super(user, topic)
    this.code = 500
    this.message = message
  }
}

class CreateEventError extends ServerErrorEvent {
  constructor(user, topic, message = 'Failed to create an event') {
    super(user, topic, message)
  }
}

export class OtherErrorEvent extends ErrorEventBase {
  constructor(user, topic, code, message) {
    super(user, topic)
    this.code = code
    this.message = message
  }
}

myEmitter.on('create-curriculum', (curriculum, user) =>
  createCurriculumCreatedEvent(curriculum, user)
)
myEmitter.on('update-curriculum', (curriculum, user, oldName, oldDescription) =>
  createRenameCurriculumEvent(curriculum, user, oldName, oldDescription)
)
myEmitter.on('delete-curriculum', (curriculum, user) =>
  createDeleteCurriculumEvent(curriculum, user)
)
