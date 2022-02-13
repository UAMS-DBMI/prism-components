import React from 'react'
import FacetBrowser from './FacetBrowser'
import initCornerstone from './initCornerstone.js'
import { ApiFetch, fallbackFetch } from '../Utils/ApiFetch'
import PropTypes from 'prop-types'

initCornerstone()

// From https://reactjs.org/docs/hooks-state.html
export default function FacetBrowserComponent (props) {
  const api = fallbackFetch(props.api)
  return (
    <ApiFetch.Provider value={api}>
      <FacetBrowser />
    </ApiFetch.Provider>
  )
}

FacetBrowserComponent.propTypes = {
  api: PropTypes.func
}
