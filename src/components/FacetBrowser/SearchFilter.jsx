import React, { useState } from 'react'
import { mongoText } from './util'
import styles from './Checkbox.module.css'
import PropTypes from 'prop-types'

const SearchFilter = (props) => {
  const [textValue, setFilterText] = useState('')

  const callFilter = (e, callback, value) => {
    e.preventDefault()
    if (value) {
      callback(props.name, mongoText(props.name, value))
    } else {
      callback(props.name, null)
    }
  }

  const setFilter = (e) => {
    // console.log(event);
    // console.log("event " + event.target.value);
    setFilterText(e.target.value)
  }

  function cleanName (name) {
    const ret = name.replace(/_/gi, ' ')
    return ret
  }

  return (
    <form className={styles.filterBox}>
      <h4 className={styles.filterName}>{cleanName(props.name)}</h4>
      <div className={styles.fitlerRowContainer}>
        <input type='text' onChange={setFilter} data-testid='search-filter' />
        <button type='submit' onClick={(e) => callFilter(e, props.onChange, textValue)}>Filter</button>
      </div>
    </form>
  )
}

SearchFilter.propTypes = {
  name: PropTypes.str,
  onChange: PropTypes.func
}

export default SearchFilter
