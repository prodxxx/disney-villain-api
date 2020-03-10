const Sequelize = require('sequelize')
const villainsModel = require('./villains')

const connection = new Sequelize('disney', 'villains', 'v1LL41n$', {
  host: 'localhost', dialect: 'mysql',
})

const villains = villainsModel(connection, Sequelize)

module.exports = { villains }
