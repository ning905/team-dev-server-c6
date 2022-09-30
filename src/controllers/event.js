import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import { myEmitter } from '../eventEmitter/index.js'

export const getEvents = async (req, res) => {
  if (req.user.role !== 'DEVELOPER') {
    myEmitter.emit(
      'error',
      req.user,
      'fetch-events',
      403,
      'Only developers can view event records'
    )
    return sendMessageResponse(
      res,
      403,
      'Only developers can view event records'
    )
  }

  let sorting = 'desc'
  if (req.query.sorting) {
    sorting = req.query.sorting
  }

  try {
    const events = await dbClient.event.findMany({
      where: {
        type: req.query.type,
        content: req.query.content
      },
      orderBy: {
        createdAt: sorting
      }
    })
    sendDataResponse(res, 200, events)
  } catch (err) {
    myEmitter.emit(
      'error',
      req.user,
      'fetch-cohorts',
      500,
      'Unable to fetch events'
    )
    sendMessageResponse(res, 500, 'Unable to fetch events')
  }
}
