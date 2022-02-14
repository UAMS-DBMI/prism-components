import React from 'react'
import { useFetch } from '../Utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Container from 'react-bootstrap/Container'

export default function SiteConfig () {
  const config = useFetch('/api/config')

  if (config == null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }

  if (config.detail === 'Not Found') {
    return (
      <Container className='mt-3'>
        <h3>Error loading config</h3>
        <p style={{ color: 'red' }}>Collection Manager API was unreachable</p>
      </Container>)
  }

  return (
    <Container>
      <h1>Prism Config</h1>
      <Tabs defaultActiveKey='basic' mountOnEnter unmountOnExit>
        <Tab eventKey='Basic' title='Basic'>
          <p>config coming soon</p>
        </Tab>
      </Tabs>
    </Container>
  )
}
