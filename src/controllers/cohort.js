import { createCohort, getAllCohorts, getCohortById } from '../domain/cohort.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  try {
    const createdCohort = await createCohort(req.body.name)
    return sendDataResponse(res, 201, createdCohort)
  } catch (e) {
    sendMessageResponse(res, 500, 'Unable to create cohort')
    throw e
  }
}

export const getAll = async (req, res) => {
  try {
    const foundCohorts = await getAllCohorts()

    return sendDataResponse(res, 201, { cohorts: foundCohorts })
  } catch (e) {
    sendMessageResponse(res, 500, 'Unable to fetch Cohorts')
  }
}

export const getById = async (req, res) => {
  const Id = parseInt(req.params.id)
  const foundCohort = await getCohortById(Id)
  return sendDataResponse(res, 200, { foundCohort })
}
