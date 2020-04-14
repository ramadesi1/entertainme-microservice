import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import Loading from '../components/Loading'

const TVSERIES = gql`
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

const DELETE_TVSERIE = gql`
  mutation deleteTVSerie($id: ID) {
    deleteTVSerie(id: $id) {
      _id
    }
  }
`

export default function TVSerieList(props) {
  const { tvseries } = props
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  function handleDetailClick(id) {
    history.push('/tvseries/' + id)
  }

  const [deleteTVSerie] = useMutation(DELETE_TVSERIE, {
    update(cache, { data: { deleteTVSerie } }) {
      const { tvseries } = cache.readQuery({ query: TVSERIES })

      const newData = {
        tvseries: tvseries.filter((el) => el._id !== deleteTVSerie._id),
      }
      cache.writeQuery({
        query: TVSERIES,
        data: newData,
      })
      setLoading(false)
    },
  })

  function handleDeleteClick(id) {
    setLoading(true)
    deleteTVSerie({ variables: { id } })
  }
  function handleAddClick() {
    history.push('/addtvserie')
  }

  return (
    <>
      <div className="container">
        <button className="button is-primary" onClick={handleAddClick}>
          Add TVSerie
        </button>
      </div>
      <div className="container product-container">
        {tvseries.map((tvserie) => (
          <div className="card" key={tvserie._id}>
            <div className="card-image">
              <figure className="image is-4by3">
                <img src={tvserie.poster_path} alt={tvserie.title} />
              </figure>
            </div>
            <div className="card-content">
              <div className="media">
                <div className="media-content">
                  <p className="title">{tvserie.title}</p>
                  <p className="subtitle">{tvserie.overview}</p>
                  <p className="subtitle">Popularity: {tvserie.popularity}</p>
                  <p className="subtitle">
                    Tags: {tvserie.tags && tvserie.tags.join(', ')}
                  </p>
                </div>
              </div>
              <div className="content">
                <div className="buttons">
                  <button
                    className="button is-info is-outlined"
                    onClick={() => handleDetailClick(tvserie._id)}
                  >
                    Detail
                  </button>
                  <button
                    className="button is-danger is-outlined"
                    onClick={() => handleDeleteClick(tvserie._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && <Loading />}
      </div>
    </>
  )
}
