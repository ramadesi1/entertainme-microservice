import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'

const FETCH_TVSERIES = gql`
  {
    tvseries {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`

const ADD_MOVIE = gql`
  mutation addTVSerie(
    $title: String
    $overview: String
    $poster_path: String
    $popularity: Float
    $tags: [String]
  ) {
    addTVSerie(
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

export default function AddTVSerie() {
  const history = useHistory()
  const [title, setTitle] = useState('')
  const [overview, setOverview] = useState('')
  const [poster_path, setPosterPath] = useState('')
  const [popularity, setPopularity] = useState('')
  const [tags, setTags] = useState([])
  function handleCancelAdd() {
    history.push('/tvseries')
  }
  const [addTVSerie] = useMutation(ADD_MOVIE, {
    update(cache, { data: { addTVSerie } }) {
      const { tvseries } = cache.readQuery({ query: FETCH_TVSERIES })
      cache.writeQuery({
        query: FETCH_TVSERIES,
        data: { tvseries: tvseries.concat([addTVSerie]) },
      })
    },
  })
  function handleAddSubmit(e) {
    e.preventDefault()
    addTVSerie({
      variables: { title, overview, poster_path, popularity, tags },
    })
    history.push('/tvseries')
  }
  return (
    <>
      <form onSubmit={handleAddSubmit}>
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
              onChange={(e) => setPopularity(Number(e.target.value))}
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
              onChange={(e) => setTags(e.target.value.split(','))}
              placeholder="Tags"
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-primary">Add TVSerie</button>
          </div>
          <div className="control">
            <button onClick={handleCancelAdd} className="button is-light">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
