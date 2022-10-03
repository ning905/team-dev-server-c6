import {
  createCohort,
  getAllCohorts,
  getCohortById,
  updateCohortNameByID
} from '../domain/cohort.js'
import { myEmitter } from '../eventEmitter/index.js'
import { ServerErrorEvent } from '../eventEmitter/utils.js'
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
    const error = new ServerErrorEvent(
      req.user,
      'create-cohort',
      'Unable to create cohort'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw e
  }
}

export const getAll = async (req, res) => {
  try {
    const foundCohorts = await getAllCohorts()

    return sendDataResponse(res, 201, { cohorts: foundCohorts })
  } catch (e) {
    const error = new ServerErrorEvent(
      req.user,
      'fetch-cohorts',
      'Unable to fetch cohort'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
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
