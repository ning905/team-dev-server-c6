import { myEmitter } from './index.js'

import {
  createCurriculumCreatedEvent,
  createRenameCurriculumEvent,
  createDeleteCurriculumEvent
} from './utilsCurriculum.js'

export const myEmitterCurriculum = myEmitter

myEmitterCurriculum.on('create-curriculum', (curriculum, user) =>
  createCurriculumCreatedEvent(curriculum, user)
)
myEmitterCurriculum.on(
  'update-curriculum',
  (curriculum, user, oldName, oldDescription) =>
    createRenameCurriculumEvent(curriculum, user, oldName, oldDescription)
)
myEmitterCurriculum.on('delete-curriculum', (curriculum, user) =>
  createDeleteCurriculumEvent(curriculum, user)
)
