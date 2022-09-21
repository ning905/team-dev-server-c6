import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort(name) {
  const createdCohort = await dbClient.cohort.create({
    data: { name: name }
  })

  return new Cohort(createdCohort.id, createdCohort.name)
}

export async function getAllCohorts() {
  const foundCohorts = await dbClient.cohort.findMany({})
  return foundCohorts
}

export async function getCohortById(id) {
  const foundCohort = await dbClient.cohort.findUnique({
    where: { id },
    include: {
      deliveryLogs: true,
      users: { select: { id: true, email: true, profile: true } }
    }
  })
  return foundCohort
}

export async function updateCohortNameByID(id, name) {
  console.log('name', name)
  const updateCohort = await dbClient.cohort.update({
    where: { id },
    data: { name }
  })

  return updateCohort
}

export class Cohort {
  constructor(id = null, name = null) {
    this.id = id
    this.name = name
  }

  toJSON() {
    return {
      cohort: {
        id: this.id,
        name: this.name
      }
    }
  }
}
