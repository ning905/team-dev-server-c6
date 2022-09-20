import User from '../domain/user.js'
import bcrypt from 'bcrypt'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)

  try {
    const existingUser = await User.findByEmail(userToCreate.email)

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (err) {
    // Send an error response back to the client then let the error handling middleware log to the terminal
    sendMessageResponse(res, 500, 'Unable to create new user')
    throw err
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    sendMessageResponse(res, 500, 'Unable to get user')
    throw e
  }
}

export const getAll = async (req, res) => {
  // console.log("quest", req.query.cohort_id)

  if (req.query.cohort_id) {
    return getAllByCohortId(req, res)
  } else {
    return getAllByFirstName(req, res)
  }
}

export const getAllByFirstName = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { first_name: firstName } = req.query

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

  const parsedId = Number(cohortId)

  let foundUsers

  if (parsedId) {
    foundUsers = await User.findManyByCohortId(parsedId)
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

export const updateById = async (req, res) => {
  const cohortId = parseInt(req.body.cohort_id)
  const id = parseInt(req.params.id)

  if (!cohortId) {
    return sendDataResponse(res, 400, { cohort_id: 'Cohort ID is required' })
  }

  const foundUser = await User.findById(id)

  if (!foundUser) {
    return sendDataResponse(res, 404, { id: 'User not found' })
  }

  const updatedUser = await foundUser.update({ cohortId })

  return sendDataResponse(res, 201, {
    user: { cohort_id: updatedUser.cohortId }
  })
}

export const updateLoggedInUser = async (req, res) => {
  req.params.id = req.user.id

  return updateUserById(req, res)
}

export const updateUserById = async (req, res) => {
  const id = parseInt(req.params.id)

  const { email, firstName, lastName, bio, githubUrl, profileImageUrl } =
    req.body

  const unhashedPassword = req.body.password

  let password = ''

  const foundUser = await User.findById(id)

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

  if (!foundUser) {
    return sendDataResponse(res, 404, { id: 'User not found' })
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
      profileImageUrl
    })

    return sendDataResponse(res, 201, updateUser)
  }
}
