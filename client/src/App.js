import './App.css'

import React, { Component } from 'react'
import TwitterLogin from 'react-twitter-auth'
import { Footer } from './components/Footer'
import { SearchBar } from './components/SearchBar'
import { BarBoxList } from './components/BarBoxList'
import { LoadingBarBoxList } from './components/LoadingBarBoxList'
import { connect } from 'react-redux'

const debounce = require('debounce')

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bars: [],
      isSearching: false
    }
  }

  handleSearch(term) {
    if (term.length >= 2) {
      this.setState({
        isSearching: true
      })
      fetch('http://ba-nightlife-app.herokuapp.com/api/bars/search/' + term)
        .then(response => response.json())
        .then(json => {
          this.setState({
            bars: json,
            isSearching: false
          })
        })
        .catch(e => e)
    }
  }

  render() {
    const searchBars = debounce(term => {
      this.handleSearch(term)
    }, 400)

    const twitter = !!this.props.isAuthenticated ? (
      <div>
        <ul>
          <li className="navbar-item">
            <div className="width-73"> </div>
            <button
              onClick={this.logout.bind(this)}
              className="button is-danger"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    ) : (
      <div className="navbar-item">
        <TwitterLogin
          className="button is-text no-text-decoration is-size-7 margin-top-minus-15"
          loginUrl="http://ba-nightlife-app.herokuapp.com/api/auth/twitter"
          onFailure={this.onFailed.bind(this)}
          onSuccess={this.onSuccess.bind(this)}
          requestTokenUrl="http://ba-nightlife-app.herokuapp.com/api/auth/twitter/reverse"
        />
      </div>
    )

    return (
      <div>
        <div className="header">
          <div className="level">
            <div className="level-left blank-left-space" />
            <div className="level-item has-text-centered">
              <div className="is-size-1 has-text-dark">Nightlife App</div>
            </div>
            <div className="level-right has-text-centered">{twitter}</div>
          </div>
          <div className="is-size-5 has-text-dark has-text-centered">
            <p>Search magic bars in your area!</p>
          </div>
        </div>

        <div className="container">
          <div className="">
            <SearchBar onSearchTermChange={searchBars} />
            {this.state.isSearching ? (
              <LoadingBarBoxList barNumber={[1, 2, 3, 4]} />
            ) : (
              <BarBoxList bars={this.state.bars} />
            )}
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  onSuccess(response) {
    const token = response.headers.get('x-auth-token')
    response.json().then(user => {
      if (token) {
        this.props.dispatch({
          type: 'LOGIN',
          user: {
            isAuthenticated: true,
            user: user,
            token: token
          }
        })
      }
    })
  }

  onFailed(error) {
    alert(error)
  }

  logout() {
    this.props.dispatch({ type: 'LOGOUT' })
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    token: state.token
  }
}

export default connect(mapStateToProps)(App)
