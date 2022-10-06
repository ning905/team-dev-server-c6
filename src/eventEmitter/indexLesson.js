import { myEmitter } from './index.js'

import {
  createLessonCreatedEvent,
  createRenameLessonEvent,
  createDeleteLessonEvent
} from './utilsLesson.js'

export const myEmitterLesson = myEmitter

myEmitterLesson.on('create-lesson', (lesson, user) =>
  createLessonCreatedEvent(lesson, user)
)
myEmitterLesson.on('update-lesson', (lesson, user, oldName, oldDescription) =>
  createRenameLessonEvent(lesson, user, oldName, oldDescription)
)
myEmitterLesson.on('delete-lesson', (lesson, user) =>
  createDeleteLessonEvent(lesson, user)
)
