import dbClient from '../utils/dbClient.js'

// create a function to create a log
// collect user id from req object
// collect cohort from the req body

export async function dbCreateLog(userId, cohortId) {
  const newLog = await dbClient.deliveryLog.create({
    data: {
      userId,
      cohortId
    },
    include: {
      user: true,
      lines: true
    }
  })
  return newLog
}

export async function dbDeleteLogById(deliveryLogId) {
  const deleteLog = await dbClient.deliveryLog.delete({
    where: {
      id: deliveryLogId
    }
  })
  console.log(deleteLog)
  return deleteLog
}
