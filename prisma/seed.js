import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
  const password = await bcrypt.hash('123', 8)

  const createdUser = await prisma.user.create({
    data: {
      email: 'notmyrealemail@email.com',
      password
    }
  })

  const secondUser = await prisma.user.create({
    data: {
      email: 'blah@blah',
      password
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
}

seed().catch(async (error) => {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
})
