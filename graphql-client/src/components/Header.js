import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <>
      <div className="container">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item">
              <strong>Entertain Me</strong>
            </a>

            <a
              role="button"
              className="navbar-burger burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <Link className="navbar-item" tag="a" to="/">
                Movies
              </Link>
              <Link className="navbar-item" tag="a" to="/tvseries">
                TV Series
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
