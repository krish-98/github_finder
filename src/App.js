import React, { Fragment, Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Search from './components/users/Search'
import Alert from './components/layout/Alert'
import Users from './components/users/Users'
import User from './components/users/User'
import About from './components/layout/pages/About'

import './App.css'

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  }

  // Search Github Users
  searchUsers = async text => {
    this.setState({ loading: true })

    const res = await fetch(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    const data = await res.json()

    this.setState({ users: data.items, loading: false })
  }

  // Get single Github user
  getUser = async username => {
    this.setState({ loading: true })

    const res = await fetch(`https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    const data = await res.json()

    this.setState({ user: data, loading: false })
  }

  // Get users repos
  getUserRepos = async username => {
    this.setState({ loading: true })

    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)
    const data = await res.json()

    this.setState({ repos: data, loading: false })
  }

  // Clear users from state
  clearUsers = () => this.setState({ users:[], loading: false })

  // Set Alert
  setAlert = (msg, type) => {
    this.setState({ alert: { msg: msg, type: type } })

    setTimeout(() => this.setState({ alert: null }), 7000)
  }

  render() {
    const { users, user, repos, loading, alert } = this.state

    return (
      <Router>
        <div className='App'>
          <Navbar title='Github Finder' icon='fab fa-github' />
          <div className='container'>
            <Alert alert={alert} />
            <Switch>
              <Route exact path='/' render={props => (
                <Fragment>
                  <Search 
                    searchUsers={this.searchUsers} 
                    clearUsers={this.clearUsers} 
                    showClear={users.length > 0 ? true : false}
                    setAlert={this.setAlert}
                  />
                  <Users loading={loading} users={users}/>
                </Fragment>
              )} />
              <Route exact path='/about' component={About} />
              <Route exact path='/user/:login' render={props => (
                <User 
                  { ...props } 
                  getUser={this.getUser} 
                  getUserRepos={this.getUserRepos} 
                  user={user} 
                  repos={repos}
                  loading={loading} 
                />
              )} />
            </Switch>
          </div>
        </div>
      </Router>
    ) 
  }
}

export default App