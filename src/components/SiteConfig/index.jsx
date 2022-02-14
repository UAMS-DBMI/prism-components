import React from 'react'
import SiteConfig from './SiteConfig'
import { ApiFetch, fallbackFetch } from '../Utils/ApiFetch'
import PropTypes from 'prop-types'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

// From https://reactjs.org/docs/hooks-state.html
export default function SiteConfigComponent (props) {
  const api = fallbackFetch(props.api)
  return (
    <ApiFetch.Provider value={api}>
      <SiteConfig />
    </ApiFetch.Provider>
  )
}

SiteConfigComponent.propTypes = {
  api: PropTypes.func
}
