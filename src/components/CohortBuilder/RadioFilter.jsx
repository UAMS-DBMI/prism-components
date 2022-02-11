import React, { useState, useContext } from 'react'
import styles from './Redcapfilter.module.css'
import barStyles from './mybarchart.module.css'
import PropTypes from 'prop-types'
import { ApiFetch } from '../../utils/ApiFetch'
import { ThreeDots } from 'react-loader-spinner'

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
  const apiFetch = useContext(ApiFetch)

  const handleFetch = async () => {
    setFetching(true)
    setDisableButton(true)
    const url = '/semapi/data/' + props.data.api + '?'
    const params = new URLSearchParams()
    const uris = Object.keys(filters).filter((uri) =>
      filters[uri].enabled
    )
    if (props.data.api.includes('raw')) {
      params.set('name', props.data.name)
    }
    if (props.data.api.includes('raw') && !props.data.api.includes('checkbox')) {
      const badUris = uris.map((uri) =>
        filters[uri].label
      )
      params.set('uris', badUris.join(','))
    } else {
      params.set('uris', uris.join(','))
    }
    const data = await apiFetch(url + params)
    setFetching(false)
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

  function checkBoxes (choices) {
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

  function barBoxes (choices, max) {
    return Object.keys(choices).map((choice) =>
      <tr key={choice}>
        <label title={choice}>
          <input
            type='checkbox'
            onClick={(e) => modifyFilter(choice, e.target.checked)}
            readOnly checked={choices[choice].enabled}
            value={choice}
          />
          {choices[choice].label}
        </label>
        {
          /* eslint-disable react/jsx-indent */
          /* eslint-disable indent */
          (choice in data)
          ? <td style={{ '--size': 'calc(' + data[choice].length + '/' + max + ')' }}>
            {data[choice].length}
            </td>
          : <></>
          /* eslint-enable react/jsx-indent */
          /* eslint-enable indent */
        }
      </tr>
    )
  }

  let input = checkBoxes(filters)

  let totalCount = ''
  const patientIds = new Set()
  if (data !== null) {
    let max = 0
    for (var key in data) {
      const count = data[key].length
      if (count > max) max = count
      for (var patientId of data[key]) {
        patientIds.add(patientId)
      }
    }
    totalCount = patientIds.size + ' unique subjects'
    input = (
      <table className={`${barStyles.my_charts_css} ${barStyles.bar}`}>
        <tbody>
          {barBoxes(filters, max)}
        </tbody>
      </table>)
  }

  return (
    <div className={styles.form_box}>
      <button className={styles.remove_button} onClick={() => props.remove(props.data.name)}>X</button>
      <h4>{props.data.name}</h4>
      <p>{props.data.label}</p>
      <div className={styles.boxes}>
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
      <div className={styles.fetch_button}>
        <button onClick={handleFetch} disabled={disableButton}>Fetch Data</button>
        {fetching === true ? <ThreeDots color='green' height={30} width={30} /> : <></>}
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
  remove: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired
}

export default RadioFilter
