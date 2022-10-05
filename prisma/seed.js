import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { myEmitter } from '../src/eventEmitter/index.js'

const prisma = new PrismaClient()

async function seed() {
  const password = await bcrypt.hash('123', 8)

  const users = []
  const cohorts = []
  const profileImages = [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1686&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80',
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=601&q=80',
    'https://images.unsplash.com/photo-1494256997604-768d1f608cac?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1829&q=80',
    'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
    'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1506891536236-3e07892564b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80',
    'https://images.unsplash.com/photo-1511275539165-cc46b1ee89bf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    'https://images.unsplash.com/photo-1572252821143-035a024857ac?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80'
  ]

  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@teacher.com',
      password,
      role: 'TEACHER'
    }
  })
  myEmitter.emit('register', teacherUser)

  const teacherProfile = await prisma.profile.create({
    data: {
      userId: teacherUser.id,
      firstName: 'Teacher',
      lastName: 'Boolean',
      bio: `If dinosaurs are so great how come more sweeties are based on aliens?`,
      profileImageUrl:
        'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=972&q=80'
    }
  })

  for (let i = 0; i <= 9; i++) {
    if (i <= 3) {
      const cohort = await prisma.cohort.create({ data: {} })
      myEmitter.emit('create-cohort', cohort, teacherUser)
      cohorts.push(cohort)
    }

    try {
      const user = await prisma.user.create({
        data: {
          email: `test${i}@test.com`,
          password,
          cohortId: cohorts[0].id,
          profile: {
            create: {
              firstName: `name${i}`,
              lastName: `surname${i}`,
              bio: `Here i am, coding like a hurricane`,
              profileImageUrl: profileImages[i]
            }
          }
        }
      })
      users.push(user)
      myEmitter.emit('register', users[0])
    } catch (err) {}
  }

  const createdUser = await prisma.user.create({
    data: {
      email: 'notmyrealemail@email.com',
      password,
      cohortId: cohorts[2].id
    }
  })
  myEmitter.emit('register', createdUser)

  const userProfile = await prisma.profile.create({
    data: {
      userId: createdUser.id,
      firstName: 'Test',
      lastName: 'Test',
      profileImageUrl:
        'https://images.unsplash.com/photo-1542652735873-fb2825bac6e2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
    }
  })

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password,
      role: 'ADMIN'
    }
  })
  myEmitter.emit('register', adminUser)

  const adminProfile = await prisma.profile.create({
    data: {
      userId: adminUser.id,
      firstName: 'Admin',
      lastName: 'Boolean',
      profileImageUrl:
        'https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2a6f37ce-a2f9-4f31-a854-b38c4412baac/819%20sand%20cat%20WC%20Cle%CC%81ment%20Bardot.jpeg?auto=compress%2Cformat&w=1200'
    }
  })

  users.push(createdUser, adminUser, teacherUser)

  console.log(cohorts, users, userProfile, teacherProfile, adminProfile)

  const createdPost = await prisma.post.create({
    data: {
      content: "I'm losing my patience creating a DB",
      userId: createdUser.id
    }
  })

  const posts = []
  const content = [
    'Give me a break!',
    'Woah! Next week they are going to shuffle the groups!',
    "Is it a problem if I'm using normal HTML tags instead of MUI?",
    'In love with MUI!'
  ]

  for (let i = 0; i < content.length; i++) {
    const post = await prisma.post.create({
      data: {
        content: content[i],
        userId: users[i].id
      }
    })

    posts.push(post)
  }

  const teacherPost = await prisma.post.create({
    data: {
      content: 'This students are driving me crazy!',
      userId: teacherUser.id
    }
  })

  const teacherSecondPost = await prisma.post.create({
    data: {
      content: 'Please always do a git pull!',
      userId: teacherUser.id
    }
  })

  console.log('posts created', posts, teacherPost, teacherSecondPost)

  const likes = []

  for (let i = 0; i <= 9; i++) {
    const like = await prisma.like.create({
      data: {
        userId: users[i].id,
        postId: teacherPost.id
      }
    })

    likes.push(like)
  }

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
      },
      {
        content: 'Reply',
        userId: createdUser.id,
        postId: createdPost.id,
        parentId: 1
      },
      {
        content: 'Reply to reply',
        userId: createdUser.id,
        postId: createdPost.id,
        parentId: 3
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

  await prisma.exercise.createMany({
    data: [
      {
        name: 'HTML Scientific Paper',
        gitHubUrl: 'https://github.com/boolean-uk/html-scientific-paper',
        readMeUrl:
          'https://raw.githubusercontent.com/boolean-uk/html-scientific-paper/main/README.md',
        objectives: [
          'Start with the template in index.html',
          'Add a <title> in the <head> of the HTML page',
          'Use HTML elements like <header> and <section> to structure your code',
          'Use HTML elements like <h1> and <em> to format the text',
          'Use HTML elements like <img> and <a> with the correct attributes'
        ]
      },
      {
        name: 'Authentication Challenge',
        gitHubUrl: 'https://github.com/boolean-uk/auth-challenge',
        readMeUrl:
          'https://raw.githubusercontent.com/boolean-uk/auth-challenge/main/README.md',
        objectives: [
          'Use a token-based approach to authorise access to API resources',
          'Use a hashing library to encrypt sensitive information',
          'Build a front-end application that interacts with a bearer-auth protected API'
        ]
      }
    ]
  })

  const iterator = 2

  const curriculums = []
  const createCurriculum = async () => {
    const newCurriculum = await prisma.curriculum.create({
      data: {
        name: 'Javascript',
        description:
          'Learn the JavaScript fundamentals you will need for front-end or back-end development'
      }
    })
    curriculums.push(newCurriculum)
  }

  const modules = []
  const createModule = async (curriculum, iterator) => {
    const newModule = await prisma.module.create({
      data: {
        name: `Module ${iterator}`,
        description: `Description for Module-${iterator}`,
        objectives: [
          `Objective 1 for module-${iterator} Curriculum-${curriculum.id}`,
          `Objective 2 for module-${iterator} Curriculum-${curriculum.id}`,
          `Objective 3 for module-${iterator} Curriculum-${curriculum.id}`,
          `Objective 4 for module-${iterator} Curriculum-${curriculum.id}`,
          `Objective 5 for module-${iterator} Curriculum-${curriculum.id}`
        ],
        curriculum: {
          connect: {
            id: curriculum.id
          }
        }
      }
    })
    modules.push(newModule)
  }

  const units = []
  const createUnit = async (module, iterator) => {
    const newUnit = await prisma.unit.create({
      data: {
        name: `Unit ${iterator}`,
        description: `Description for Unit-${iterator}`,
        objectives: [
          `Objective 1 for Unit-${iterator} Module-${module.id} `,
          `Objective 1 for Unit-${iterator} Module-${module.id} `,
          `Objective 1 for Unit-${iterator} Module-${module.id} `,
          `Objective 1 for Unit-${iterator} Module-${module.id} `,
          `Objective 1 for Unit-${iterator} Module-${module.id}`
        ],
        moduleId: module.id
      }
    })
    units.push(newUnit)
  }

  const lessons = []
  const createLesson = async (unit, iterator) => {
    const newLesson = await prisma.lesson.create({
      data: {
        dayNumber: 1,
        name: `Lesson ${iterator}`,
        description: `Lesson description for ${iterator}`,
        objectives: [
          `Objective 1 for lesson-${iterator} Unit-${unit.id}`,
          `Objective 2 for lesson-${iterator} Unit-${unit.id} `,
          `Objective 3 for lesson-${iterator} Unit-${unit.id} `,
          `Objective 4 for lesson-${iterator} Unit-${unit.id} `,
          `Objective 5 for lesson-${iterator} Unit-${unit.id}`
        ],
        unitId: unit.id
      }
    })
    lessons.push(newLesson)
  }

  const exercises = []
  const createExercise = async (lesson, iterator) => {
    const newExercise = await prisma.exercise.create({
      data: {
        name: `Exercise ${iterator}`,
        gitHubUrl: 'https://github.com/boolean-uk/html-scientific-paper',
        readMeUrl:
          'https://raw.githubusercontent.com/boolean-uk/html-scientific-paper/main/README.md',
        objectives: [
          `Objective 1 for exercise ${iterator} lesson-${lesson.id}`,
          `Objective 2 for exercise ${iterator} lesson-${lesson.id}`,
          `Objective 3 for exercise ${iterator} lesson-${lesson.id}`,
          `Objective 4 for exercise ${iterator} lesson-${lesson.id}`,
          `Objective 5 for exercise ${iterator} lesson-${lesson.id}`
        ],
        lesson: {
          connect: {
            id: lesson.id
          }
        }
      }
    })
    exercises.push(newExercise)
  }

  const lessonPlans = []
  const createLessonPLan = async (lesson, iterator) => {
    const newLessonPlan = await prisma.lessonPlan.create({
      data: {
        name: `Lesson Plan ${iterator}`,
        description: `Lesson plan ${iterator} description`,
        objectives: [
          `Objective 1 for lesson plan-${iterator} lesson-${lesson.id}`,
          `Objective 2 for lesson plan-${iterator} lesson-${lesson.id}`,
          `Objective 3 for lesson plan-${iterator} lesson-${lesson.id}`,
          `Objective 4 for lesson plan-${iterator} lesson-${lesson.id}`,
          `Objective 5 for lesson plan-${iterator} lesson-${lesson.id}`
        ],
        createdBy: {
          connect: {
            id: teacherUser.id
          }
        },
        createdFor: {
          connect: {
            id: users[2].id
          }
        },
        lesson: {
          connect: {
            id: lesson.id
          }
        }
      }
    })
    lessonPlans.push(newLessonPlan)
  }
  for (let i = 1; i <= iterator; i++) {
    await createCurriculum()
  }

  for (let i = 1; i <= iterator; i++) {
    await createModule(curriculums[i - 1], iterator)
  }

  for (let i = 1; i <= iterator; i++) {
    await createUnit(modules[i - 1], iterator)
  }

  for (let i = 1; i <= iterator; i++) {
    await createLesson(units[i - 1], iterator)
  }

  for (let i = 1; i <= iterator; i++) {
    await createLessonPLan(lessons[i - 1], iterator)
  }

  for (let i = 1; i <= iterator; i++) {
    await createExercise(lessons[i - 1], iterator)
  }
  console.log(
    'Curriculums, Modules, Units, Lessons, Exercises, Lesson Plans',
    curriculums,
    modules,
    units,
    lessons,
    exercises,
    lessonPlans
  )
}

seed().catch(async (error) => {
  console.error(error)
  await prisma.$disconnect()
  process.exit(1)
})
