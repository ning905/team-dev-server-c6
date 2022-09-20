import dbClient from '../utils/dbClient.js'

/**
 * Create a new Cohort in the database
 * @returns {Cohort}
 */
export async function createCohort(name) {
  const createdCohort = await dbClient.cohort.create({
    data: { name: `${name}` }
  })

  return new Cohort(createdCohort.id, createdCohort.name)
}

export async function getAllCohorts() {
  const foundCohorts = await dbClient.cohort.findMany({})
  return foundCohorts
}

export async function getCohortById(Id) {
  const foundCohort = await dbClient.cohort.findUnique({
    where: { id: Id },
    include: { deliveryLogs: true, users: true }
  })
  return foundCohort
}

export async function updateCohortNameByID(Id, name) {
  const updateCohort = await dbClient.cohort.update({
    where: { id: Id },
    data: { name: name }
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
