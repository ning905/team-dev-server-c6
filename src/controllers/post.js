import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content, isPrivate } = req.body
  const { id } = req.user

  if (!content) {
    return sendMessageResponse(res, 400, 'Must provide content')
  }

  try {
    const createdPost = await dbClient.post.create({
      data: {
        content,
        isPrivate,
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
      },
      likes: {
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
      },
      comments: {
        include: {
          likes: true,
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
    include: {
      user: true,
      likes: {
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
      }
    }
  })

  return sendDataResponse(res, 201, updatedPost)
}

export const deletePost = async (req, res) => {
  const id = Number(req.params.id)

  const foundPost = await dbClient.post.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  })

  if (!foundPost) {
    return sendMessageResponse(res, 404, 'Error in retrieving post')
  }

  if (foundPost.user.id !== req.user.id) {
    return sendMessageResponse(res, 403, 'Request authorization to delete post')
  }

  const deletedComments = await dbClient.comment.deleteMany({
    where: {
      postId: id
    }
  })

  const deletedPost = await dbClient.post.delete({
    where: {
      id
    }
  })

  return sendDataResponse(res, 201, { deletedPost, deletedComments })
}

export const createComment = async (req, res) => {
  const { content } = req.body
  const postId = Number(req.params.id)
  const userId = req.user.id
  const parentId = req.body.parentId

  const findPostById = await dbClient.post.findUnique({
    where: {
      id: postId
    }
  })

  if (!findPostById) {
    return sendMessageResponse(res, 404, 'No post found')
  }

  if (!content) {
    return sendMessageResponse(res, 400, 'Must provide content')
  }

  const createdComment = await dbClient.comment.create({
    data: {
      content,
      userId,
      postId,
      parentId
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

  return sendDataResponse(res, 201, { post: createdComment })
}

export const createLike = async (req, res) => {
  const postId = Number(req.params.id)

  const foundPost = await dbClient.post.findUnique({
    where: { id: postId },
    include: { user: true }
  })
  if (!foundPost) {
    return sendMessageResponse(
      res,
      404,
      'The post with the provided id does not exist'
    )
  }

  const foundLike = await dbClient.like.findUnique({
    where: {
      userId_postId: {
        userId: req.user.id,
        postId: postId
      }
    }
  })
  if (foundLike) {
    return sendMessageResponse(res, 409, 'This user already liked this post')
  }

  await dbClient.like.create({
    data: {
      userId: req.user.id,
      postId: postId
    }
  })

  const likes = await dbClient.like.findMany({
    where: { postId },
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

  return sendDataResponse(res, 201, likes)
}

export const deleteLike = async (req, res) => {
  const postId = Number(req.params.id)

  const foundPost = await dbClient.post.findUnique({
    where: { id: postId },
    include: { user: true }
  })
  if (!foundPost) {
    return sendMessageResponse(
      res,
      404,
      'The post with the provided id does not exist'
    )
  }

  const foundLike = await dbClient.like.findUnique({
    where: {
      userId_postId: {
        userId: req.user.id,
        postId: postId
      }
    }
  })
  if (!foundLike) {
    return sendMessageResponse(res, 409, 'This user has not liked this post')
  }

  await dbClient.like.delete({
    where: {
      userId_postId: {
        userId: req.user.id,
        postId: postId
      }
    }
  })

  const likes = await dbClient.like.findMany({
    where: { postId },
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

  return sendDataResponse(res, 201, likes)
}

export const setIsPrivate = async (req, res) => {
  const postId = Number(req.params.id)

  try {
    const foundPost = await dbClient.post.findUnique({
      where: { id: postId }
    })
    if (!foundPost) {
      return sendMessageResponse(
        res,
        404,
        'The post with the provided id does not exist'
      )
    }

    const isPrivateCheck = foundPost.isPrivate

    const togglePrivate = await dbClient.post.update({
      where: {
        id: postId
      },
      data: {
        isPrivate: !isPrivateCheck
      }
    })

    return sendDataResponse(res, 201, togglePrivate)
  } catch (err) {
    sendMessageResponse(res, 500, 'Internal server error')
  }
}

export const createCommentLike = async (req, res) => {
  const userId = req.user.id

  const commentId = Number(req.params.commentId)

  const like = await dbClient.commentLike.create({
    data: {
      userId,
      commentId
    },
    include: {
      comment: {
        select: {
          _count: true
        }
      }
    }
  })

  return sendDataResponse(res, 201, {
    like: {
      userId: like.userId,
      commentId: like.commentId,
      commentLikes: like.comment._count.likes
    }
  })
}

export const deleteCommentLike = async (req, res) => {
  const userId = req.user.id
  const commentId = Number(req.params.commentId)

  const like = await dbClient.commentLike.delete({
    where: {
      userId_commentId: {
        commentId,
        userId
      }
    }
  })

  return sendDataResponse(res, 200, {
    like: {
      userId: like.userId,
      commentId: like.commentId
    }
  })
}
