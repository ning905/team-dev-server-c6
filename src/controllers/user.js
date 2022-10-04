import User from '../domain/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRY, JWT_SECRET } from '../utils/config.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { myEmitter } from '../eventEmitter/index.js'
import {
  DeactivatedUserEvent,
  NoPermissionEvent,
  NotFoundEvent,
  ServerErrorEvent
} from '../eventEmitter/utils.js'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    const createdUser = await userToCreate.save()

    const token = generateJwt(createdUser.id)

    myEmitter.emit('register', createdUser)
    return sendDataResponse(res, 201, { token, createdUser })
  } catch (err) {
    // Send an error response back to the client then let the error handling middleware log to the terminal
    const error = new ServerErrorEvent(
      null,
      'register',
      'Unable to create new user'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw err
  }
}

function generateJwt(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      const notFound = new NotFoundEvent(req.user, `fetch-user-${id}`, 'user')
      myEmitter.emit('error', notFound)
      return sendMessageResponse(res, notFound.code, { id: notFound.message })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    const error = new ServerErrorEvent(
      req.user,
      `fetch-user-${id}`,
      'Unable to get user'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
    throw e
  }
}

export const getAll = async (req, res) => {
  if (req.query.cohort_id) {
    return getAllByCohortId(req, res)
  } else {
    return getAllByFirstName(req, res)
  }
}

export const getAllByFirstName = async (req, res) => {
  // eslint-disable-next-line camelcase
  const [firstName] = Object.values(req.query)

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const getAllByCohortId = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { cohort_id: cohortId } = req.query

  const cohortIdNumber = Number(cohortId)

  let foundUsers

  if (cohortIdNumber) {
    foundUsers = await User.findManyByCohortId(cohortIdNumber)
  } else {
    foundUsers = await User.findAll()
  }

  if (req.user.role === 'STUDENT') {
    foundUsers = foundUsers.filter((user) => user.isActive)
  }
  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateUserCohortById = async (req, res) => {
  const cohortId = parseInt(req.body.cohort_id)
  const id = parseInt(req.params.id)

  if (!cohortId) {
    return sendDataResponse(res, 400, { cohort_id: 'Cohort ID is required' })
  }

  const foundUser = await User.findById(id)

  if (!foundUser) {
    const notFound = new NotFoundEvent(
      req.user,
      `add-user-${id}to-cohort${cohortId}`,
      'user'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, { id: notFound.message })
  }

  if (!foundUser.isActive) {
    const deactivated = new DeactivatedUserEvent(
      req.user,
      `add-user-${id}to-cohort${cohortId}`
    )

    myEmitter.emit('error', deactivated)
    return sendMessageResponse(res, deactivated.code, deactivated.message)
  }

  const updatedUser = await foundUser.update({ cohortId })
  myEmitter.emit('add-to-cohort', req.user, updatedUser)

  return sendDataResponse(res, 201, {
    user: { cohort_id: updatedUser.cohortId }
  })
}

export const updateUserById = async (req, res) => {
  const id = parseInt(req.params.id)
  const foundUser = await User.findById(id)

  if (!foundUser) {
    const notFound = new NotFoundEvent(req.user, `update-user-${id}`, 'user')
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, { id: notFound.message })
  }

  if (foundUser.id !== req.user.id) {
    const noPermission = new NoPermissionEvent(req.user, `update-user-${id}`)
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, {
      id: noPermission.message
    })
  }

  const oldEmail = foundUser.email

  const {
    email,
    firstName,
    lastName,
    bio,
    githubUrl,
    profileImageUrl,
    isActive
  } = req.body

  if (!foundUser.isActive && !isActive) {
    const deactivated = new DeactivatedUserEvent(req.user, `update-user-${id}`)

    myEmitter.emit('error', deactivated)
    return sendMessageResponse(res, deactivated.code, deactivated.message)
  }

  const unhashedPassword = req.body.password
  let password = ''
  if (unhashedPassword) {
    password = await bcrypt.hash(unhashedPassword, 8)
  }

  if (email) {
    const foundUserByEmail = await User.findByEmail(email)

    if (foundUserByEmail) {
      return sendDataResponse(res, 400, {
        id: 'A user with this email already exists'
      })
    }
  }

  if (foundUser.email === email) {
    return sendDataResponse(res, 400, {
      id: 'New email is the same as current'
    })
  } else {
    const updateUser = await foundUser.update({
      email,
      password,
      firstName,
      lastName,
      bio,
      githubUrl,
      profileImageUrl,
      isActive
    })

    if (email) {
      myEmitter.emit('update-email', updateUser, oldEmail)
    }
    if (isActive) {
      myEmitter.emit('update-account-activate', updateUser)
    }

    return sendDataResponse(res, 201, updateUser)
  }
}

export const updateUserPrivacy = async (req, res) => {
  const id = parseInt(req.params.id)
  const foundUser = await User.findById(id)

  if (!foundUser) {
    const notFound = new NotFoundEvent(
      req.user,
      `update-user-${id}-privacy`,
      'user'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, { id: notFound.message })
  }

  if (
    req.user.id !== foundUser.id &&
    req.user.role !== 'TEACHER' &&
    req.user.role !== 'ADMIN'
  ) {
    const noPermission = new NoPermissionEvent(
      req.user,
      `update-user-${id}-privacy`
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, {
      id: noPermission.message
    })
  }

  if (!foundUser.isActive) {
    const deactivated = new DeactivatedUserEvent(
      req.user,
      `update-user-${id}-privacy`
    )

    myEmitter.emit('error', deactivated)
    return sendMessageResponse(res, deactivated.code, deactivated.message)
  }

  const oldPostPrivacyPref = foundUser.postPrivacyPref
  const { postPrivacyPref } = req.body
  const updateUser = await foundUser.update({ postPrivacyPref })

  myEmitter.emit('update-privacy', updateUser, oldPostPrivacyPref)
  return sendDataResponse(res, 201, updateUser)
}

export const checkUserLoginDetails = async (req, res) => {
  const id = Number(req.params.id)
  const foundUser = await User.findById(id)

  if (!foundUser) {
    const notFound = new NotFoundEvent(
      req.user,
      `check-user-${id}-login-details`,
      'user'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, { id: notFound.message })
  }

  if (foundUser.id !== req.user.id) {
    const noPermission = new NoPermissionEvent(
      req.user,
      `check-user-${id}-login-details`
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, {
      id: noPermission.message
    })
  }

  const email = req.body.email
  const password = await bcrypt.hash(req.body.password, 8)

  if (foundUser.email !== email || foundUser.password !== password) {
    return sendMessageResponse(
      res,
      400,
      'Invalid email and/or password provided'
    )
  }

  return sendMessageResponse(res, 200, 'success')
}
