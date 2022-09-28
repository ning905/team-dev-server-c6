import dbClient from '../utils/dbClient'

export const createRegisterEvent = async (user, admin = null) => {
  let type = 'USER'
  if (user.role === 'ADMIN' || admin) {
    type = 'ADMIN'
  }
  await dbClient.event.create({
    data: {
      type: type,
      topic: 'register',
      content: user.role,
      receivedById: user.id,
      createdById: admin.id,
      createdAt: user.createdAt
    }
  })
}

export const createUpdateEmailEvent = async (user, oldEmail, admin = null) => {
  let type = 'USER'
  if (user.role === 'ADMIN' || admin) {
    type = 'ADMIN'
  }
  await dbClient.event.create({
    data: {
      type: type,
      topic: 'update-email-address',
      content: `from ${oldEmail} to ${user.email}`,
      createdById: admin.id,
      receivedById: user.id,
      createdAt: user.profile.updatedAt
    }
  })
}

export const createUpdatePrivacyEvent = async (user, admin = null) => {
  const topic = 'set-post-privacy-preference-to-' + user.profile.postPrivacyPref
  let type = 'USER'
  if (user.role === 'ADMIN' || admin) {
    type = 'ADMIN'
  }

  await dbClient.event.create({
    data: {
      type: type,
      topic: topic,
      createdById: admin.id,
      receivedById: user.id,
      createdAt: user.profile.updatedAt
    }
  })
}

export const createUpdateActivateEvent = async (user, admin = null) => {
  let type = 'USER'
  let topic = ''
  if (user.role === 'ADMIN' || admin) {
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
      createdById: admin.id,
      receivedById: user.id,
      createdAt: user.profile.updatedAt
    }
  })
}

export const createChangeRoleEvent = async (assignee, oldRole, assigner) => {
  dbClient.event.create({
    data: {
      type: 'ADMIN',
      topic: 'change-role',
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
