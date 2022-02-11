import React from 'react'
import CollectionTable from './CollectionTable'
import { ApiFetch, fallbackFetch } from '../../utils/ApiFetch'
import PropTypes from 'prop-types'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

// From https://reactjs.org/docs/hooks-state.html
export default function CohortBuilderComponent (props) {
  const api = fallbackFetch(props.api)
  return (
    <ApiFetch.Provider value={api}>
      <CollectionTable />
    </ApiFetch.Provider>
  )
}

CohortBuilderComponent.propTypes = {
  api: PropTypes.func
}
