import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
  const password = await bcrypt.hash('123', 8)

  const cohort1 = await prisma.cohort.create({
    data: {}
  })

  const cohort2 = await prisma.cohort.create({
    data: {}
  })

  const createdUser = await prisma.user.create({
    data: {
      email: 'notmyrealemail@email.com',
      password,
      cohortId: cohort1.id
    }
  })

  const secondUser = await prisma.user.create({
    data: {
      email: 'blah@blah',
      password,
      cohortId: cohort2.id
    }
  })

  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@teacher.com',
      password,
      role: 'TEACHER'
    }
  })

  console.log('users', createdUser, secondUser, teacherUser)

  const createdProfile = await prisma.profile.create({
    data: {
      userId: createdUser.id,
      firstName: 'Test',
      lastName: 'Test'
    }
  })

  const secondProfile = await prisma.profile.create({
    data: {
      userId: secondUser.id,
      firstName: 'Test2',
      lastName: 'Test2'
    }
  })

  const teacherProfile = await prisma.profile.create({
    data: {
      userId: teacherUser.id,
      firstName: 'Teacher',
      lastName: 'Boolean'
    }
  })

  console.log('profiles', createdProfile, secondProfile, teacherProfile)

  const createdPost = await prisma.post.create({
    data: {
      content: "I'm losing my patience creating a DB",
      userId: createdUser.id
    }
  })

  const secondPost = await prisma.post.create({
    data: {
      content: 'Give me a break!',
      userId: secondUser.id
    }
  })

  const teacherPost = await prisma.post.create({
    data: {
      content: 'This students are driving me crazy!',
      userId: teacherUser.id
    }
  })

  console.log('posts created', createdPost, secondPost, teacherPost)

  await prisma.like.createMany({
    data: [
      {
        userId: createdUser.id,
        postId: createdPost.id
      },
      {
        userId: secondUser.id,
        postId: createdPost.id
      }
    ]
  })

  const likes = await prisma.like.findMany({
    include: {
      user: {
        include: { profile: true }
      },
      post: true
    }
  })

  console.log('likes created', likes)

  const createdComments = await prisma.comment.createMany({
    data: [
      {
        content: 'I really like it!',
        userId: createdUser.id,
        postId: createdPost.id
      },
      {
        content: 'Yeah, its really interestng',
        userId: createdUser.id,
        postId: createdPost.id
      }
    ]
  })
  console.log('created comments', { createdComments })

  const createFirstComment = await prisma.comment.create({
    data: {
      content: 'Hi there',
      userId: createdUser.id,
      postId: createdPost.id
    }
  })
  console.log('first comment', createFirstComment)
}

seed().catch(async (error) => {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
})
