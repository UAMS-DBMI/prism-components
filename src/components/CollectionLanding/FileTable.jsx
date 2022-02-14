import React from 'react'
import { useFetch } from '../Utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'

export default function FileTable (props) {
  const files = useFetch(`/api/files/${props.collection_slug}/${props.version_id}`)

  if (files == null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }

  if (files.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading files</h3>
        <p style={{ color: 'red' }}>Collection Manager API was unreachable</p>
      </>)
  }

  const fileRows = files.map(file =>
    <tr key={file.file_id}>
      <td>{file.external_id}</td>
      <td>{file.mime_type}</td>
      <td>{file.data_manager_name}</td>
    </tr>
  )

  return (
    <Table>
      <thead>
        <tr>
          <th>External ID</th>
          <th>MIME Type</th>
          <th>Data Manager Name</th>
        </tr>
      </thead>
      <tbody>
        {fileRows}
      </tbody>
    </Table>
  )
}

FileTable.propTypes = {
  collection_slug: PropTypes.string.isRequired,
  version_id: PropTypes.number.isRequired
}
