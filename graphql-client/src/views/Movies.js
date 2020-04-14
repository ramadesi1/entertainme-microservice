import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import MovieList from '../components/MovieList'

const FETCH_MOVIES = gql`
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

export default function Movies() {
  const { loading, error, data } = useQuery(FETCH_MOVIES)
  
  if (loading) {
    return <h1>Loading...</h1>
  }

  if (error) {
    return <h1>Error loading page...</h1>
  }

  return <MovieList movies={data.movies} />
}
