import React from 'react'
import { useFetch } from '../../utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'

function CollectionRow (props) {
  return (
    <tr>
      <td>{props.collection.collection_name}</td>
      <td>{props.collection.collection_slug}</td>
      <td>{props.collection.collection_doi}</td>
      <td>{props.collection.file_count}</td>
    </tr>)
}

CollectionRow.propTypes = {
  collection: PropTypes.shape({
    collection_name: PropTypes.string,
    collection_slug: PropTypes.string,
    collection_doi: PropTypes.string
  })
}

export default function CollectionTable () {
  const data = useFetch('/api/collections/')

  if (data == null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }

  if (data.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading collections</h3>
        <p style={{ color: 'red' }}>Collection Manager API was unreachable</p>
      </>)
  }

  console.log(data)

  return (
    <table id='collections'>
      <thead>
        <tr>
          <th>Collection Name</th>
          <th>Collection Slug</th>
          <th>Collection DOI</th>
          <th>File Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => <CollectionRow key={i} collection={row} />)}
      </tbody>
    </table>
  )
}
