import React from 'react'
import styles from './DataTable.module.css'
import PropTypes from 'prop-types'

function DataTable (props) {
  if (Object.prototype.hasOwnProperty.call(props.data, 'columns') === false) {
    return <></>
  }

  const columns = props.data.columns
  const headers = columns.map((name, i) => <th key={'h' + i}>{name}</th>)

  const rows = props.data.data.map((row, ri) =>
    <tr key={'row' + ri}>
      {row.map((value, i) => <td key={'r' + ri + 'i' + i}>{value}</td>)}
    </tr>)
  return (
    <table className={styles.data_table}>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

DataTable.propTypes = {
  data: PropTypes.shape({
    columns: PropTypes.array.isRequired,
    data: PropTypes.arrayOf(PropTypes.array)
  })
}

export default DataTable
