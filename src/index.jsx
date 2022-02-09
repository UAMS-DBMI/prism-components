import React from 'react'
import { render } from 'react-dom'
import Example from './components/Example'
import CohortBuilderComponent from './components/CohortBuilder'

render(
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Example />
    <CohortBuilderComponent />
  </div>, document.getElementById('root'))
