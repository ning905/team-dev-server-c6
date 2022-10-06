import { myEmitter } from './index.js'

import {
  createUnitCreatedEvent,
  createRenameUnitEvent,
  createDeleteUnitEvent
} from './utilsUnit.js'

export const myEmitterUnit = myEmitter

myEmitterUnit.on('create-unit', (unit, user) =>
  createUnitCreatedEvent(unit, user)
)

myEmitterUnit.on('update-unit', (unit, user, oldName, oldDescription) =>
  createRenameUnitEvent(unit, user, oldName, oldDescription)
)
myEmitterUnit.on('delete-unit', (unit, user) =>
  createDeleteUnitEvent(unit, user)
)
