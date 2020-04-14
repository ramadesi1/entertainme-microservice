const { ApolloServer, gql } = require('apollo-server')
const axios = require('axios')
const Redis = require('ioredis')
const redis = new Redis()

const typeDefs = gql`
  type Movie {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }
  type TVSerie {
    _id: ID
    title: String
    overview: String
    poster_path: String
    popularity: Float
    tags: [String]
  }
  type Query {
    movies: [Movie]!
    movie(id: ID!): Movie
    tvseries: [TVSerie]!
    tvserie(id: ID!): TVSerie
  }
  type Delete {
    _id: ID
  }
  type Mutation {
    addMovie(
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): Movie
    updateMovie(
      id: ID
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): Movie
    deleteMovie(id: ID): Delete
    addTVSerie(
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): TVSerie
    updateTVSerie(
      id: ID
      title: String
      overview: String
      poster_path: String
      popularity: Float
      tags: [String]
    ): TVSerie
    deleteTVSerie(id: ID): Delete
  }
`

const resolvers = {
  Query: {
    movies: async () => {
      const movies = await redis.get('movies')
      if (movies) {
        return JSON.parse(movies)
      }
      return axios.get(`http://localhost:3001/movies`).then(({ data }) => {
        return data.movies
      })
    },
    movie: (_, { id }) => {
      return axios
        .get(`http://localhost:3001/movies/${id}`)
        .then(({ data }) => {
          return data.movie
        })
    },
    tvseries: async () => {
      const tvSeries = await redis.get('tvSeries')
      if (tvSeries) {
        return JSON.parse(tvSeries)
      }
      return axios.get(`http://localhost:3002/tvseries`).then(({ data }) => {
        return data.tvSeries
      })
    },
    tvserie: (_, { id }) => {
      return axios
        .get(`http://localhost:3002/tvseries/${id}`)
        .then(({ data }) => {
          return data.tvSerie
        })
    },
  },
  Mutation: {
    addMovie: async (_, input) => {
      return axios
        .post(`http://localhost:3001/movies`, input)
        .then(({ data }) => {
          redis.del('movies')
          return data.movie
        })
    },
    updateMovie: async (_, input) => {
      return axios
        .put(`http://localhost:3001/movies/${input.id}`, input)
        .then(({ data }) => {
          redis.del('movies')
          return data.movie
        })
    },
    deleteMovie: async (_, input) => {
      return axios
        .delete(`http://localhost:3001/movies/${input.id}`)
        .then(({ data }) => {
          redis.del('movies')
          return data
        })
    },
    addTVSerie: async (_, input) => {
      return axios
        .post(`http://localhost:3002/tvseries`, input)
        .then(({ data }) => {
          redis.del('tvseries')
          return data.tvSerie[0]
        })
    },
    updateTVSerie: async (_, input) => {
      return axios
        .put(`http://localhost:3002/tvseries/${input.id}`, input)
        .then(({ data }) => {
          redis.del('tvseries')
          return data.tvSerie
        })
    },
    deleteTVSerie: async (_, input) => {
      return axios
        .delete(`http://localhost:3002/tvseries/${input.id}`)
        .then(({ data }) => {
          redis.del('tvseries')
          return data
        })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
