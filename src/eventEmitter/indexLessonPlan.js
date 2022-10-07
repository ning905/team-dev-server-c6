import { myEmitter } from './index.js'

import {
  createLessonPlanCreatedEvent,
  createRenameLessonPlanEvent,
  createDeleteLessonPlanEvent
} from './utilsLessonPlan.js'

export const myEmitterLessonPlan = myEmitter

myEmitterLessonPlan.on('create-lesson-plan', (lessonPlan, user) =>
  createLessonPlanCreatedEvent(lessonPlan, user)
)
myEmitterLessonPlan.on(
  'update-lesson-plan',
  (lessonPlan, user, oldName, oldDescription) =>
    createRenameLessonPlanEvent(lessonPlan, user, oldName, oldDescription)
)
myEmitterLessonPlan.on('delete-lesson-plan', (lessonPlan, user) =>
  createDeleteLessonPlanEvent(lessonPlan, user)
)
