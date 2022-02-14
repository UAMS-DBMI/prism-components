import React, { useState, useContext } from 'react'
import { useFetch } from '../Utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import { ApiFetch } from '../Utils/ApiFetch'

export default function FileUploader (props) {
  const versions = useFetch(`/api/versions/${props.collection_slug}`)
  const [files, setFiles] = useState([])
  const [meta, setMeta] = useState('{}')
  const apiFetch = useContext(ApiFetch)

  if (versions == null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }

  if (versions.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading collection</h3>
        <p style={{ color: 'red' }}>Collection Manager API was unreachable</p>
      </>)
  }

  const firstVersion = versions[0].version_id

  const onMetaChange = (evt) => setMeta(evt.target.value)
  const onFileChange = (evt) => setFiles(evt.target.files)

  const updateCollectionManager = (resp) => {
    console.log(resp)
    const data = {
      collection_slug: props.collection_slug,
      data_manager_name: 'facet',
      external_id: resp.meta._id,
      mime: resp.meta._content_type
    }
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
    apiFetch('/api/files/import', opts)
      .then(data => console.log(data))
  }

  const onUploadClick = (evt) => {
    evt.preventDefault()
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const data = new FormData()
      data.append('file', file)
      data.append('meta', meta)
      const opts = {
        method: 'POST',
        body: data
      }
      apiFetch('/coreapi/import/file', opts)
        .then(updateCollectionManager)
    }
  }

  return (
    <Row className='mt-3'>
      <h5>Upload Files to v{firstVersion}</h5>
      <Form onSubmit={onUploadClick}>
        <Form.Group controlId='file' className='mb-3'>
          <Form.Label>Single File Upload</Form.Label>
          <Form.Control type='file' onChange={onFileChange} required multiple />
        </Form.Group>
        <Form.Group className='mb-3' controlId='meta'>
          <Form.Label>JSON Metadata</Form.Label>
          <Form.Control as='textarea' rows={3} onChange={onMetaChange} required defaultValue='{}' />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Upload
        </Button>
      </Form>
    </Row>
  )
}

FileUploader.propTypes = {
  collection_slug: PropTypes.string.isRequired
}
