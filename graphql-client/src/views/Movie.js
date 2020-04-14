import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { ApolloConsumer } from 'react-apollo'
import { useMutation } from '@apollo/react-hooks'
import { useHistory } from 'react-router-dom'

const UPDATE_MOVIE = gql`
  mutation updateMovie(
    $id: ID!
    $title: String
    $overview: String
    $poster_path: String
    $popularity: Float
    $tags: [String]
  ) {
    updateMovie(
      id: $id
      title: $title
      overview: $overview
      poster_path: $poster_path
      popularity: $popularity
      tags: $tags
    ) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

const GET_MOVIE_DETAILS = gql`
  query movieDetails($movieId: ID!) {
    movie(id: $movieId) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

export default function MovieDetail() {
  const { id } = useParams()
  const history = useHistory()

  const { data, loading, error } = useQuery(GET_MOVIE_DETAILS, {
    variables: { movieId: id },
  })

  const [updateMovie] = useMutation(UPDATE_MOVIE, {
    update(cache, { data: { updateMovie } }) {
      cache.writeQuery({
        query: GET_MOVIE_DETAILS,
        data: { movie: updateMovie },
      })
    },
  })

  const [edit, setEdit] = useState(false)
  const [_id, setId] = useState('')
  const [title, setTitle] = useState('')
  const [overview, setOverview] = useState('')
  const [poster_path, setPosterPath] = useState('')
  const [popularity, setPopularity] = useState('')
  const [tags, setTags] = useState([])

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error loading page...</h1>
  }

  function handleBackClick() {
    history.push('/')
  }
  function onMovieFetched(movie) {
    if (!edit) {
      setId(movie._id)
      setTitle(movie.title)
      setOverview(movie.overview)
      setPosterPath(movie.poster_path)
      setPopularity(movie.popularity)
      setTags(movie.tags)
    }
    setEdit(!edit)
  }

  function handleUpdateSubmit(e) {
    e.preventDefault()
    updateMovie({
      variables: { id: _id, title, overview, poster_path, popularity, tags },
    })
    onMovieFetched()
  }

  return (
    <>
      <ApolloConsumer>
        {(client) => (
          <div className="container">
            <div className="columns">
              <div className="column is-one-third">
                <img src={data.movie.poster_path} alt={data.movie.title} />
              </div>
              <div className="column is-two-third">
                <div className="card">
                  <header className="card-header">
                    <p className="card-header-title">Movie Detail</p>
                  </header>
                  <div className="card-content">
                    {edit === false ? (
                      <>
                        <div className="content">
                          <p className="title">{data.movie.title}</p>
                          <p className="subtitle">{data.movie.overview}</p>
                          <p className="subtitle">
                            <strong>
                              Tags:{' '}
                              {data.movie.tags
                                ? data.movie.tags.join(', ')
                                : ''}
                            </strong>
                          </p>
                          <br />
                        </div>
                        <div className="buttons">
                          <button
                            className="button is-primary"
                            onClick={async () => {
                              const { data } = await client.query({
                                query: GET_MOVIE_DETAILS,
                                variables: { movieId: id },
                              })
                              onMovieFetched(data.movie)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="button is-secondary"
                            onClick={handleBackClick}
                          >
                            Back
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <form onSubmit={handleUpdateSubmit}>
                          <div className="field">
                            <label className="label">Title</label>
                            <div className="control">
                              <input
                                className="input"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                              />
                            </div>
                          </div>
                          <div className="field">
                            <label className="label">Overview</label>
                            <div className="control">
                              <input
                                className="input"
                                type="text"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                placeholder="Overview"
                              />
                            </div>
                          </div>
                          <div className="field">
                            <label className="label">Poster Path</label>
                            <div className="control">
                              <input
                                className="input"
                                type="text"
                                value={poster_path}
                                onChange={(e) => setPosterPath(e.target.value)}
                                placeholder="Poster Path"
                              />
                            </div>
                          </div>
                          <div className="field">
                            <label className="label">Popularity</label>
                            <div className="control">
                              <input
                                className="input"
                                type="number"
                                value={popularity}
                                onChange={(e) => setPopularity(e.target.value)}
                                placeholder="Popularity"
                              />
                            </div>
                          </div>
                          <div className="field">
                            <label className="label">Tags</label>
                            <div className="control">
                              <input
                                className="input"
                                type="text"
                                value={tags.join(',')}
                                onChange={(e) =>
                                  setTags(e.target.value.split(','))
                                }
                                placeholder="Tags"
                              />
                            </div>
                          </div>

                          <div className="field is-grouped">
                            <div className="control">
                              <button className="button is-primary">
                                Update
                              </button>
                            </div>
                            <div className="control">
                              <button
                                onClick={onMovieFetched}
                                className="button is-light"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </ApolloConsumer>
    </>
  )
}
