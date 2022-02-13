import React, { useState } from 'react'
import { mongoOr } from './util'
import styles from './Checkbox.module.css'
import PropTypes from 'prop-types'

const CheckboxFilter = (props) => {
  const [checked, updateChecked] = useState([])

  if (props.values === undefined) {
    return <div><h4>{props.name}</h4></div>
  }

  const valueSelected = (callback, value) => {
    const newArr = checked.slice()
    const index = newArr.indexOf(value)
    if (index > -1) {
      // remove from cart
      newArr.splice(index, 1)
    } else {
      // add to card
      newArr.push(value)
    }
    updateChecked(newArr)
    callback(props.name, mongoOr(props.name, newArr))
  }

  function cleanName (name) {
    const ret = name.replace(/_/gi, ' ')
    return ret
  }

  return (
    <div className={styles.filterBox}>
      <h4 className={styles.filterName}>{cleanName(props.name)}</h4>
      <div className={styles.fitlerRowContainer}>
        {props.values.map((value) =>
          <div className={styles.filterRow} key={value} data-testid={value + '_row'}>
            <label>{value}</label>
            <input type='checkbox' onChange={() => valueSelected(props.onChange, value)} />
          </div>
        )}
      </div>
    </div>
  )
}

CheckboxFilter.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.str,
  values: PropTypes.array
}

export default CheckboxFilter
