const EventEmitter = require('events')
const {
  createCohortCreatedEvent,
  createRegisterEvent,
  createUpdateEmailEvent,
  createUpdatePrivacyEvent,
  createUpdateActivateEvent,
  createChangeRoleEvent,
  createRenameCohortEvent,
  createDeleteCohortEvent,
  createAddToCohortEvent,
  createRemoveFromCohortEvent
} = require('./utils')

class MyEventEmitter extends EventEmitter {}
const myEmitter = new MyEventEmitter()

myEmitter.on('register', (user, admin = null) =>
  createRegisterEvent(user, (admin = null))
)
myEmitter.on('update-email', (user, oldEmail, admin = null) =>
  createUpdateEmailEvent(user, oldEmail, (admin = null))
)
myEmitter.on('update-privacy', (user, admin = null) =>
  createUpdatePrivacyEvent(user, (admin = null))
)
myEmitter.on('update-account-activate', (user, admin = null) =>
  createUpdateActivateEvent(user, (admin = null))
)
myEmitter.on('change-role', (assignee, oldRole, assigner) =>
  createChangeRoleEvent(assignee, oldRole, assigner)
)

myEmitter.on('create-cohort', (cohort, admin) =>
  createCohortCreatedEvent(cohort, admin)
)
myEmitter.on('rename-cohort', (cohort, oldName, admin) =>
  createRenameCohortEvent(cohort, oldName, admin)
)
myEmitter.on('delete-cohort', (cohort, admin) =>
  createDeleteCohortEvent(cohort, admin)
)
myEmitter.on('add-to-cohort', (admin, student, cohort) =>
  createAddToCohortEvent(admin, student, cohort)
)
myEmitter.on('add-to-cohort', (admin, student, cohort) =>
  createRemoveFromCohortEvent(admin, student, cohort)
)

myEmitter.on('error')
