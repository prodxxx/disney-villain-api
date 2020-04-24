const express = require('express')
const bodyParser = require('body-parser')
const { getAllVillains, getVillainsBySlug, saveNewVillain } = require('./controllers/villains')

const app = express()

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainsBySlug)

app.post('/villains', bodyParser.json(), saveNewVillain)

app.listen(1337, () => {
  console.log('listening on port 1337...') // eslint-disable-line no-console
})
