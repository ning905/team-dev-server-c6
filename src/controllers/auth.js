import User from '../domain/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRY, JWT_SECRET } from '../utils/config.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { myEmitter } from '../eventEmitter/index.js'
import { ServerErrorEvent } from '../eventEmitter/utils.js'

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return sendDataResponse(res, 400, {
      email: 'Invalid email and/or password provided'
    })
  }

  try {
    const foundUser = await User.findByEmail(email)
    const areCredentialsValid = await validateCredentials(password, foundUser)

    if (!areCredentialsValid) {
      return sendDataResponse(res, 400, {
        email: 'Invalid email and/or password provided'
      })
    }

    let userToLogin = foundUser
    if (foundUser.isActive === false) {
      userToLogin = await foundUser.update({ isActive: true })
      myEmitter.emit('update-account-activate', userToLogin)
    }

    const token = generateJwt(userToLogin.id)

    return sendDataResponse(res, 200, { token, ...userToLogin.toJSON() })
  } catch (e) {
    const error = new ServerErrorEvent(
      null,
      'login',
      'Unable to process request'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw e
  }
}

function generateJwt(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

async function validateCredentials(password, user) {
  if (!user) {
    return false
  }

  if (!password) {
    return false
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    return false
  }

  return true
}
