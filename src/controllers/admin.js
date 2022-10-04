import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import { myEmitter } from '../eventEmitter/index.js'
import {
  NoPermissionEvent,
  OtherErrorEvent,
  NotFoundEvent,
  DeactivatedUserEvent
} from '../eventEmitter/utils.js'

export const updateUserRoleById = async (req, res) => {
  const id = Number(req.params.id)
  const foundUserRole = req.user.role

  const foundUser = await dbClient.user.findUnique({
    where: { id }
  })
  const foundUserOldRole = foundUser.role

  if (!foundUser) {
    const notFound = new NotFoundEvent(
      req.user,
      `update-role-for-user-${id}`,
      'user'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  if (!foundUser.isActive) {
    const deactivated = new DeactivatedUserEvent(
      req.user,
      `update-role-for-user-${id}`
    )

    myEmitter.emit('error', deactivated)
    return sendMessageResponse(res, deactivated.code, deactivated.message)
  }

  if (foundUserRole === 'ADMIN') {
    try {
      const updateUser = await dbClient.user.update({
        where: {
          id: foundUser.id
        },
        data: {
          role: req.body.role
        }
      })
      myEmitter.emit('update-role', updateUser, foundUserOldRole, req.user)
      return sendDataResponse(res, 200, updateUser)
    } catch (err) {
      const error = new OtherErrorEvent(
        req.user,
        `update-role-for-user-${id}`,
        401,
        'no update done'
      )
      myEmitter.emit('error', error)
      return sendMessageResponse(res, error.code, error.message)
    }
  } else {
    const noPermission = new NoPermissionEvent(
      req.user,
      `update-role-for-user-${id}`,
      'You do not have permission to change this'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
  }
}
