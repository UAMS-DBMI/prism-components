import React from 'react'
import { render } from 'react-dom'
import Example from './components/Example'
import CohortBuilderComponent from './components/CohortBuilder'

const testFetch = async (url, opts = {}) => {
  if (Object.prototype.hasOwnProperty.call(opts, 'headers')) {
    opts.headers.append('Authorization', 'Basic ' + btoa('username:password'))
  }

  const response = await fetch(url, opts)
  return await response.json()
}

render(
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Example />
    <CohortBuilderComponent api={testFetch} />
  </div>, document.getElementById('root'))
