import React from 'react'
import CollectionTable from './CollectionTable'
import { ApiFetch, fallbackFetch } from '../Utils/ApiFetch'
import PropTypes from 'prop-types'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

// From https://reactjs.org/docs/hooks-state.html
export default function CollectionTableComponent (props) {
  const api = fallbackFetch(props.api)
  return (
    <ApiFetch.Provider value={api}>
      <CollectionTable />
    </ApiFetch.Provider>
  )
}

CollectionTableComponent.propTypes = {
  api: PropTypes.func
}
