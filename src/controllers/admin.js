import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import { myEmitter } from '../eventEmitter/index.js'

export const updateUserRoleById = async (req, res) => {
  const id = Number(req.params.id)
  const loggedInUserRole = req.user.role
  const loggedInUserId = req.user.id

  const foundUser = await dbClient.user.findUnique({
    where: { id }
  })
  const foundUserOldRole = foundUser.role

  if (!foundUser) {
    myEmitter.emit(
      'error',
      req.user,
      `update-role-for-user-${id}`,
      404,
      'User not found'
    )
    return sendMessageResponse(res, 404, 'User not found')
  }

  if (foundUser.id === loggedInUserId) {
    myEmitter.emit(
      'error',
      req.user,
      `update-role-for-user-${id}`,
      500,
      'Logged in Admin cannot change his own role'
    )
    return sendMessageResponse(
      res,
      500,
      'Logged in Admin cannot change his own role'
    )
  }

  if (loggedInUserRole === 'ADMIN') {
    try {
      const updateUserRole = await dbClient.user.update({
        where: {
          id: foundUser.id
        },
        data: {
          role: req.body.role
        }
      })
      myEmitter.emit('update-role', foundUser, foundUserOldRole, req.user)
      return sendDataResponse(res, 200, updateUserRole)
    } catch (err) {
      myEmitter.emit(
        'error',
        req.user,
        `update-role-for-user-${id}`,
        404,
        'unable to perform role update'
      )
      return sendMessageResponse(res, 404, 'unable to perform role update')
    }
  } else {
    myEmitter.emit(
      'error',
      req.user,
      `update-role-for-user-${id}`,
      401,
      'You do not have permission to change this'
    )
    return sendMessageResponse(
      res,
      401,
      'You do not have permission to change this'
    )
  }
}
