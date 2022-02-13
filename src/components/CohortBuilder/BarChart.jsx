import React from 'react'
import styles from './mybarchart.module.css'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'

function BarChart (props) {
  let max = 0
  const rows = []
  for (var key in props.data) {
    const count = props.data[key].length
    if (count > max) max = count
  }
  for (key in props.data) {
    const count = props.data[key].length
    rows.push(
      <tr className={styles.graphRow} key={key}>
        <td scope='row'>{key}</td>
        <td className={styles.graphWrap}>
          <div className={styles.graphBar} style={{ '--size': 'calc(' + count + '/' + max + ')' }}>{count}</div>
        </td>
      </tr>)
  }
  return (
    <Table className={`${styles.my_charts_css}`}>
      <thead>
        <tr>
          <th scope='col'>Age</th>
          <th scope='col'>Count</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </Table>
  )
}

BarChart.propTypes = {
  data: PropTypes.object.isRequired
}

export default BarChart
