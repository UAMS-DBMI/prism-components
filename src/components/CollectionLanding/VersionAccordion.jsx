import React from 'react'
import { useFetch } from '../Utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'
import Accordion from 'react-bootstrap/Accordion'
import Table from 'react-bootstrap/Table'
import FileTable from './FileTable'

export default function VersionAccordion (props) {
  const versions = useFetch(`/api/versions/${props.collection_slug}`)

  if (versions == null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }

  if (versions.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading collection</h3>
        <p style={{ color: 'red' }}>Collection Manager API was unreachable</p>
      </>)
  }

  const firstVersion = versions[0].version_id

  const AccordionItems = versions.map(version =>
    <Accordion.Item eventKey={version.version_id} key={version.version_id}>
      <Accordion.Header>
        <Table borderless>
          <tbody>
            <tr>
              <td>v{version.version_id}</td>
              <td>{version.name}</td>
              <td>{version.description}</td>
              <td>{version.created_on}</td>
            </tr>
          </tbody>
        </Table>
      </Accordion.Header>
      <Accordion.Body>
        <FileTable collection_slug={props.collection_slug} version_id={version.version_id} />
      </Accordion.Body>
    </Accordion.Item>
  )

  return (
    <Accordion defaultActiveKey={firstVersion}>
      {AccordionItems}
    </Accordion>
  )
}

VersionAccordion.propTypes = {
  collection_slug: PropTypes.string.isRequired
}
