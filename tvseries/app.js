const express = require('express')
const assert = require('assert')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient

const Controller = require('./Controller')
const url = 'mongodb://localhost:27017'
const database = 'db-entertain-me'
const client = new MongoClient(url, { useUnifiedTopology: true })
const app = express()
const port = 3002

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

client.connect(function (err) {
  assert.equal(null, err)
  const db = client.db(database)
  app.use((req, res, next) => {
    req.db = db
    next()
  })

  app.get('/tvseries', Controller.findAll)
  app.get('/tvseries/:id', Controller.findOne)
  app.post('/tvseries', Controller.create)
  app.put('/tvseries/:id', Controller.update)
  app.delete('/tvseries/:id', Controller.delete)

  app.use((err, req, res, next) => {
    res.send(err)
  })
})

app.listen(port, () => console.log(`Listening on port ${port}!`))
