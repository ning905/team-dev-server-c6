import { sendDataResponse } from '../utils/responses.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  return sendDataResponse(res, 201, { post: { id: 1, content } })
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
