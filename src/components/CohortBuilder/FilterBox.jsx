import React, { useState, useEffect, useCallback } from 'react'
import styles from './CohortBuilder.module.css'
import PropTypes from 'prop-types'

function CategoryTableRow (props) {
  return (
    <tr className={styles.filter_row} onClick={() => props.added(props.data.name, null)}>
      <td>{props.data.name}</td>
      <td>{props.data.label}</td>
    </tr>
  )
}

CategoryTableRow.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  added: PropTypes.func
}

function TermTableRow (props) {
  return (
    <tr className={styles.filter_row} onClick={() => props.added(props.category, props.value)}>
      <td>{props.category}</td>
      <td>{props.label}</td>
      <td>{props.definition}</td>
    </tr>
  )
}

TermTableRow.propTypes = {
  category: PropTypes.string,
  label: PropTypes.string,
  definition: PropTypes.string,
  value: PropTypes.string,
  added: PropTypes.func
}

function FilterBox (props) {
  const [showBox, setShowBox] = useState(false)
  const [textFilter, setTextFilter] = useState('')

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) clearAll()
    //    if(event.keyCode === 13) try_enter();
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false)

    return () => {
      document.removeEventListener('keydown', escFunction, false)
    }
  }, [escFunction])

  const added = (category, uri) => {
    setShowBox(false)
    setTextFilter('')
    props.added(category, uri)
  }

  function clearAll () {
    setTextFilter('')
    setShowBox(false)
  }

  const categoryFilters = props.data.map(row =>
    <CategoryTableRow data={row} key={row.name} added={added} />
  )

  var filtersArr = []
  for (var category of props.data) {
    if ('choices' in category) {
      for (var choice of category.choices) {
        if (choice.label.toLowerCase().indexOf(textFilter.toLowerCase()) >= 0) {
          filtersArr.push({ category: category.name, label: choice.label, value: choice.value, definition: choice.definition })
        }
      }
    }
    if (category.name.toLowerCase().indexOf(textFilter.toLowerCase()) >= 0) {
      filtersArr.push({ category: category.name, label: category.name, value: '', definition: category.definition })
    }
  }
  const filters = filtersArr.map((row, i) =>
    <TermTableRow category={row.category} label={row.label} definition={row.definition} uri={row.value} key={i} added={added} />
  )

  /* function try_enter(){
    if(filtersArr.length === 1){
      added(filtersArr[0].category, filtersArr[0].value);
    }
  } */

  return (
    <div className={styles.filter_div}>
      <span className={styles.filter_type}>{props.must} Criteria</span>
      <div className={styles.filter_container}>
        <div className={styles.filter_spreader}>
          <div className={styles.filter_search_box}>
            <div className={styles.filter_form}>
              <input
                className={styles.filter_search_input}
                type='text'
                value={textFilter}
                onChange={(e) => {
                  setTextFilter(e.target.value)
                }}
                placeholder='Search Term...'
              />
              <svg className={styles.filter_button} viewBox='0 0 490 490'>
                <path fill='none' stroke='#000' strokeWidth='36' d='m280,278a153,153 0 1,0-2,2l170,170m-91-117 110,110-26,26-110-110' />
              </svg>
            </div>
            <span className={styles.explore_button} onClick={() => setShowBox(!showBox)}>
              <svg height='1em' width='1em' viewBox='0 0 512 512'>
                <path d='m478.387 321.984h-28.847l-51.232-62.619c-6.409-7.836-15.892-12.33-26.016-12.33h-106.292v-57.02h94.969c18.534 0 33.613-15.079 33.613-33.613v-66.359c0-18.534-15.079-33.613-33.613-33.613h-60.565c-5.522 0-10 4.478-10 10s4.478 10 10 10h60.565c7.507 0 13.613 6.106 13.613 13.613v66.359c0 7.507-6.106 13.613-13.613 13.613h-209.938c-7.507 0-13.613-6.106-13.613-13.613v-66.359c0-7.507 6.106-13.613 13.613-13.613h60.666c5.522 0 10-4.478 10-10s-4.478-10-10-10h-60.666c-18.534 0-33.613 15.079-33.613 33.613v66.359c0 18.534 15.079 33.613 33.613 33.613h94.969v57.02h-106.697c-10.124 0-19.606 4.494-26.015 12.329l-51.233 62.62h-28.442c-18.534 0-33.613 15.079-33.613 33.614v66.359c0 18.534 15.079 33.613 33.613 33.613h66.359c18.534 0 33.613-15.079 33.613-33.613v-66.359c0-18.534-15.079-33.613-33.613-33.613h-12.077l40.873-49.957c2.596-3.173 6.436-4.992 10.535-4.992h106.697v54.949h-23.18c-18.534 0-33.613 15.079-33.613 33.613v66.359c0 18.534 15.079 33.613 33.613 33.613h66.359c18.534 0 33.613-15.079 33.613-33.613v-66.359c0-18.534-15.079-33.613-33.613-33.613h-23.179v-54.949h106.292c4.1 0 7.939 1.819 10.536 4.993l40.872 49.956h-11.673c-18.534 0-33.613 15.079-33.613 33.613v66.359c0 18.534 15.079 33.613 33.613 33.613h66.359c18.534 0 33.613-15.079 33.613-33.613v-66.359c.001-18.535-15.078-33.614-33.612-33.614zm-364.801 33.614v66.359c0 7.507-6.106 13.613-13.613 13.613h-66.36c-7.507 0-13.613-6.106-13.613-13.613v-66.359c0-7.507 6.106-13.613 13.613-13.613h66.359c7.507-.001 13.614 6.106 13.614 13.613zm189.207 0v66.359c0 7.507-6.106 13.613-13.613 13.613h-66.36c-7.507 0-13.613-6.106-13.613-13.613v-66.359c0-7.507 6.106-13.613 13.613-13.613h66.359c7.508-.001 13.614 6.106 13.614 13.613zm189.207 66.359c0 7.507-6.106 13.613-13.613 13.613h-66.359c-7.507 0-13.613-6.106-13.613-13.613v-66.359c0-7.507 6.106-13.613 13.613-13.613h66.359c7.507 0 13.613 6.106 13.613 13.613z' />
                <path d='m246.77 70.25c2.067 5.039 8.028 7.494 13.05 5.41 5.03-2.087 7.501-8.014 5.41-13.051-2.091-5.036-8.012-7.509-13.06-5.42-5.024 2.079-7.488 8.045-5.4 13.061z' />
              </svg>
            </span>
          </div>
          <div className={styles.filter_results_container} style={{ display: (showBox ? 'flex' : 'none') }}>
            <button style={{ alignSelf: 'flex-end' }} onClick={() => clearAll()}>Close</button>
            <div className={styles.filter_list}>
              <table className={styles.filter_table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryFilters}
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.filter_results_container} style={{ display: (textFilter !== '' ? 'flex' : 'none') }}>
            <button style={{ alignSelf: 'flex-end' }} onClick={() => clearAll()}>Close</button>
            <div className={styles.filter_list}>
              <table className={styles.filter_table}>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Term</th>
                    <th>Definition</th>
                  </tr>
                </thead>
                <tbody>
                  {filters}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

FilterBox.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    api: PropTypes.string,
    choices: PropTypes.array,
    definition: PropTypes.string
  })).isRequired,
  added: PropTypes.func.isRequired,
  must: PropTypes.string.isRequired
}

export default FilterBox
