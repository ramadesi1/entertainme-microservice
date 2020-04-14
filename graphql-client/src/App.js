import React from 'react'
import './App.css'
import { Switch, Route } from 'react-router-dom'
import Header from './components/Header'
import TVSeries from './views/TVSeries'
import TVSerie from './views/TVSerie'
import Movie from './views/Movie'
import Movies from './views/Movies'
import AddMovie from './views/AddMovie'
import AddTVSerie from './views/AddTVSerie'

function App() {
  return (
    <div className="container">
      <Header />
      <Switch>
        <Route path="/" exact>
          <Movies />
        </Route>
        <Route path="/movies/:id" exact>
          <Movie />
        </Route>
        <Route path="/tvseries" exact>
          <TVSeries />
        </Route>
        <Route path="/tvseries/:id" exact>
          <TVSerie />
        </Route>
        <Route path="/addmovie" exact>
          <AddMovie />
        </Route>
        <Route path="/addtvserie" exact>
          <AddTVSerie />
        </Route>
      </Switch>
    </div>
  )
}

export default App
