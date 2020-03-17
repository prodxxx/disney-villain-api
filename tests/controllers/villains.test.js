/* eslint-disable max-len */
const {
  afterEach, before, beforeEach, describe, it
} = require('mocha')
const { createSandbox } = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const { listOfVillains, singleVillain } = require('../mocks/villains')
const models = require('../../models')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - Villains', () => {
  let response
  let sandbox
  let stubbedCreate
  let stubbedFindOne
  let stubbedFindAll
  let stubbedSend
  let stubbedSendStatus
  let stubbedStatus
  let stubbedStatusDotSend

  before(() => {
    sandbox = createSandbox()

    stubbedCreate = sandbox.stub(models.villains, 'create')
    stubbedFindAll = sandbox.stub(models.villains, 'findAll')
    stubbedFindOne = sandbox.stub(models.villains, 'findOne')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatus = sandbox.stub()
    stubbedStatusDotSend = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })

  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusDotSend })
  })

  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllVillains', () => {
    it('gets a list of all villains from the database and sends the JSON using response.send()', async () => {
      stubbedFindAll.returns(listOfVillains)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.been.calledWith({ attributes: ['name', 'movie', 'slug'] })
      expect(stubbedSend).to.have.been.calledWith(listOfVillains)
    })

    it('responds with a 500 status and error message with the database call throws an error', async () => {
      stubbedFindAll.throws('ERROR!')

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.been.calledWith({ attributes: ['name', 'movie', 'slug'] })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve villains, please try again')
    })
  })

  describe('getVillainBySlug', () => {
    it('retrieves the villain associated with the slug sent from the database and sends the JSON using response.send()', async () => {
      stubbedFindOne.returns(singleVillain)
      const request = { params: { slug: 'maleficent' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'maleficent' }, attributes: ['name', 'movie', 'slug'] })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })

    it('responses with a 404 status when no matching villain is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { slug: 'not-found' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'not-found' }, attributes: ['name', 'movie', 'slug'] })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

    it('responds with a 500 status and error message with the database call throws an error', async () => {
      stubbedFindOne.throws('ERROR!')
      const request = { params: { slug: 'throw-error' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'throw-error' }, attributes: ['name', 'movie', 'slug'] })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve villain, please try again')
    })
  })

  describe('saveNewVillain', () => {
    it('creates a new villain database record from the data provided and responds with a 200 status and the new record', async () => {
      stubbedCreate.returns(singleVillain)
      const request = { body: { name: 'Maleficent', movie: 'Sleeping Beauty', slug: 'maleficent', } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith({ name: 'Maleficent', movie: 'Sleeping Beauty', slug: 'maleficent', })
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(singleVillain)
    })

    it('responds with a 400 status and error message when not all required data is provided', async () => {
      const request = { body: { name: 'Maleficent', movie: 'Sleeping Beauty' } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been.calledWith('The following parameters are required: name, movie, slug')
    })

    it('responds with a 500 status and error message with the database call throws an error', async () => {
      stubbedCreate.throws('ERROR!')
      const request = { body: { name: 'Maleficent', movie: 'Sleeping Beauty', slug: 'maleficent', } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith({ name: 'Maleficent', movie: 'Sleeping Beauty', slug: 'maleficent', })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to create new villain, please try again')
    })
  })
})
