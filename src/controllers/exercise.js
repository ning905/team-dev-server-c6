import dbClient from '../utils/dbClient.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { myEmitter } from '../eventEmitter/index.js'

export const createExercise = async (req, res) => {
  const { name, gitHubUrl, objectives } = req.body
  const missingFields = Object.values(req.body).some((v) => v === '')

  if (missingFields) {
    myEmitter.emit(
      'error',
      req.user,
      `create-exercise`,
      400,
      'Missing fields in request body'
    )
    return sendMessageResponse(res, 400, 'Missing fields in request body')
  }

  const alreadyExists =
    (await dbClient.exercise.findFirst({ where: { name } })) !== null

  if (alreadyExists) {
    myEmitter.emit(
      'error',
      req.user,
      `find-exercise-by-name-${name}`,
      409,
      'An exercise with the provided name already exists'
    )
    return sendMessageResponse(
      res,
      409,
      'An exercise with the provided name already exists'
    )
  }

  try {
    const createdExercise = await dbClient.exercise.create({
      data: { name, gitHubUrl, objectives }
    })
    myEmitter.emit('create-exercise', { exercise: createdExercise }, req.user)
    return sendDataResponse(res, 201, { exercise: createdExercise })
  } catch (err) {
    myEmitter.emit(
      'error',
      req.user,
      `create-exercise-with-name-${name}`,
      500,
      'Unable to create exercise'
    )
    sendMessageResponse(res, 500, 'Unable to create exercise')
    throw err
  }
}

export const getAllExercises = async (req, res) => {
  try {
    const allExercises = await dbClient.exercise.findMany()
    myEmitter.emit('fetch-exercises', { exercises: allExercises }, req.user)
    return sendDataResponse(res, 201, { exercises: allExercises })
  } catch (err) {
    myEmitter.emit(
      'error',
      req.user,
      'fetch-exercises',
      500,
      'Unable to fetch exercises'
    )
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
    myEmitter.emit(
      'error',
      req.user,
      `delete-exercise-${id}`,
      404,
      'Unable to delete exercise'
    )
    return sendMessageResponse(res, 404, 'Unable to delete exercise')
  }
}

export const getExerciseById = async (req, res) => {
  const id = +req.params.id
  const selectedExercise = await dbClient.exercise.findUnique({ where: { id } })
  const notFound = selectedExercise === null
  console.log('User', req.user)

  if (notFound) {
    myEmitter.emit(
      'error',
      req.user,
      `get-exercise-by-Id-${id}`,
      404,
      'Exercise with that id does not exist'
    )
    return sendMessageResponse(res, 404, 'Exercise with that id does not exist')
  }
  myEmitter.emit('get-exercise-by-Id', { exercise: selectedExercise }, req.user)
  return sendDataResponse(res, 200, { exercise: selectedExercise })
}
