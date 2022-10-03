import {
  dbCreateLine,
  dbCreateLog,
  dbDeleteLineById,
  dbDeleteLogById
} from '../domain/deliveryLog.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

import dbClient from '../utils/dbClient.js'

export const createLog = async (req, res) => {
  const userId = parseInt(req.user.id)
  const cohortId = parseInt(req.body.cohortId)
  const newLog = await dbCreateLog(userId, cohortId)

  return sendDataResponse(res, 201, {
    log: {
      id: newLog.id,
      cohortId,
      date: newLog.date,
      user: {
        profile: {
          id: userId,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          profileImageUrl: req.user.profileImageUrl
        }
      },
      lines: newLog.lines
    }
  })
}

export const deleteLogById = async (req, res) => {
  const id = Number(req.params.id)
  await dbDeleteLogById(id)

  return sendDataResponse(res, 200)
}

export const createLine = async (req, res) => {
  const { content } = req.body
  const logId = parseInt(req.body.logId)

  const newLine = await dbCreateLine(logId, content)

  return sendDataResponse(res, 201, { line: newLine })
}

export const deleteLineById = async (req, res) => {
  const id = Number(req.params.id)
  await dbDeleteLineById(id)

  return sendDataResponse(res, 200)
}

export const updateLogById = async (req, res) => {
  const id = +req.params.id
  const reqEx = req.body.exerciseId
  const selectedLog = await dbClient.deliveryLog.findUnique({ where: { id } })
  const notFound = selectedLog === null

  if (reqEx === '') {
    return sendMessageResponse(res, 400, 'Missing fields in request body')
  }

  if (notFound) {
    return sendMessageResponse(res, 404, 'Log with that id does not exist')
  }

  const updatedLog = await dbClient.deliveryLog.update({
    where: { id },
    data: { exerciseId: +reqEx }
  })
  sendDataResponse(res, 201, { log: updatedLog })
}

export const getAllLogs = async (req, res) => {
  const exerciseId = +req.query.exerciseId
  let logs
  if (!isNaN(exerciseId)) {
    logs = await dbClient.deliveryLog.findMany({
      where: { exerciseId }
    })
  } else {
    logs = await dbClient.deliveryLog.findMany()
  }
  sendDataResponse(res, 200, { logs })
}
