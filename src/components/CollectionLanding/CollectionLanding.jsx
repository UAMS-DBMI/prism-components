import React from 'react'
import { useFetch } from '../../utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'

export default function CollectionLanding (props) {
  const collection = useFetch(`/api/collections/${props.collection_slug}`)

  if (collection == null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }

  if (collection.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading collection</h3>
        <p style={{ color: 'red' }}>Collection Manager API was unreachable</p>
      </>)
  }

  return (
    <div>
      <h1>{collection.collection_name}</h1>
    </div>
  )
}

CollectionLanding.propTypes = {
  collection_slug: PropTypes.string.isRequired
}
