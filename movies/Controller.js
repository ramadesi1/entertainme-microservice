const ObjectId = require('mongodb').ObjectId

class Controller {
  static findAll(req, res, next) {
    const collection = req.db.collection('movies')
    collection
      .find({})
      .toArray()
      .then((movies) => {
        res.status(200).json({ movies })
      })
      .catch(next)
  }
  static findOne(req, res, next) {
    const id = req.params.id
    const collection = req.db.collection('movies')
    collection
      .findOne({ _id: ObjectId(id) })
      .then((movie) => {
        res.status(200).json({ movie })
      })
      .catch(next)
  }
  static create(req, res, next) {
    const { title, overview, poster_path, popularity, tags } = req.body
    const collection = req.db.collection('movies')

    const data = {
      title,
      overview,
      poster_path,
      popularity,
      tags,
    }
    collection
      .insertOne(data)
      .then((result) => {
        res.status(201).json({ movie: result.ops })
      })
      .catch(next)
  }

  static update(req, res, next) {
    const { title, overview, poster_path, popularity, tags } = req.body
    const collection = req.db.collection('movies')

    const query = {
      _id: ObjectId(req.params.id),
    }

    const newValues = {
      $set: { title, overview, poster_path, popularity, tags },
    }
    collection
      .findOneAndUpdate(query, newValues, { returnOriginal: false })
      .then((result) => {
        res.status(200).json({ movie: result.value })
      })
      .catch(next)
  }

  static delete(req, res, next) {
    const collection = req.db.collection('movies')

    const query = {
      _id: ObjectId(req.params.id),
    }
    collection
      .deleteOne(query)
      .then((_) => {
        const data = {
          _id: req.params.id,
          msg: 'Movie deleted!',
          status: 200,
        }
        res.status(200).json(data)
      })
      .catch(next)
  }
}

module.exports = Controller
