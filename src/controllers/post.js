import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'
import { myEmitter } from '../eventEmitter/index.js'
import {
  NoPermissionEvent,
  NotFoundEvent,
  OtherErrorEvent,
  ServerErrorEvent
} from '../eventEmitter/utils.js'

const formatPostsData = (posts) => {
  const DEFAULT_PFP =
    'https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png'
  const REMOVED = '[removed]'

  posts.forEach((post) => {
    if (!post.user.isActive) {
      post.content = REMOVED
      post.user.email = REMOVED
      post.user.profile.firstName = REMOVED
      post.user.profile.lastName = REMOVED
      post.user.profile.bio = REMOVED
      post.user.profile.githubUrl = REMOVED
      post.user.profile.profileImageUrl = DEFAULT_PFP
    }

    post.comments.forEach((comment) => {
      if (!comment.user.isActive) {
        comment.content = REMOVED
        comment.user.email = REMOVED
        comment.user.profile.firstName = REMOVED
        comment.user.profile.lastName = REMOVED
        comment.user.profile.bio = REMOVED
        comment.user.profile.githubUrl = REMOVED
        comment.user.profile.profileImageUrl = DEFAULT_PFP
      }

      comment.replies.forEach((reply) => {
        if (!reply.user.isActive) {
          reply.content = REMOVED
          reply.user.email = REMOVED
          reply.user.profile.firstName = REMOVED
          reply.user.profile.lastName = REMOVED
          reply.user.profile.bio = REMOVED
          reply.user.profile.githubUrl = REMOVED
          reply.user.profile.profileImageUrl = DEFAULT_PFP
        }
      })
    })
  })
}

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
    const error = new ServerErrorEvent(
      req.user,
      'create-post',
      'Unable to create post'
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
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
          profile: true,
          isActive: true
        }
      },
      likes: {
        where: {
          user: {
            isActive: {
              equals: true
            }
          }
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
      },
      comments: {
        include: {
          likes: {
            where: {
              user: {
                isActive: {
                  equals: true
                }
              }
            }
          },
          replies: {
            include: {
              likes: {
                where: {
                  user: {
                    isActive: {
                      equals: true
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
                  profile: true,
                  isActive: true
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
              profile: true,
              isActive: true
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
  if (req.query.user) {
    query.where = {
      ...query.where,
      userId: Number(req.query.user)
    }
  }
  const posts = await dbClient.post.findMany(query)

  if (req.user.role === 'STUDENT') {
    formatPostsData(posts)
  }

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
    const notFound = new NotFoundEvent(req.user, `edit-post-${id}`, 'post')
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  if (foundPost.user.id !== req.user.id) {
    const noPermission = new NoPermissionEvent(
      req.user,
      `edit-post-${foundPost.id}`,
      'Only the post author can edit the post'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
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
    const notFound = new NotFoundEvent(req.user, `delete-post-${id}`, 'post')
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  if (foundPost.user.id !== req.user.id) {
    const noPermission = new NoPermissionEvent(
      req.user,
      `delete-post-${foundPost.id}`,
      'Only the post author can delete the post'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
  }

  const deletedPost = await dbClient.post.delete({
    where: {
      id
    }
  })

  return sendDataResponse(res, 201, { deletedPost })
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
    const notFound = new NotFoundEvent(
      req.user,
      `comment-on-post-${postId}`,
      'post'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
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
    const notFound = new NotFoundEvent(req.user, `like-post-${postId}`, 'post')
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
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
    const error = new OtherErrorEvent(
      req.user,
      `like-post-${postId}`,
      409,
      'This user already liked this post'
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
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
    const notFound = new NotFoundEvent(
      req.user,
      `unlike-post-${postId}`,
      'post'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
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
    const error = new OtherErrorEvent(
      req.user,
      `unlike-post-${postId}`,
      409,
      'This user has not liked this post'
    )
    myEmitter.emit('error', error)
    return sendMessageResponse(res, error.code, error.message)
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
    const notFound = new NotFoundEvent(
      req.user,
      `update-post-${postId}-privacy`,
      'post'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  if (foundPost.user.id !== req.user.id) {
    const noPermission = new NoPermissionEvent(
      req.user,
      `update-post-${postId}-privacy`,
      'Only the post author can edit the post'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
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
    const error = new ServerErrorEvent(
      req.user,
      `update-post-${postId}-privacy`
    )
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
  }
}

export const setIsPinned = async (req, res) => {
  const postId = Number(req.params.id)

  const foundPost = await dbClient.post.findUnique({
    where: { id: postId }
  })

  if (!foundPost) {
    const notFound = new NotFoundEvent(
      req.user,
      `update-post-${postId}-pinned`,
      'post'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  if (foundPost.userId !== req.user.id) {
    const noPermission = new NoPermissionEvent(
      req.user,
      `update-post-${postId}-pinned`,
      'Only the author can edit the post'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
  }

  if (foundPost.isPrivate) {
    const existingPin = new OtherErrorEvent(
      req.user,
      `update-post-${postId}-pinned`,
      409,
      "Private posts can't be pinned"
    )
    myEmitter.emit('error', existingPin)
    return sendMessageResponse(res, existingPin.code, existingPin.message)
  }

  const alreadyPinned = await dbClient.post.findFirst({
    where: {
      id: { not: postId },
      userId: foundPost.userId,
      isPinned: true
    }
  })

  if (alreadyPinned) {
    const existingPin = new OtherErrorEvent(
      req.user,
      `update-post-${postId}-pinned`,
      409,
      'This user already has a pinned post'
    )
    myEmitter.emit('error', existingPin)
    return sendMessageResponse(res, existingPin.code, existingPin.message)
  }

  try {
    const updatePinned = await dbClient.post.update({
      where: {
        id: postId
      },
      data: {
        isPinned: !foundPost.isPinned
      }
    })
    return sendMessageResponse(res, 201, updatePinned)
  } catch (err) {
    const error = new ServerErrorEvent(req.user, `update-post-${postId}-pinned`)
    myEmitter.emit('error', error)
    sendMessageResponse(res, error.code, error.message)
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
    const notFound = new NotFoundEvent(
      req.user,
      `update-comment-${id}`,
      'comment'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
  }

  if (foundComment.user.id !== req.user.id) {
    const noPermission = new NoPermissionEvent(
      req.user,
      `update-comment-${id}`,
      'Only the comment author can edit the comment'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
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
    const notFound = new NotFoundEvent(
      req.user,
      `delete-comment-${id}`,
      'comment'
    )
    myEmitter.emit('error', notFound)
    return sendMessageResponse(res, notFound.code, notFound.message)
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
    const noPermission = new NoPermissionEvent(
      req.user,
      `delete-comment-${id}`,
      'Unauthorized to delete this comment'
    )
    myEmitter.emit('error', noPermission)
    return sendMessageResponse(res, noPermission.code, noPermission.message)
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
