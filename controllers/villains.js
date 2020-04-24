const models = require('../models')

const getAllVillains = async (request, response) => {
  const teams = await models.villains.findAll({ attributes: ['name', 'movie', 'slug'] })

  return response.send(teams)
}

const getVillainsBySlug = async (request, response) => {
  const { slug } = request.params

  const foundVillain = await models.villains.findOne({
    attributes: ['name', 'movie', 'slug'],
    where: { slug }
  })

  return response.send(foundVillain)
}

const saveNewVillain = async (request, response) => {
  const { name, movie, slug } = request.body

  if (!name || !movie || !slug) {
    return response.status(400).send('Required fields are: name, movie, slug')
  }

  const newVillain = { name, movie, slug }

  await models.villains.create(newVillain)

  return response.status(201).send(newVillain)
}

module.exports = { getAllVillains, getVillainsBySlug, saveNewVillain }
