import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { JWT_SECRET } from '../utils/config.js'
import jwt from 'jsonwebtoken'
import User from '../domain/user.js'
import { myEmitter } from '../eventEmitter/index.js'

export async function validateRole(req, res, next) {
  if (!req.user) {
    myEmitter.emit(
      'error',
      null,
      'perform-authorized-action',
      401,
      'Unable to verify user'
    )
    return sendMessageResponse(res, 401, 'Unable to verify user')
  }

  if (req.user.role !== 'TEACHER' && req.user.role !== 'ADMIN') {
    myEmitter.emit(
      'error',
      req.user,
      'perform-authorized-action',
      403,
      'You are not authorized to perform this action'
    )
    return sendDataResponse(res, 403, {
      authorization: 'You are not authorized to perform this action'
    })
  }

  next()
}

export async function validateAdminRole(req, res, next) {
  if (!req.user) {
    myEmitter.emit(
      'error',
      null,
      'perform-admin-action',
      401,
      'Unable to verify user'
    )
    return sendMessageResponse(res, 401, 'Unable to verify user')
  }

  if (req.user.role !== 'ADMIN') {
    myEmitter.emit(
      'error',
      req.user,
      'perform-admin-action',
      403,
      'You are not authorized to perform this action'
    )
    return sendDataResponse(res, 403, {
      authorization: 'You are not authorized to perform this action'
    })
  }
  next()
}

export async function validateAuthentication(req, res, next) {
  const header = req.header('authorization')

  if (!header) {
    myEmitter.emit(
      'error',
      null,
      'validate-authentication',
      401,
      'Missing Authorization header'
    )
    return sendDataResponse(res, 401, {
      authorization: 'Missing Authorization header'
    })
  }

  const [type, token] = header.split(' ')

  const isTypeValid = validateTokenType(type)
  if (!isTypeValid) {
    myEmitter.emit(
      'error',
      null,
      'validate-authentication',
      401,
      `Invalid token type, expected Bearer but got ${type}`
    )
    return sendDataResponse(res, 401, {
      authentication: `Invalid token type, expected Bearer but got ${type}`
    })
  }

  const isTokenValid = validateToken(token)
  if (!isTokenValid) {
    myEmitter.emit(
      'error',
      null,
      'validate-authentication',
      401,
      'Missing access token'
    )
    return sendDataResponse(res, 401, {
      authentication: 'Missing access token'
    })
  }
  if (isTokenValid.name === 'TokenExpiredError') {
    myEmitter.emit(
      'error',
      null,
      'validate-authentication',
      401,
      'Token has expired'
    )
    return sendDataResponse(res, 401, {
      authentication: 'Token has expired'
    })
  }
  if (isTokenValid.name) {
    myEmitter.emit(
      'error',
      null,
      'validate-authentication',
      401,
      'Invalid access token'
    )
    return sendDataResponse(res, 401, {
      authentication: 'Invalid access token'
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
