import dbClient from '../utils/dbClient.js'

export const createRegisterEvent = async (user) => {
  let type = 'USER'
  if (user.role === 'ADMIN') {
    type = 'ADMIN'
  }
  await dbClient.event.create({
    data: {
      type: type,
      topic: 'register',
      content: user.role,
      receivedById: user.id,
      createdAt: user.createdAt
    }
  })
}

export const createUpdateEmailEvent = async (user, oldEmail) => {
  let type = 'USER'
  if (user.role === 'ADMIN') {
    type = 'ADMIN'
  }
  await dbClient.event.create({
    data: {
      type: type,
      topic: 'update-email-address',
      content: `from ${oldEmail} to ${user.email}`,
      receivedById: user.id,
      createdAt: user.updatedAt
    }
  })
}

export const createUpdatePrivacyEvent = async (user, oldPref) => {
  const topic = 'set-post-privacy-preference-to-' + user.postPrivacyPref
  let type = 'USER'
  if (user.role === 'ADMIN') {
    type = 'ADMIN'
  }

  await dbClient.event.create({
    data: {
      type: type,
      topic: topic,
      content: oldPref,
      receivedById: user.id,
      createdAt: user.updatedAt
    }
  })
}

export const createUpdateActivateEvent = async (user) => {
  let type = 'USER'
  let topic = ''
  if (user.role === 'ADMIN') {
    type = 'ADMIN'
  }
  if (user.isActivate) {
    topic = 'activate-account'
  } else {
    topic = 'deactivate-account'
  }

  await dbClient.event.create({
    data: {
      type: type,
      topic: topic,
      receivedById: user.id,
      createdAt: user.updatedAt
    }
  })
}

export const createUpdateRoleEvent = async (assignee, oldRole, assigner) => {
  dbClient.event.create({
    data: {
      type: 'ADMIN',
      topic: 'update-role',
      content: `from ${oldRole} to ${assignee.role}`,
      createdById: assigner.id,
      receivedById: assignee.id,
      createdAt: assignee.updatedAt
    }
  })
}

export const createCohortCreatedEvent = async (cohort, admin) => {
  await dbClient.event.create({
    data: {
      type: 'COHORT',
      topic: 'create',
      createdById: admin.id,
      cohortId: cohort.id,
      createdAt: cohort.createdAt
    }
  })
}

export const createRenameCohortEvent = async (cohort, oldName, admin) => {
  await dbClient.event.create({
    data: {
      type: 'COHORT',
      topic: 'rename',
      content: `from ${oldName} to ${cohort.name}`,
      createdById: admin.id,
      cohortId: cohort.id,
      createdAt: cohort.updatedAt
    }
  })
}

export const createDeleteCohortEvent = async (cohort, admin) => {
  await dbClient.event.create({
    data: {
      type: 'COHORT',
      topic: 'delete',
      createdById: admin.id,
      cohortId: cohort.id,
      createdAt: cohort.updatedAt
    }
  })
}

export const createAddToCohortEvent = async (admin, student, cohort) => {
  await dbClient.event.create({
    data: {
      type: 'COHORT',
      topic: 'add-to-cohort',
      receivedById: student.id,
      createdById: admin.id,
      cohortId: cohort.id,
      createdAt: cohort.updatedAt
    }
  })
}

export const createRemoveFromCohortEvent = async (admin, student, cohort) => {
  await dbClient.event.create({
    data: {
      type: 'COHORT',
      topic: 'remove-from-cohort',
      receivedById: student.id,
      createdById: admin.id,
      cohortId: cohort.id,
      createdAt: cohort.updatedAt
    }
  })
}

export const createErrorEvent = async (errorEvent) => {
  await dbClient.event.create({
    data: {
      type: 'ERROR',
      topic: errorEvent.topic,
      content: `${errorEvent.code} ${errorEvent.message}`,
      receivedById: errorEvent.user.id
    }
  })
}

class ErrorEventBase {
  constructor(user, topic) {
    this.user = user
    this.topic = topic
  }
}

export class NoValidationEvent extends ErrorEventBase {
  constructor(user, topic, message = 'Unable to verify user') {
    super(user, topic)
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

export class ServerErrorEvent extends ErrorEventBase {
  constructor(user, topic, message = 'Internal Server Error') {
    super(user, topic)
    this.code = 500
    this.message = message
  }
}

export class OtherErrorEvent extends ErrorEventBase {
  constructor(user, topic, code, message) {
    super(user, topic)
    this.code = code
    this.message = message
  }
}
