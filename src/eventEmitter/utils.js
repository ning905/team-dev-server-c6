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
      createdAt: user.profile.updatedAt
    }
  })
}

export const createUpdatePrivacyEvent = async (user, oldPref) => {
  const topic = 'set-post-privacy-preference-to-' + user.profile.postPrivacyPref
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
      createdAt: user.profile.updatedAt
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
      createdAt: user.profile.updatedAt
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

export const createErrorEvent = async (user, topic, errorCode, errorMsg) => {
  await dbClient.event.create({
    data: {
      type: 'ERROR',
      topic: topic,
      content: `${errorCode} ${errorMsg}`,
      receivedById: user.id
    }
  })
}
