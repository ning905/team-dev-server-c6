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

export async function dbDeleteLogById(id) {
  const deleteLog = await dbClient.deliveryLog.delete({
    where: {
      id
    }
  })
  return deleteLog
}

export async function dbCreateLine(logId, content) {
  const newLine = await dbClient.deliveryLogLine.create({
    data: {
      logId,
      content
    }
  })

  return newLine
}

export async function dbDeleteLineById(id) {
  const deletedLine = await dbClient.deliveryLogLine.delete({
    where: {
      id
    }
  })
  return deletedLine
}
