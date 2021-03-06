import React from 'react'
import CohortBuilder from './CohortBuilder'
import { ApiFetch, fallbackFetch } from '../Utils/ApiFetch'
import PropTypes from 'prop-types'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

// From https://reactjs.org/docs/hooks-state.html
export default function CohortBuilderComponent (props) {
  const api = fallbackFetch(props.api)
  return (
    <ApiFetch.Provider value={api}>
      <CohortBuilder />
    </ApiFetch.Provider>
  )
}

CohortBuilderComponent.propTypes = {
  api: PropTypes.func
}
