import React, { useState, useContext } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'
import { ApiFetch } from '../Utils/ApiFetch'

export default function PathDBSync (props) {
  const [files, setFiles] = useState([])
  const [fetching, setFetching] = useState(false)
  const apiFetch = useContext(ApiFetch)

  const onSyncClick = () => {
    setFetching(true)
    apiFetch(`/api/files/sync/pathdb/${props.collection_slug}`)
      .then(data => {
        setFiles(data)
        setFetching(false)
      })
  }

  if (fetching === true) {
    return (<ThreeDots color='green' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />)
  }

  if (files.length === 0) {
    return (
      <Row className='mt-3'>
        <Button variant='primary' type='button' onClick={onSyncClick}>
          Sync
        </Button>
        <span>Enter your PathDB credentials in popup</span>
      </Row>)
  }

  const fileTableRows = files.map(row =>
    <tr key={row.image_id}>
      <td><a href={row.external_id} target='_'>{row.image_id}</a></td>
      <td>{row.subject_id}</td>
      <td>{row.study_id}</td>
    </tr>)

  return (
    <Table>
      <thead>
        <tr>
          <th>Image Id</th>
          <th>Subject Id</th>
          <th>Study Id</th>
        </tr>
      </thead>
      <tbody>{fileTableRows}</tbody>
    </Table>
  )
}

PathDBSync.propTypes = {
  collection_slug: PropTypes.string.isRequired
}
