import { myEmitter } from './index.js'

import {
  createModuleCreatedEvent,
  createRenameModuleEvent,
  createDeleteModuleEvent
} from './utilsModule.js'

export const myEmitterModule = myEmitter

myEmitterModule.on('create-module', (module, user) =>
  createModuleCreatedEvent(module, user)
)
myEmitterModule.on('update-module', (module, user, oldName, oldDescription) =>
  createRenameModuleEvent(module, user, oldName, oldDescription)
)
myEmitterModule.on('delete-module', (module, user) =>
  createDeleteModuleEvent(module, user)
)
