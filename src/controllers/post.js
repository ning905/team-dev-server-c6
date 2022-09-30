import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import { myEmitter } from '../eventEmitter/index.js'

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
    myEmitter.emit(
      'error',
      req.user,
      'create-post',
      500,
      'Unable to create post'
    )
    sendMessageResponse(res, 500, 'Unable to create post')
    throw err
  }
}

export const getAll = async (req, res) => {
  const id = parseInt(req.user.id)
  const query = {
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
          replies: {
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
          },
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
  }
  if (req.user.role === 'STUDENT') {
    query.where = {
      OR: [{ isPrivate: false }, { userId: id }]
    }
  }
  const posts = await dbClient.post.findMany(query)

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
    myEmitter.emit(
      'error',
      req.user,
      `edit-post-${id}`,
      404,
      'The post with the provided id does not exist'
    )
    return sendMessageResponse(
      res,
      404,
      'The post with the provided id does not exist'
    )
  }

  if (foundPost.user.id !== req.user.id) {
    myEmitter.emit(
      'error',
      req.user,
      `edit-post-${foundPost.id}`,
      403,
      'Only the post author can edit the post'
    )
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
    myEmitter.emit(
      'error',
      req.user,
      `delete-post-${id}`,
      404,
      'Error in retrieving post'
    )
    return sendMessageResponse(res, 404, 'Error in retrieving post')
  }

  if (foundPost.user.id !== req.user.id) {
    myEmitter.emit(
      'error',
      req.user,
      `delete-post-${foundPost.id}`,
      403,
      'Request authorization to delete post'
    )
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
    myEmitter.emit(
      'error',
      req.user,
      `comment-on-post-${postId}`,
      404,
      'No post found'
    )
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
    myEmitter.emit(
      'error',
      req.user,
      `like-post-${postId}`,
      404,
      'The post with the provided id does not exist'
    )
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
    myEmitter.emit(
      'error',
      req.user,
      `like-post-${postId}`,
      409,
      'This user already liked this post'
    )
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
    myEmitter.emit(
      'error',
      req.user,
      `unlike-post-${postId}`,
      404,
      'The post with the provided id does not exist'
    )
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
    myEmitter.emit(
      'error',
      req.user,
      `unlike-post-${postId}`,
      409,
      'This user has not liked this post'
    )
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

  const foundPost = await dbClient.post.findUnique({
    where: { id: postId }
  })
  if (!foundPost) {
    myEmitter.emit(
      'error',
      req.user,
      `update-post-${postId}-privacy`,
      404,
      'The post with the provided id does not exist'
    )
    return sendMessageResponse(
      res,
      404,
      'The post with the provided id does not exist'
    )
  }

  if (foundPost.user.id !== req.user.id) {
    myEmitter.emit(
      'error',
      req.user,
      `update-post-${postId}-privacy`,
      403,
      'Only the post author can edit the post'
    )
    return sendMessageResponse(
      res,
      403,
      'Only the post author can edit the post'
    )
  }

  try {
    const updatedPost = await dbClient.post.update({
      where: {
        id: postId
      },
      data: {
        isPrivate: !foundPost.isPrivate
      }
    })

    return sendDataResponse(res, 201, updatedPost)
  } catch (err) {
    myEmitter.emit(
      'error',
      req.user,
      `update-post-${postId}-privacy`,
      500,
      'Internal server error'
    )
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

export const updateComment = async (req, res) => {
  const id = Number(req.params.commentId)
  const { content } = req.body

  if (!content) {
    return sendMessageResponse(res, 400, 'Must provide content')
  }

  const foundComment = await dbClient.comment.findUnique({
    where: { id },
    include: { user: true }
  })

  if (!foundComment) {
    myEmitter.emit(
      'error',
      req.user,
      `update-comment-${id}`,
      404,
      'The comment with the provided id does not exist'
    )
    return sendMessageResponse(
      res,
      404,
      'The comment with the provided id does not exist'
    )
  }

  if (foundComment.user.id !== req.user.id) {
    myEmitter.emit(
      'error',
      req.user,
      `update-comment-${id}`,
      403,
      'Only the comment author can edit the comment'
    )
    return sendMessageResponse(
      res,
      403,
      'Only the comment author can edit the comment'
    )
  }

  const updatedComment = await dbClient.comment.update({
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

  return sendDataResponse(res, 200, updatedComment)
}

export const deleteComment = async (req, res) => {
  const id = Number(req.params.commentId)

  const foundComment = await dbClient.comment.findUnique({
    where: { id },
    include: { user: true, post: { include: { user: true } } }
  })

  if (!foundComment) {
    myEmitter.emit(
      'error',
      req.user,
      `delete-comment-${id}`,
      404,
      'The comment with the provided id does not exist'
    )
    return sendMessageResponse(
      res,
      404,
      'The comment with the provided id does not exist'
    )
  }

  const hasDeletePermission = commentDeletePermission(foundComment, req.user)

  if (hasDeletePermission) {
    const deletedComment = await dbClient.comment.delete({
      where: { id },
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

    return sendDataResponse(res, 200, deletedComment)
  } else {
    myEmitter.emit(
      'error',
      req.user,
      `delete-comment-${id}`,
      403,
      'Unauthorized to delete this comment'
    )
    return sendMessageResponse(res, 403, 'Unauthorized to delete this comment')
  }
}

const commentDeletePermission = (comment, user) => {
  if (
    user.role === 'TEACHER' ||
    user.role === 'ADMIN' ||
    comment.user.id === user.id ||
    comment.post.user.id === user.id
  ) {
    return true
  }
  return false
}
