import React, { useState, useContext } from 'react'
import styles from './Redcapfilter.module.css'
import BarChart from './BarChart'
import PropTypes from 'prop-types'
import { ApiFetch } from '../../utils/ApiFetch'
import { ThreeDots } from 'react-loader-spinner'
import CloseButton from 'react-bootstrap/CloseButton'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

function NumberRangeFilter (props) {
  const [greaterThan, setGreaterThan] = useState('')
  const [lessThan, setLessThan] = useState('')
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(null)
  const [disableButton, setDisableButton] = useState(false)
  const apiFetch = useContext(ApiFetch)

  const fetchData = async () => {
    setDisableButton(true)
    setFetching(true)
    const url = '/semapi/data/' + props.data.api + '?'
    const params = new URLSearchParams()
    if (props.data.api === 'raw-calc') {
      params.set('name', props.data.name)
    }
    if (greaterThan !== '') params.set('min', greaterThan)
    if (lessThan !== '') params.set('max', lessThan)
    const data = await apiFetch(url + params)
    setData(data)
    setFetching(false)
    var cohort = []
    for (var key in data) {
      cohort = cohort.concat(data[key])
    }
    props.fetch(props.data.name, cohort)
  }

  let summary = <></>
  let totalCount = ''
  if (data !== null) {
    let patientCount = 0
    for (var col in data) {
      patientCount += data[col].length
    }
    totalCount = patientCount + ' total subjects'
    summary = <div><BarChart data={data} /></div>
  }

  return (
    <Form className={styles.form_box}>
      <CloseButton className={styles.remove_button} onClick={() => props.remove(props.data.name)} />
      <h4>{props.data.name}</h4>
      <p>{props.data.label}</p>
      <div className={styles.boxes}>
        <Form.Group as={Row}>
          <Form.Label column>Greater than or equal to</Form.Label>
          <Col sm={5}>
            <Form.Control
              type='number'
              value={greaterThan}
              onChange={(e) => {
                setDisableButton(false)
                setGreaterThan(e.target.value)
              }}
              placeholder='Greater than...'
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column>Less than or equal to</Form.Label>
          <Col sm={5}>
            <Form.Control
              type='number'
              value={lessThan}
              onChange={(e) => {
                setDisableButton(false)
                setLessThan(e.target.value)
              }}
              placeholder='Less than...'
            />
          </Col>
        </Form.Group>
      </div>
      <Form.Group as={Row}>
        <Col>
          <Button onClick={fetchData} disabled={disableButton}>Fetch Data</Button>
        </Col>
        <Col sm={4}>
          {fetching === true ? <ThreeDots color='green' height={30} width={30} /> : <></>}
          <span>{totalCount}</span>
        </Col>
      </Form.Group>
      <div>{summary}</div>
    </Form>
  )
}

NumberRangeFilter.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string,
    api: PropTypes.string
  }).isRequired,
  remove: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired
}

export default NumberRangeFilter
