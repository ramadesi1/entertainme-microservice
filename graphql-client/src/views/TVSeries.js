import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import TVSerieList from '../components/TVSerieList'
import Loading from '../components/Loading'

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

export default function TVSeries() {
  const { loading, error, data } = useQuery(FETCH_TVSERIES)

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <h1>Error loading page...</h1>
  }

  return <TVSerieList tvseries={data.tvseries} />
}
