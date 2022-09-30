import {
  createCohort,
  getAllCohorts,
  getCohortById,
  updateCohortNameByID
} from '../domain/cohort.js'
import { myEmitter } from '../eventEmitter/index.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    if (!req.body.name) {
      return sendDataResponse(res, 400, 'missing cohort name')
    }
    const createdCohort = await createCohort(req.body.name)
    myEmitter.emit('create-cohort', createdCohort, req.user)

    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    myEmitter.emit(
      'error',
      req.user,
      'create-cohort',
      500,
      'Unable to create cohort'
    )
    sendMessageResponse(res, 500, 'Unable to create cohort')
    throw e
  }
}

export const getAll = async (req, res) => {
  try {
    const foundCohorts = await getAllCohorts()

    return sendDataResponse(res, 201, { cohorts: foundCohorts })
  } catch (e) {
    myEmitter.emit(
      'error',
      req.user,
      'fetch-cohorts',
      500,
      'Unable to fetch Cohorts'
    )
    sendMessageResponse(res, 500, 'Unable to fetch Cohorts')
  }
}

export const getById = async (req, res) => {
  const Id = parseInt(req.params.id)
  const foundCohort = await getCohortById(Id)
  return sendDataResponse(res, 200, { cohort: foundCohort })
}

export const updateCohortName = async (req, res) => {
  const id = parseInt(req.params.id)
  const newName = req.body.name
  const updatedCohort = await updateCohortNameByID(id, newName)
  return sendMessageResponse(res, 201, { cohort: updatedCohort })
}
