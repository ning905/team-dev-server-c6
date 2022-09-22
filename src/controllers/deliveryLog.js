import {
  dbCreateLine,
  dbCreateLog,
  dbDeleteLineById,
  dbDeleteLogById
} from '../domain/deliveryLog.js'
import { sendDataResponse } from '../utils/responses.js'

export const createLog = async (req, res) => {
  const userId = req.user.id
  const { cohortId } = req.body
  const newLog = await dbCreateLog(userId, cohortId)

  return sendDataResponse(res, 201, {
    log: {
      id: newLog.id,
      cohortId,
      date: newLog.date,
      author: {
        id: userId,
        firstName: req.user.firstName,
        lastName: req.user.lastName
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
  console.log(newLine)

  return sendDataResponse(res, 201, { line: newLine })
}

export const deleteLineById = async (req, res) => {
  const id = Number(req.params.id)
  await dbDeleteLineById(id)

  return sendDataResponse(res, 200)
}
