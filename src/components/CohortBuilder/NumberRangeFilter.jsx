import React, { useState, useContext } from 'react'
import styles from './Redcapfilter.module.css'
import BarChart from './BarChart'
import PropTypes from 'prop-types'
import { ApiFetch } from '../../utils/ApiFetch'
import { ThreeDots } from 'react-loader-spinner'

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
    <div className={styles.form_box}>
      <button className={styles.remove_button} onClick={() => props.remove(props.data.name)}>X</button>
      <h4>{props.data.name}</h4>
      <p>{props.data.label}</p>
      <div className={styles.boxes}>
        <div className={styles.num_boxes}>
          <label>Greater than or equal to</label>
          <input
            type='number'
            value={greaterThan}
            onChange={(e) => {
              setDisableButton(false)
              setGreaterThan(e.target.value)
            }}
            placeholder='Greater than...'
          />
        </div>
        <div className={styles.num_boxes}>
          <label>Less than or equal to</label>
          <input
            type='number'
            value={lessThan}
            onChange={(e) => {
              setDisableButton(false)
              setLessThan(e.target.value)
            }}
            placeholder='Less than...'
          />
        </div>
      </div>
      <div className={styles.fetch_button}>
        <button onClick={fetchData} disabled={disableButton}>Fetch Data</button>
        {fetching === true ? <ThreeDots color='green' height={30} width={30} /> : <></>}
        <span>{totalCount}</span>
      </div>
      <div>{summary}</div>
    </div>
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
