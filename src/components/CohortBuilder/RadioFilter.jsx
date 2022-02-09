import React, { useState } from 'react'
import './Redcapfilter.css'
import './mybarchart.css'
import PropTypes from 'prop-types'

function RadioFilter (props) {
  const startingFilters = {}
  if (props.data.choices) {
    for (const f of props.data.choices) {
      startingFilters[f.value] = { enabled: false, label: f.label }
    }
  }
  const [filters, setFilters] = useState(startingFilters)
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(null)
  const [disableButton, setDisableButton] = useState(true)
  const [allSelect, setAllSelect] = useState(false)

  const handleFetch = async () => {
    setFetching(true)
    setDisableButton(true)
    const url = '/api/data/' + props.data.api + '?'
    const params = new URLSearchParams()
    const uris = Object.keys(filters).filter((uri) =>
      filters[uri].enabled
    )
    if (props.data.api.includes('raw')) {
      params.set('name', props.data.name)
    }
    if (props.data.api.includes('raw') && !props.data.api.includes('checkbox')) {
      const bad_uris = uris.map((uri) =>
        filters[uri].label
      )
      params.set('uris', bad_uris.join(','))
    } else {
      params.set('uris', uris.join(','))
    }
    const response = await fetch(url + params)
    setFetching(false)
    const data = await response.json()
    setData(data)
    var cohort = []
    for (var key in data) {
      cohort = cohort.concat(data[key])
    }
    props.fetch(props.data.name, cohort)
  }

  function modifyFilter (choice, checked) {
    const newFilters = { ...filters }
    newFilters[choice].enabled = checked
    setDisableButton(true)
    for (var key in newFilters) {
      if (newFilters[key].enabled) {
        setDisableButton(false)
      }
    }
    setFilters(newFilters)
  }

  function toggleAll (toggle) {
    const newFilters = { ...filters }
    for (var key in newFilters) {
      newFilters[key].enabled = toggle
    }
    setDisableButton(false)
    setAllSelect(toggle)
    setFilters(newFilters)
  }

  function check_boxes (choices) {
    return Object.keys(choices).map((choice) =>
      <label key={choice} title={choice}>
        <input
          type='checkbox'
          onClick={(e) => modifyFilter(choice, e.target.checked)}
          readOnly checked={choices[choice].enabled}
          value={choice}
        />
        {choices[choice].label}
      </label>
    )
  }

  function bar_boxes (choices, max) {
    return Object.keys(choices).map((choice) =>
      <tr>
        <label key={choice} title={choice}>
          <input
            type='checkbox'
            onClick={(e) => modifyFilter(choice, e.target.checked)}
            readOnly checked={choices[choice].enabled}
            value={choice}
          />
          {choices[choice].label}
        </label>
        {choice in data
          ? <td style={{ '--size': 'calc(' + data[choice].length + '/' + max + ')' }}>
            {data[choice].length}
            </td>
          : <></>}
      </tr>
    )
  }

  let input = check_boxes(filters)

  let totalCount = ''
  const patient_ids = new Set()
  if (data !== null) {
    let max = 0
    for (var key in data) {
      const count = data[key].length
      if (count > max) max = count
      for (var patient_id of data[key]) {
        patient_ids.add(patient_id)
      }
    }
    totalCount = patient_ids.size + ' unique subjects'
    input = (<table className='my-charts-css bar reverse'>
      <tbody>
        {bar_boxes(filters, max)}
      </tbody>
    </table>)
  }

  return (
    <div className='form_box'>
      <button className='remove-button' onClick={() => props.remove(props.data.name)}>X</button>
      <h4>{props.data.name}</h4>
      <p>{props.data.label}</p>
      <div className='boxes'>
        <label>
          <input
            type='checkbox'
            style={{ alignSelf: 'flex-start' }}
            onClick={() => toggleAll(!allSelect)}
            readOnly checked={allSelect}
          />
          Toggle All
        </label>
        {input}
      </div>
      <div className='fetch-button'>
        <button onClick={this.handleFetch} disabled={disableButton}>Fetch Data</button>
        {fetching === true ? <span>...</span> : <></>}
        <span>{totalCount}</span>
      </div>
    </div>
  )
}

RadioFilter.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
    api: PropTypes.string,
    choices: PropTypes.array
  }).isRequired,
  remove: PropTypes.function.isRequired,
  fetch: PropTypes.functoin.isRequired
}

export default RadioFilter
