import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { JWT_SECRET } from '../utils/config.js'
import jwt from 'jsonwebtoken'
import User from '../domain/user.js'
import { myEmitter } from '../eventEmitter/index.js'
import { NoPermissionEvent, NoValidationEvent } from '../eventEmitter/utils.js'

export async function validateRole(req, res, next) {
  if (!req.user) {
    const error = new NoValidationEvent(
      'Unable to verify user',
      'perform-authorized-action'
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }

  if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
    const noPermission = new NoPermissionEvent(
      req.user,
      'perform-authorized-action'
    )
    myEmitter.emit('error', noPermission)
    return sendDataResponse(res, noPermission.code, {
      authorization: noPermission.message
    })
  }

  next()
}

export async function validateAdminRole(req, res, next) {
  if (!req.user) {
    const error = new NoValidationEvent(
      'Unable to verify user',
      'perform-admin-action'
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
  }

  if (req.user.role !== 'ADMIN') {
    const noPermission = new NoPermissionEvent(req.user, 'perform-admin-action')
    myEmitter.emit('error', noPermission)
    return sendDataResponse(res, noPermission.code, {
      authorization: noPermission.message
    })
  }
  next()
}

export async function validateAuthentication(req, res, next) {
  const header = req.header('authorization')

  if (!header) {
    const error = new NoValidationEvent('Missing Authorization header')
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, {
      authorization: error.message
    })
  }

  const [type, token] = header.split(' ')

  const isTypeValid = validateTokenType(type)
  if (!isTypeValid) {
    const error = new NoValidationEvent(
      `Invalid token type, expected Bearer but got ${type}`
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, {
      authorization: error.message
    })
  }

  const isTokenValid = validateToken(token)
  if (!isTokenValid) {
    const error = new NoValidationEvent('Missing access token')
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, {
      authorization: error.message
    })
  }
  if (isTokenValid.name === 'TokenExpiredError') {
    const error = new NoValidationEvent('Token has expired')
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, {
      authorization: error.message
    })
  }
  if (isTokenValid.name) {
    const error = new NoValidationEvent('Invalid access token')
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, {
      authorization: error.message
    })
  }

  const decodedToken = jwt.decode(token)

  const foundUser = await User.findById(decodedToken.userId)
  delete foundUser.passwordHash

  req.user = foundUser
  next()
}

function validateToken(token) {
  if (!token) {
    return false
  }

  return jwt.verify(token, JWT_SECRET, (error) => {
    if (error) {
      return error
    }

    return !error
  })
}

function validateTokenType(type) {
  if (!type) {
    return false
  }

  if (type.toUpperCase() !== 'BEARER') {
    return false
  }

  return true
}
