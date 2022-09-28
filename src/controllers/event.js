import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const getEvents = async (req, res) => {
  if (req.user.role !== 'DEVELOPER') {
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
}
