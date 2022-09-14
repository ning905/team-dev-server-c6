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
    sendMessageResponse(res, 500, 'Unable to create post')
    throw err
  }
}

export const getAll = async (req, res) => {
  const posts = await prisma.post.findMany({
    skip: 0,
    take: 100,
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      user: {
        select: {
          email: true,
          id: true,
          cohortId: true,
          role: true,
          profile: true
        }
      }
    }
  })
  return sendDataResponse(res, 200, posts)
}

export const edit = async (req, res) => {
  const id = Number(req.params.id)
  const { content } = req.body

  if (!content) {
    return sendMessageResponse(res, 400, 'Must provide content')
  }

  try {
    const foundPost = await prisma.post.findUnique({
      where: { id },
      include: { user: true }
    })

    if (!foundPost) {
      return sendMessageResponse(
        res,
        404,
        'The post with the provided id does not exist'
      )
    }

    if (foundPost.user.id !== req.user.id) {
      return sendMessageResponse(
        res,
        403,
        'Only the post author can edit the post'
      )
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { content },
      include: { user: true }
    })
    return sendDataResponse(res, 201, updatedPost)
  } catch (err) {
    sendMessageResponse(res, 500, 'Internal server error')
    throw err
  }
}
