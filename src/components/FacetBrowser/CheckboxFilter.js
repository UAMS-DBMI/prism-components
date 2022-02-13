import React, { useState } from 'react'
import { mongoOr } from './util'
import './Checkbox.css'

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

  function clean_name (name) {
    const ret = name.replace(/_/gi, ' ')
    return ret
  }

  return (
    <div className='filterBox'>
      <h4 className='filterName'>{clean_name(props.name)}</h4>
      <div className='fitlerRowContainer'>
        {props.values.map((value) =>
          <div className='filterRow' key={value} data-testid={value + '_row'}>
            <label>{value}</label>
            <input type='checkbox' onChange={() => valueSelected(props.onChange, value)} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckboxFilter
