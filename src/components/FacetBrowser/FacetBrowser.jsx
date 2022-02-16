import React, { useState, useEffect } from 'react'
import styles from './FacetBrowser.module.css'
import CheckboxFilter from './CheckboxFilter'
import SearchFilter from './SearchFilter'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import File from './File'

function FacetBrowser () {
  const [itemsInCart, setCart] = useState([])
  const [searchFilter, setFilter] = useState({})
  const [files, setFiles] = useState(null)
  const [fileCount, setFileCount] = useState(null)
  const [stale, setStale] = useState(true)
  const [loading, setLoading] = useState(false)

  function searchParams () {
    const searchParams = new URLSearchParams()
    const meta = {}
    const clauses = []
    for (const key in searchFilter) {
      if (searchFilter[key]) {
        clauses.push(searchFilter[key])
      }
    }
    if (clauses.length > 0) {
      meta.$and = clauses
    }
    searchParams.set('meta', JSON.stringify(meta))
    setLoading(true)
    return searchParams.toString()
  }

  async function fetchFiles () {
    const opts = {
      redirect: 'follow',
      method: 'GET'
    }
    const url = '/coreapi/search/?'
    const countUrl = '/coreapi/search/count?'
    setLoading(true)
    const params = searchParams()
    const response = await fetch(url + params, opts)
    const countResponse = await fetch(countUrl + params, opts)
    setFileCount(await countResponse.json())
    setFiles(await response.json())
    setStale(false)
    setLoading(false)
  }

  useEffect(() => {
    if (stale && !loading) fetchFiles()
  })

  const toggleCart = (fileId) => {
    console.log(fileId)
    const oldCart = itemsInCart.slice()
    const index = oldCart.indexOf(fileId)
    if (index > -1) {
      // remove from cart
      oldCart.splice(index, 1)
    } else {
      // add to card
      oldCart.push(fileId)
    }
    setCart(oldCart)
  }

  const updateFilter = (name, filter) => {
    console.log(filter)
    const newFilter = { ...searchFilter }
    newFilter[name] = filter
    setFilter(newFilter)
    setStale(true)
  }

  const fileList = () => {
    if (loading) {
      return <tr><td>Loading....</td></tr>
    }
    if (!files) {
      return <tr><td>No Files</td></tr>
    }
    return files.map((file) => {
      const inCart = itemsInCart.indexOf(file._id) > -1
      return <File key={file._id} file={file} inCart={inCart} toggleCart={toggleCart} />
    })
  }

  const items = itemsInCart.join(',')
  const downloadLink = '/coreapi/zip/zip?file_ids=' + items

  return (
    <Container className='mt-3'>
      <Row>
        <Col>
          <div className={styles.container}>
            <div className={styles.filterBar}>
              <CheckboxFilter
                name='_content_type'
                values={[
                  'video/mp4',
                  'image/png',
                  'audio/x-wav',
                  'application/dicom',
                  'image/jpeg',
                  'image/tiff',
                  'video/webm'
                ]}
                onChange={updateFilter}
              />
              <SearchFilter
                name='prism_subject_id'
                onChange={updateFilter}
              />
            </div>
          </div>
        </Col>
        <Col>
          <div className={styles.file_list}>
            <h1>{fileCount} Files</h1>
            <Table>
              <tbody>
                {fileList()}
              </tbody>
            </Table>
          </div>
        </Col>
        <Col>
          <Button size='lg' href={downloadLink} disabled={itemsInCart.length === 0}>Download ({itemsInCart.length})</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default FacetBrowser
