import dbClient from '../utils/dbClient.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const createExercise = async (req, res) => {
  const { name, gitHubUrl, objectives } = req.body
  const missingFields = Object.values(req.body).some((v) => v === '')
  const alreadyExists =
    (await dbClient.exercise.findFirst({ where: { name } })) !== null

  if (missingFields) {
    return sendMessageResponse(res, 400, 'Missing fields in request body')
  }
  if (alreadyExists) {
    return sendMessageResponse(
      res,
      409,
      'An exercise with the provided name already exists'
    )
  }

  const createdExercise = await dbClient.exercise.create({
    data: { name, gitHubUrl, objectives }
  })
  return sendDataResponse(res, 201, { exercise: createdExercise })
}

export const getAllExercises = async (req, res) => {
  const allExercises = await dbClient.exercise.findMany()
  return sendDataResponse(res, 200, { exercises: allExercises })
}

export const deleteExercise = async (req, res) => {
  const id = +req.params.id

  try {
    const deletedExercise = await dbClient.exercise.delete({ where: { id } })

    return sendDataResponse(res, 201, { exercise: deletedExercise })
  } catch (e) {
    return sendMessageResponse(res, 404, 'exercise not found')
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
