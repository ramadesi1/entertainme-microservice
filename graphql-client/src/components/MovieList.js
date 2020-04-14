import React from 'react'
import { useHistory } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

const MOVIES = gql`
  {
    movies {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

const DELETE_MOVIE = gql`
  mutation deleteMovie($id: ID) {
    deleteMovie(id: $id) {
      _id
    }
  }
`

export default function MovieList(props) {
  const { movies } = props
  const history = useHistory()

  function handleDetailClick(id) {
    history.push('/movies/' + id)
  }

  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    update(cache, { data: { deleteMovie } }) {
      const { movies } = cache.readQuery({ query: MOVIES })

      const newData = {
        movies: movies.filter((el) => el._id !== deleteMovie._id),
      }
      cache.writeQuery({
        query: MOVIES,
        data: newData,
      })
    },
  })

  function handleDeleteClick(id) {
    deleteMovie({ variables: { id } })
  }
  function handleAddClick() {
    history.push('/addmovie')
  }

  //     title
  //     overview
  //     poster_path
  //     popularity
  //     tags

  return (
    <>
      <div className="container">
        <button className="button is-primary" onClick={handleAddClick}>
          Add Movie
        </button>
      </div>
      <div className="container product-container">
        {movies.map((movie) => (
          <div className="card" key={movie._id}>
            <div className="card-image">
              <figure className="image is-4by3">
                <img src={movie.poster_path} alt={movie.title} />
              </figure>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content">
                  <p className="title">{movie.title}</p>
                  <p className="subtitle">{movie.overview}</p>
                  <p className="subtitle">
                    Tags: {movie.tags && movie.tags.join(', ')}
                  </p>
                </div>
              </div>
              <div className="content">
                <div className="buttons">
                  <button
                    className="button is-info is-outlined"
                    onClick={() => handleDetailClick(movie._id)}
                  >
                    Detail
                  </button>
                  <button
                    className="button is-danger is-outlined"
                    onClick={() => handleDeleteClick(movie._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
