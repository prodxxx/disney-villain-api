const Sequalize = require('sequelize')
const villainsModel = require('./villains')

const connection = new Sequalize('disney', 'badguy', 'P4$$W0RD', {
  host: 'localhost', dialect: 'mysql'
})

const villains = villainsModel(connection, Sequalize)

module.exports = { villains }
