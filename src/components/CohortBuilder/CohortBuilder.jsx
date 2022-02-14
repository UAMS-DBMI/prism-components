import React, { useState, useContext } from 'react'
import styles from './CohortBuilder.module.css'
import RedcapFilter from './Redcapfilter'
import FilterBox from './FilterBox'
import DataTable from './DataTable'
import { useFetch } from '../Utils/useFetch'
import DataLogo from './data_logo.svg'
import FilesLogo from './files_logo.svg'
import PersonLogo from './person_logo.svg'
import { ApiFetch } from '../Utils/ApiFetch'
import { ThreeDots } from 'react-loader-spinner'
import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Container from 'react-bootstrap/Container'

function CohortBuilder () {
  const [mustFilters, setMustFilters] = useState([])
  const [cannotFilters, setCannotFilters] = useState([])
  const [mustCohort, setMustCohort] = useState({})
  const [cannotCohort, setCannotCohort] = useState({})
  const [currentCohort, setCurrentCohort] = useState([])
  const [showCohort, setShowCohort] = useState(false)
  const [showCollections, setShowCollections] = useState(false)
  const [allData, setAllData] = useState({})
  const [cohortName, setCohortName] = useState('Unnamed')
  const [fetching, setFetching] = useState(false)

  const apiFetch = useContext(ApiFetch)

  const config = useFetch('/semapi/config')
  const metadata = useFetch('/semapi/collections')

  if (config === null || metadata === null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }
  if (config.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading config</h3>
        <p style={{ color: 'red' }}>Semantic API endpoint was unreachable</p>
      </>)
  }
  if (metadata.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading collections</h3>
        <p style={{ color: 'red' }}>Semantic API endpoint was unreachable</p>
      </>)
  }

  function resetAll () {
    setMustFilters([])
    setCannotFilters([])
    setMustCohort({})
    setCannotCohort({})
    setCurrentCohort([])
    setShowCohort(false)
    setShowCollections(false)
    setAllData({})
    setCohortName('Unnamed')
    setFetching(false)
  }

  function displayCohort () {
    setShowCohort(!showCohort)
    if (!showCohort) fetchAll(currentCohort)
  }

  const addMustFilter = (category, uri) => {
    if (mustFilters.indexOf(category) >= 0) return
    const newFilters = mustFilters.slice()
    newFilters.push(category)
    setMustFilters(newFilters)
  }

  const removeMustFilter = (name) => {
    const newFilters = mustFilters.filter((x) => x !== name)
    setMustFilters(newFilters)
    const newCohort = { ...mustCohort }
    delete newCohort[name]
    setMustCohort(newCohort)
    updateCurrentCohort(newCohort, cannotCohort)
  }

  const addCannotFilter = (category, uri) => {
    if (cannotFilters.indexOf(category) >= 0) return
    const newFilters = cannotFilters.slice()
    newFilters.push(category)
    setCannotFilters(newFilters)
  }

  const removeCannotFilter = (name) => {
    const newFilters = cannotFilters.filter((x) => x !== name)
    setCannotFilters(newFilters)
    const newCohort = { ...cannotCohort }
    delete newCohort[name]
    setCannotCohort(newCohort)
    updateCurrentCohort(mustCohort, newCohort)
  }

  function getData (name) {
    for (const row of config) {
      if (row.name === name) {
        return row
      }
    }
  }

  function intersect (a, b) {
    return new Set([...a].filter(i => b.has(i)))
  }

  function updateCurrentCohort (mustCohort, cannotCohort) {
    if (mustCohort.length === 0) {
      setCurrentCohort([])
      setShowCohort(false)
      setAllData({})
      return
    }
    const mustSets = []
    Object.keys(mustCohort).map((cohort) => mustSets.push(new Set(mustCohort[cohort])))
    var mustIntersection = new Set()
    if (Object.keys(mustCohort).length > 0) {
      mustIntersection = mustSets.reduce(intersect)
    }
    var cannotArrays = []
    for (var key in cannotCohort) {
      cannotArrays = cannotArrays.concat(cannotCohort[key])
    }
    const cannotUnion = new Set(cannotArrays)
    const finalCohort = Array.from(mustIntersection).filter(x => !cannotUnion.has(x))
    setCurrentCohort(finalCohort)
    setShowCohort(false)
    setAllData({})
    // fetchAll(finalCohort);
  }

  const addMustCohort = (name, patientIds) => {
    const newMustCohort = { ...mustCohort }
    newMustCohort[name] = patientIds
    setMustCohort(newMustCohort)
    updateCurrentCohort(newMustCohort, cannotCohort)
  }

  const addCannotCohort = (name, patientIds) => {
    const newCannotCohort = { ...cannotCohort }
    newCannotCohort[name] = patientIds
    setCannotCohort(newCannotCohort)
    updateCurrentCohort(mustCohort, newCannotCohort)
  }

  async function fetchAll (currentCohort) {
    setFetching(true)
    setAllData({})
    const url = '/semapi/data?'
    const opts = {
      method: 'POST',
      body: JSON.stringify(
        { patient_ids: currentCohort }
      ),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }
    const data = await apiFetch(url, opts)
    setFetching(false)
    setAllData(data)
  }

  const dUrl = '/semapi/data?'
  const dParams = new URLSearchParams()
  dParams.set('patient_ids', currentCohort.join(','))
  dParams.set('downloadFile', cohortName)
  const downloadLink = dUrl + dParams
  const disableDownload = downloadLink.length > 7000

  const mustFilterBoxes = mustFilters.map(row =>
    <RedcapFilter data={getData(row)} key={row} remove={removeMustFilter} fetch={addMustCohort} />
  )

  const cannotFilterBoxes = cannotFilters.map(row =>
    <RedcapFilter data={getData(row)} key={row} remove={removeCannotFilter} fetch={addCannotCohort} />
  )

  const params = new URLSearchParams()
  params.set('PatientCriteria', currentCohort.join(','))
  const nbiaLink = 'https://nbia.cancerimagingarchive.net/nbia-search/?' + params
  // const nbiaLink = 'https://portal.aries.uams.edu/nbia-search/?' + params;

  const allFeatures = metadata.features.map((feature) =>
    <th key={feature}>{feature.substr(18)}</th>
  )

  function xFromFeatures (allFeatures, myFeatures) {
    return allFeatures.map((feature) => {
      const x = myFeatures.indexOf(feature) >= 0

      return <td key={feature} className={styles.col_feature}>{x ? 'X' : ''}</td>
    }
    )
  }

  const conceptCount = config.reduce(function (sum, feature) {
    if (Object.keys(feature).includes('choices')) {
      return sum + feature.choices.length
    } else {
      return sum + 1
    }
  }, 0)

  return (
    <Container>
      <header className={styles.Beam_header}>
        <div className={styles.header_section} style={{ flexGrow: 0 }}>
          <h6 className='display-6'>Repository Overview</h6>
          <div className={styles.collection_info}>
            <div className={styles.collection_info_category}>
              <h6>Subjects</h6>
              <div className={styles.collection_icon_row}>
                <img className={styles.collection_icons} src={PersonLogo} alt='Person Icon' />
                <span>{metadata.total.toLocaleString()}</span>
              </div>
            </div>
            <div className={styles.collection_info_category}>
              <h6>Collections</h6>
              <div className={styles.collection_icon_row}>
                <img className={styles.collection_icons} src={FilesLogo} alt='Collection Icon' />
                <span>{metadata.collections.length}</span>
              </div>
            </div>
            <div className={styles.collection_info_category}>
              <h6>Concepts</h6>
              <div className={styles.collection_icon_row}>
                <img className={styles.collection_icons} src={DataLogo} alt='Data Icon' />
                <span>{conceptCount}</span>
              </div>
            </div>
          </div>
          <Button variant='outline-dark' className={styles.show_collection_button} onClick={() => setShowCollections(!showCollections)}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <svg className={styles.filter_button} viewBox='0 0 490 490'>
                <path fill='none' stroke='currentColor' strokeWidth='36' d='m280,278a153,153 0 1,0-2,2l170,170m-91-117 110,110-26,26-110-110' />
              </svg>
              <span>{showCollections ? 'Hide' : 'Show'} Collections</span>
            </div>
          </Button>
        </div>
        <div className={styles.header_section} style={{ flexGrow: 0 }}>
          <h6 className='display-6'>Current Cohort - {currentCohort.length} subjects</h6>
          <div style={{ display: 'flex' }}>
            <Button styles={{ height: '100%' }} variant='outline-dark' onClick={() => resetAll()}>
              <div className={styles.tallButton}>
                <svg version='1.1' viewBox='0 0 85 85' height='2em' width='2em' fill='currentColor'>
                  <g>
                    <path d='m32.5 4.999c-5.405 0-10.444 1.577-14.699 4.282l-5.75-5.75v16.11h16.11l-6.395-6.395c3.18-1.787 6.834-2.82 10.734-2.82 12.171 0 22.073 9.902 22.073 22.074 0 2.899-0.577 5.664-1.599 8.202l4.738 2.762c1.47-3.363 2.288-7.068 2.288-10.964 0-15.164-12.337-27.501-27.5-27.501z' />
                    <path d='m43.227 51.746c-3.179 1.786-6.826 2.827-10.726 2.827-12.171 0-22.073-9.902-22.073-22.073 0-2.739 0.524-5.35 1.439-7.771l-4.731-2.851c-1.375 3.271-2.136 6.858-2.136 10.622 0 15.164 12.336 27.5 27.5 27.5 5.406 0 10.434-1.584 14.691-4.289l5.758 5.759v-16.112h-16.111l6.389 6.388z' />
                  </g>
                </svg>
                <span>Reset Filters</span>
              </div>
            </Button>
            <Button
              variant='outline-dark'
              disabled={currentCohort.length === 0}
              onClick={() => displayCohort()}
            >
              <div className={styles.tallButton}>
                <svg className={styles.filter_button} viewBox='0 0 490 490' height='2em' width='2em' fill='currentColor'>
                  <path fill='none' stroke='currentColor' strokeWidth='36' d='m280,278a153,153 0 1,0-2,2l170,170m-91-117 110,110-26,26-110-110' />
                </svg>
                <span>{showCohort ? 'Hide' : 'Preview'} Subjects ({currentCohort.length})</span>
              </div>
            </Button>
            <Button
              href={downloadLink}
              variant='outline-dark'
              disabled={currentCohort.length === 0}
            >
              <div className={styles.tallButton}>
                <svg version='1.1' viewBox='0 0 20 20' height='2em' with='2em' fill='currentColor'>
                  <path
                    d='M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z'
                  />
                  <path
                    d='M7.646 11.854a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V1.5a.5.5 0 00-1 0v8.793L5.354 8.146a.5.5 0 10-.708.708l3 3z'
                  />
                </svg>
                <span>Download CSV ({currentCohort.length})</span>
              </div>
            </Button>
            <Button href={nbiaLink} variant='outline-dark' disabled={currentCohort.length === 0 || disableDownload}>
              <div className={styles.tallButton}>
                <svg
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  height='2em'
                  width='2em'
                >
                  <path
                    d='M.5 9.9a.5.5 0 01.5.5v2.5a1 1 0 001 1h12a1 1 0 001-1v-2.5a.5.5 0 011 0v2.5a2 2 0 01-2 2H2a2 2 0 01-2-2v-2.5a.5.5 0 01.5-.5z'
                  />
                  <path
                    d='M7.646 11.854a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L8.5 10.293V1.5a.5.5 0 00-1 0v8.793L5.354 8.146a.5.5 0 10-.708.708l3 3z'
                  />
                </svg>
                <span>{disableDownload ? 'Too Many Subjects' : 'Browse Files'}</span>
              </div>
            </Button>
          </div>
        </div>
      </header>
      {
        /* eslint-disable react/jsx-indent */
        /* eslint-disable indent */
        (showCollections === true)
          ? <Table striped bordered>
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Description</th>
                  <th>Count</th>
                  {allFeatures}
                </tr>
              </thead>
              <tbody>
                {metadata.collections.map((col) =>
                  <tr key={col.link}>
                    <td><a href={col.link}>{col.name}</a></td>
                    <td>{col.desc}</td>
                    <td>{col.count}</td>
                    {xFromFeatures(metadata.features, col.features)}
                  </tr>
                )}
              </tbody>
            </Table>
          : <></>
          /* eslint-enable react/jsx-indent */
          /* eslint-enable indent */
      }
      {
        /* eslint-disable react/jsx-indent */
        /* eslint-disable indent */
        (showCohort === true)
          ? <div className={styles.currentCohort}>
            {fetching
              ? <ThreeDots color='green' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
              : <>
                  <h3>Sample Records</h3>
                  <DataTable data={allData} />
                </>}
            </div>
          : <></>
          /* eslint-enable react/jsx-indent */
          /* eslint-enable indent */
      }
      <div className={styles.filters}>
        <div className={styles.filter_item_container}>
          <FilterBox must='Inclusion' data={config} added={addMustFilter} />
          {mustFilterBoxes}
        </div>
        <div className={styles.filter_item_container}>
          <FilterBox must='Exclusion' data={config} added={addCannotFilter} />
          {cannotFilterBoxes}
        </div>
      </div>
    </Container>
  )
}

export default CohortBuilder
