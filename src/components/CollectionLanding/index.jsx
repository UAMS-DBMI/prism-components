import React from 'react'
import CollectionLanding from './CollectionLanding'
import { ApiFetch, fallbackFetch } from '../Utils/ApiFetch'
import PropTypes from 'prop-types'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

// From https://reactjs.org/docs/hooks-state.html
export default function CollectionLandingComponent (props) {
  const api = fallbackFetch(props.api)
  return (
    <ApiFetch.Provider value={api}>
      <CollectionLanding collection_slug={props.collection_slug} />
    </ApiFetch.Provider>
  )
}

CollectionLandingComponent.propTypes = {
  api: PropTypes.func,
  collection_slug: PropTypes.string.isRequired
}
