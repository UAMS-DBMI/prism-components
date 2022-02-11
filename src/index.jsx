import React from 'react'
import { render } from 'react-dom'
import Example from './components/Example'
import CohortBuilderComponent from './components/CohortBuilder'

const testFetch = async (url, opts = {}) => {
  const apiOpts = {
    headers: new Headers({
      Authorization: 'Basic ' + btoa('username:password')
    })
  }
  opts = Object.assign(opts, apiOpts)
  const response = await fetch(url, opts)
  return await response.json()
}

render(
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Example />
    <CohortBuilderComponent api={testFetch} />
  </div>, document.getElementById('root'))
