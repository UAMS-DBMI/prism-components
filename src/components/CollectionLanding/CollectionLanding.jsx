import React, { useState, useContext } from 'react'
import { useFetch } from '../Utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'
import { TrixEditor } from 'react-trix'
import { ApiFetch } from '../Utils/ApiFetch'
import Button from 'react-bootstrap/Button'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import VersionAccordion from './VersionAccordion'
import 'trix/dist/trix'
import 'trix/dist/trix.css'

export default function CollectionLanding (props) {
  const collection = useFetch(`/api/collections/${props.collection_slug}`)
  const [trixHTML, setTrixHTML] = useState('')
  const [change, setChange] = useState(false)
  const [edit, setEdit] = useState(false)
  const apiFetch = useContext(ApiFetch)

  const handleChange = (html, text) => {
    setChange(true)
    setTrixHTML(html)
  }

  const handleEditorReady = (editor) => {
  }

  const startEdit = () => {
    setEdit(true)
  }

  const save = () => {
    if (change === false) {
      return
    }
    setEdit(false)
    setChange(false)
    collection.collection_description = trixHTML
    const opts = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ collection_description: trixHTML })
    }
    apiFetch(`/api/collections/${props.collection_slug}`, opts)
      .then(data => console.log(data))
  }

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
    <Container>
      <h1>{collection.collection_name}</h1>
      <Tabs defaultActiveKey='description'>
        <Tab eventKey='description' title='Description'>
          {
            /* eslint-disable react/jsx-indent */
            /* eslint-disable indent */
            (edit === false)
              ? <Row>
                  <Col dangerouslySetInnerHTML={{ __html: collection.collection_description }} />
                  <Col sm={1}>
                    <Button variant='outline-info' onClick={startEdit}>Edit</Button>
                  </Col>
                </Row>
              : <Row>
                  <Col>
                    <TrixEditor
                      onChange={handleChange}
                      onEditorReady={handleEditorReady}
                      value={collection.collection_description}
                    />
                  </Col>
                  <Col sm={1}>
                    <Button variant='success' onClick={save} disabled={change === false}>Save</Button>
                  </Col>
                </Row>
            /* eslint-enable react/jsx-indent */
            /* eslint-enable indent */
          }
        </Tab>
        <Tab eventKey='files' title='Files'>
          <VersionAccordion collection_slug={props.collection_slug} />
        </Tab>
      </Tabs>
    </Container>
  )
}

CollectionLanding.propTypes = {
  collection_slug: PropTypes.string.isRequired
}
