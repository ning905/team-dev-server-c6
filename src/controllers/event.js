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
