import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { render } from 'react-dom'
import CollectionTableComponent from './components/CollectionTable'
import CollectionLandingComponent from './components/CollectionLanding'
import CohortBuilderComponent from './components/CohortBuilder'
import 'bootstrap/dist/css/bootstrap.min.css'
import './site.css'
import Nav from 'react-bootstrap/Nav'

const testFetch = async (url, opts = {}) => {
  if (Object.prototype.hasOwnProperty.call(opts, 'headers')) {
    opts.headers.Authorization = 'Basic ' + btoa('username:password')
  }

  const response = await fetch(url, opts)
  return await response.json()
}

render(
  <React.StrictMode>
    <Router>
      <Nav>
        <Nav.Item><Nav.Link href='/collections'>Collections</Nav.Link></Nav.Item>
        <Nav.Item><Nav.Link href='/cohort_builder'>Cohort Builder</Nav.Link></Nav.Item>
      </Nav>
      <div className='App'>
        <Switch>
          <Route
            path='/collection/:collection_slug'
            render={props => (
              <CollectionLandingComponent api={testFetch} collection_slug={props.match.params.collection_slug} />
            )}
          />
          <Route path='/collections'>
            <CollectionTableComponent api={testFetch} />
          </Route>
          <Route path='/cohort_builder'>
            <CohortBuilderComponent api={testFetch} />
          </Route>
          <Route path='/'>
            <div>PRISM React Components Testing Environment</div>
          </Route>
        </Switch>
      </div>
    </Router>
  </React.StrictMode>, document.getElementById('root'))
