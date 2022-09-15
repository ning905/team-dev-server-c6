import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content } = req.body
  const { id } = req.user

  if (!content) {
    return sendMessageResponse(res, 400, 'Must provide content')
  }

  try {
    const createdPost = await dbClient.post.create({
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
  const posts = await dbClient.post.findMany({
    skip: 0,
    take: 100,
    orderBy: {
      createdAt: 'desc'
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
    const foundPost = await dbClient.post.findUnique({
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

    const updatedPost = await dbClient.post.update({
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

export const deletePost = async (req, res) => {
  // GET the post ID we want to delete from req.param
  // Convert post id from string to number
  const id = Number(req.params.id)
  console.log('id', id)
  // get the post from database
  try {
    const foundPost = await dbClient.post.findUnique({
      where: {
        id
      },
      include: {
        user: true
      }
    })
    console.log('found Post', foundPost)
    // if no post, throw error
    if (!foundPost) {
      return sendMessageResponse(res, 404, 'Error in retriving post')
    }
    // if post user id does not match request user id, throw error

    if (foundPost.user.id !== req.user.id) {
      return sendMessageResponse(
        res,
        403,
        'Request authorization to delete post'
      )
    }
    // if all good, call deletepost on prisma
    const deletePost = await dbClient.post.delete({
      where: {
        id
      }
    })
    console.log('delete post', deletePost)
    return sendDataResponse(res, 201, deletePost)
  } catch (err) {
    sendMessageResponse(res, 500, 'Unable to delete post')
  }
}
