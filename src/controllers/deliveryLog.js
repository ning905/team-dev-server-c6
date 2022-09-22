import {
  dbCreateLine,
  dbCreateLog,
  dbDeleteLineById,
  dbDeleteLogById
} from '../domain/deliveryLog.js'
import { sendDataResponse } from '../utils/responses.js'

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
