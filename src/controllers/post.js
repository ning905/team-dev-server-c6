import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const create = async (req, res) => {
  const { content } = req.body
  const { id } = req.user

  if (!content) {
    return sendMessageResponse(res, 400, 'Must provide content')
  }

  try {
    const createdPost = await prisma.post.create({
      data: {
        content,
        userId: id
      }
    })
    return sendDataResponse(res, 201, { post: createdPost })
  } catch (err) {
    return sendMessageResponse(res, 500, 'Unable to create post')
  }
}

export const getAll = async (req, res) => {
  const posts = await prisma.post.findMany({
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
