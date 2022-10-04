import dbClient from '../utils/dbClient.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { myEmitter } from '../eventEmitter/index.js'
import {
  BadRequestEvent,
  ConfictEvent,
  NotFoundEvent,
  ServerErrorEvent
} from '../eventEmitter/utils.js'

export const createExercise = async (req, res) => {
  const { name, gitHubUrl, readMeUrl, objectives } = req.body
  const missingFields = Object.values(req.body).some((v) => v === '')

  if (missingFields) {
    const badRequestError = new BadRequestEvent(
      req.user,
      'create-exercise',
      'Missing fields in request body'
    )
    myEmitter.emit('error', badRequestError)
    return sendMessageResponse(
      res,
      badRequestError.code,
      badRequestError.message
    )
  }

  const alreadyExists =
    (await dbClient.exercise.findFirst({ where: { name } })) !== null

  if (alreadyExists) {
    const conflictError = new ConfictEvent(req.user, 'create-exercise')
    myEmitter.emit('error', conflictError)
    return sendMessageResponse(res, conflictError.code, conflictError.message)
  }

  try {
    const createdExercise = await dbClient.exercise.create({
      data: { name, gitHubUrl, readMeUrl, objectives }
    })
    myEmitter.emit('create-exercise', { exercise: createdExercise }, req.user)
    return sendDataResponse(res, 201, { exercise: createdExercise })
  } catch (err) {
    const serverError = new ServerErrorEvent(
      req.user,
      `create-exercise-with-name-${name}`
    )
    myEmitter.emit('error', serverError)
    sendMessageResponse(res, serverError.code, serverError.message)
    throw err
  }
}

export const getAllExercises = async (req, res) => {
  try {
    const allExercises = await dbClient.exercise.findMany()
    return sendDataResponse(res, 201, { exercises: allExercises })
  } catch (err) {
    sendMessageResponse(res, 500, 'Unable to fetch exercises')
    throw err
  }
}

export const deleteExercise = async (req, res) => {
  const id = +req.params.id

  try {
    const deletedExercise = await dbClient.exercise.delete({ where: { id } })
    myEmitter.emit('delete-exercise', { exercise: deletedExercise }, req.user)
    return sendDataResponse(res, 201, { exercise: deletedExercise })
  } catch (err) {
    const notFound = new NotFoundEvent(
      req.user,
      `delete-exercise-${id}`,
      'exercise'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }
}

export const getExerciseById = async (req, res) => {
  const id = +req.params.id
  const selectedExercise = await dbClient.exercise.findUnique({ where: { id } })
  const notFound = selectedExercise === null

  if (notFound) {
    return sendMessageResponse(res, 404, 'Exercise with that id does not exist')
  }
  return sendDataResponse(res, 200, { exercise: selectedExercise })
}
