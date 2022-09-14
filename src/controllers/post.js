import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../utils/config.js'
const prisma = new PrismaClient()

export const create = async (req, res) => {
  const { content } = req.body
  const token = req.headers.authorization.split(' ')

  if (!content) {
    return sendMessageResponse(res, 400, 'Must provide content')
  }

  try {
    const user = jwt.verify(token[1], JWT_SECRET)
    const createdPost = await prisma.post.create({
      data: {
        content,
        userId: user.userId
      }
    })
    return sendDataResponse(res, 201, { post: createdPost })
  } catch (err) {
    return sendMessageResponse(res, 500, err.message)
  }
}

export const getAll = async (req, res) => {
  const posts = await prisma.posts.findMany({
    skip: 0,
    take: 100,
    orderBy: {
      time: 'asc'
    },
    include: {
      user: true
    }
  })
  return sendDataResponse(res, 200, posts)
}
