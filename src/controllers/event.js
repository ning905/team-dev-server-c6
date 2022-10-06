import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import { myEmitter } from '../eventEmitter/index.js'
import { NoPermissionEvent, ServerErrorEvent } from '../eventEmitter/utils.js'

export const getEvents = async (req, res) => {
  if (req.user.role !== 'DEVELOPER') {
    const noPermission = new NoPermissionEvent(
      req.user,
      'fetch-events',
      'Only developers can view event records'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
  }

  let sorting = 'desc'
  if (req.query.sorting) {
    sorting = req.query.sorting
  }

  const query = {
    orderBy: {
      createdAt: sorting
    }
  }

  if (req.query.content) {
    query.where = { ...query.where }
    query.where.content = {
      contains: req.query.content,
      mode: 'insensitive'
    }
  }

  if (req.query.type && Array.isArray(req.query.type)) {
    const types = []

    req.query.type.map((type) => {
      return types.push({ type: type })
    })

    query.where = {
      ...query.where,
      OR: types
    }
  } else if (req.query.type) {
    query.where = { ...query.where }
    query.where.type = req.query.type
  }

  try {
    const events = await dbClient.event.findMany(query)
    sendDataResponse(res, 200, events)
  } catch (err) {
    const error = new ServerErrorEvent(
      req.user,
      'fetch-events',
      'Unable to fetch cohort'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}
