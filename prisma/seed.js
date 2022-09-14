import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seed() {
  const createdUser = await prisma.user.create({
    data: {
      email: 'notmyrealemail@email.com',
      password: 'test'
    }
  })

  const secondUser = await prisma.user.create({
    data: {
      email: 'blah@blah',
      password: 'test2'
    }
  })

  console.log('user', createdUser, secondUser)

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

  console.log('profile', createdProfile, secondProfile)

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

  console.log('post created', createdPost, secondPost)
}

seed().catch(async (error) => {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
})
