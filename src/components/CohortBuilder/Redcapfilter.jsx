import React from 'react'
import styles from './Redcapfilter.module.css'
import NumberRangeFilter from './NumberRangeFilter'
import RadioFilter from './RadioFilter'
import PropTypes from 'prop-types'
import CloseButton from 'react-bootstrap/CloseButton'

function RedcapFilter (props) {
  if (props.data.type === 'calc') {
    return <NumberRangeFilter data={props.data} remove={props.remove} fetch={props.fetch} />
  } else if (['radio', 'checkbox', 'dropdown'].includes(props.data.type)) {
    return <RadioFilter data={props.data} remove={props.remove} fetch={props.fetch} />
  }

  return (
    <div className={styles.form_box}>
      <CloseButton onClick={() => props.remove(props.data.name)} />
      <span>Missing Type: {props.data.type}</span>
    </div>
  )
}

RedcapFilter.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  remove: PropTypes.func.isRequired,
  fetch: PropTypes.func.isRequired
}

export default RedcapFilter
