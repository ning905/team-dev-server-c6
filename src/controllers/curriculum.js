import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import { ServerErrorEvent } from '../eventEmitter/utils.js'
import { myEmitter } from '../eventEmitter/index.js'

export const getAllCurriculums = async (req, res) => {
  try {
    const currs = await dbClient.curriculum.findMany()

    return sendDataResponse(res, 200, currs)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, 'fetch-all-curriculums')
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }
}
