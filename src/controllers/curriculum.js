import { sendDataResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const getAllCurriculums = async (req, res) => {
  const currs = await dbClient.curriculum.findMany()

  return sendDataResponse(res, 200, currs)
}
