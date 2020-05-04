
const models = require('../models')

const getAllVillains = async (request, response) => {
  try {
    const villains = await models.villains.findAll()

    return villains ? response.send(villains) : response.status(500)
  } catch (error) {
    return response.status(500).send('Unable to retrieve villains, please try agin')
  }
}

const getVillainBySlug = async (request, response) => {
  try {
    const { slug } = request.params

    const foundVillain = await models.villains.findOne({
      attributes: ['name', 'movie', 'slug'],
      where: { slug }
    })

    return foundVillain
      ? response.send(foundVillain)
      : response.sendStatus(404)
  } catch (error) {
    return response.status(500).send('Unable to retrieve villain, please try agin')
  }
}

const saveNewVillain = async (request, response) => {
  try {
    const { name, movie, slug } = request.body

    if (!name || !movie || !slug) {
      return response.status(400).send('Required fields are: name, movie, slug')
    }

    const newVillain = await models.villains.create({ name, movie, slug })

    return response.status(201).send(newVillain)
  } catch (error) {
    return response.status(500).send('Unable to add villain, please try again')
  }
}

module.exports = { getAllVillains, getVillainBySlug, saveNewVillain }
