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

  const thirdUser = await prisma.user.create({
    data: {
      email: 'third@blah',
      password,
      cohortId: cohort1.id
    }
  })

  const fourthUser = await prisma.user.create({
    data: {
      email: 'fourth@blah',
      password,
      cohortId: cohort2.id
    }
  })

  const fifthUser = await prisma.user.create({
    data: {
      email: 'fifth@blah',
      password,
      cohortId: cohort1.id
    }
  })

  const sixthUser = await prisma.user.create({
    data: {
      email: 'sixth@blah',
      password,
      cohortId: cohort2.id
    }
  })

  const seventhUser = await prisma.user.create({
    data: {
      email: 'seventh@blah',
      password,
      cohortId: cohort1.id
    }
  })

  const eightUser = await prisma.user.create({
    data: {
      email: 'eight@blah',
      password,
      cohortId: cohort2.id
    }
  })

  const ninthUser = await prisma.user.create({
    data: {
      email: 'ninth@blah',
      password,
      cohortId: cohort1.id
    }
  })

  const tenthUser = await prisma.user.create({
    data: {
      email: 'tenth@blah',
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
  const users = [
    createdUser,
    secondUser,
    thirdUser,
    fourthUser,
    fifthUser,
    sixthUser,
    seventhUser,
    eightUser,
    ninthUser,
    tenthUser,
    teacherUser
  ]
  console.log('users', users)

  const createdProfile = await prisma.profile.create({
    data: {
      userId: createdUser.id,
      firstName: 'Test',
      lastName: 'Test',
      profileImageUrl:
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1686&q=80'
    }
  })

  const secondProfile = await prisma.profile.create({
    data: {
      userId: secondUser.id,
      firstName: 'Test2',
      lastName: 'Test2',
      profileImageUrl:
        'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80'
    }
  })

  const thirdProfile = await prisma.profile.create({
    data: {
      userId: thirdUser.id,
      firstName: 'Test3',
      lastName: 'Test3',
      profileImageUrl:
        'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
    }
  })

  const fourthProfile = await prisma.profile.create({
    data: {
      userId: fourthUser.id,
      firstName: 'Test4',
      lastName: 'Test4',
      profileImageUrl:
        'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=601&q=80'
    }
  })

  const fifthProfile = await prisma.profile.create({
    data: {
      userId: fifthUser.id,
      firstName: 'Test5',
      lastName: 'Test5',
      profileImageUrl:
        'https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1829&q=80'
    }
  })

  const sixthProfile = await prisma.profile.create({
    data: {
      userId: sixthUser.id,
      firstName: 'Test6',
      lastName: 'Test6',
      profileImageUrl:
        'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80'
    }
  })

  const seventhProfile = await prisma.profile.create({
    data: {
      userId: seventhUser.id,
      firstName: 'Test7',
      lastName: 'Test7',
      profileImageUrl:
        'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
    }
  })

  const eightProfile = await prisma.profile.create({
    data: {
      userId: eightUser.id,
      firstName: 'Test8',
      lastName: 'Test8',
      profileImageUrl:
        'https://images.unsplash.com/photo-1506891536236-3e07892564b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80'
    }
  })

  const ninthProfile = await prisma.profile.create({
    data: {
      userId: ninthUser.id,
      firstName: 'Test9',
      lastName: 'Test9',
      profileImageUrl:
        'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'
    }
  })

  const tenthProfile = await prisma.profile.create({
    data: {
      userId: tenthUser.id,
      firstName: 'Test10',
      lastName: 'Test10',
      profileImageUrl:
        'https://images.unsplash.com/photo-1542652735873-fb2825bac6e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
    }
  })

  const teacherProfile = await prisma.profile.create({
    data: {
      userId: teacherUser.id,
      firstName: 'Teacher',
      lastName: 'Boolean',
      profileImageUrl:
        'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=972&q=80'
    }
  })

  const profiles = [
    createdProfile,
    secondProfile,
    thirdProfile,
    fourthProfile,
    fifthProfile,
    sixthProfile,
    seventhProfile,
    eightProfile,
    ninthProfile,
    tenthProfile,
    teacherProfile
  ]
  console.log('profiles', profiles)

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

  const thirdPost = await prisma.post.create({
    data: {
      content: 'Woah! Next week they are going to shuffle the groups!',
      userId: thirdUser.id
    }
  })

  const fourthPost = await prisma.post.create({
    data: {
      content: "Is it a problem if I'm using normal HTML tags instead of MUI?",
      userId: fourthUser.id
    }
  })

  const fifthPost = await prisma.post.create({
    data: {
      content: 'Please always do a git pull!',
      userId: teacherUser.id
    }
  })

  const sixthPost = await prisma.post.create({
    data: {
      content: 'In love with MUI!',
      userId: sixthUser.id
    }
  })

  const teacherPost = await prisma.post.create({
    data: {
      content: 'This students are driving me crazy!',
      userId: teacherUser.id
    }
  })

  const posts = [
    createdPost,
    secondPost,
    thirdPost,
    fourthPost,
    fifthPost,
    sixthPost
  ]

  console.log('posts created', posts)

  const likes = await prisma.like.createMany({
    data: [
      {
        userId: secondUser.id,
        postId: teacherPost.id
      },
      {
        userId: thirdUser.id,
        postId: teacherPost.id
      },
      {
        userId: fourthUser.id,
        postId: teacherPost.id
      },
      {
        userId: fifthUser.id,
        postId: teacherPost.id
      },
      {
        userId: sixthUser.id,
        postId: teacherPost.id
      },
      {
        userId: seventhUser.id,
        postId: teacherPost.id
      },
      {
        userId: eightUser.id,
        postId: teacherPost.id
      },
      {
        userId: ninthUser.id,
        postId: teacherPost.id
      },
      {
        userId: tenthUser.id,
        postId: teacherPost.id
      }
    ]
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
