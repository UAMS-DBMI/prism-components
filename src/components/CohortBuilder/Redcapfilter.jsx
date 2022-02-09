import React from 'react'
import './Redcapfilter.css'
import NumberRangeFilter from './NumberRangeFilter'
import RadioFilter from './RadioFilter'
import PropTypes from 'prop-types'

function RedcapFilter (props) {
  if (props.data.type === 'calc') {
    return <NumberRangeFilter data={props.data} remove={props.remove} fetch={props.fetch} />
  } else if (['radio', 'checkbox', 'dropdown'].includes(props.data.type)) {
    return <RadioFilter data={props.data} remove={props.remove} fetch={props.fetch} />
  }

  return (
    <div className='form_box'>
      <button onClick={() => props.remove(props.data.name)}>X</button>
      <span>Missing Type: {props.data.type}</span>
    </div>
  )
}

RedcapFilter.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  remove: PropTypes.function.isRequired,
  fetch: PropTypes.functoin.isRequired
}

export default RedcapFilter
