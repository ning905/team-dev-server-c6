import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const updateUserRoleById = async (req, res) => {
  const id = Number(req.params.id)
  const foundUserRole = req.user.role

  const foundUser = await dbClient.user.findUnique({
    where: { id }
  })

  if (!foundUser) {
    return sendMessageResponse(res, 404, 'User not found')
  }

  if (foundUserRole === 'ADMIN') {
    try {
      const updateUserRole = await dbClient.user.update({
        where: {
          id: foundUser.id
        },
        data: {
          role: req.body.role
        }
      })
      return sendDataResponse(res, 200, updateUserRole)
    } catch (err) {
      return sendMessageResponse(res, 401, 'no update done')
    }
  }
}
