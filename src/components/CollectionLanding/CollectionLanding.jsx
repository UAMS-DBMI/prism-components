import React from 'react'
import { useFetch } from '../Utils/useFetch'
import { ThreeDots } from 'react-loader-spinner'
import PropTypes from 'prop-types'
import { TrixEditor } from 'react-trix'
import 'trix/dist/trix'
import 'trix/dist/trix.css'

export default function CollectionLanding (props) {
  const collection = useFetch(`/api/collections/${props.collection_slug}`)

  const handleChange = (html, text) => {
    console.log(html, text)
  }

  const handleEditorReady = (editor) => {
    editor.insertString('editor is ready')
  }

  if (collection == null) {
    return <ThreeDots color='grey' wrapperStyle={{ display: 'flex', justifyContent: 'center' }} />
  }

  if (collection.detail === 'Not Found') {
    return (
      <>
        <h3>Error loading collection</h3>
        <p style={{ color: 'red' }}>Collection Manager API was unreachable</p>
      </>)
  }

  return (
    <div>
      <h1>{collection.collection_name}</h1>
      <p>{collection.collection_description}</p>
      <TrixEditor
        onChange={handleChange}
        onEditorReady={handleEditorReady}
        value={collection.collection_description}
      />
      }
    </div>
  )
}

CollectionLanding.propTypes = {
  collection_slug: PropTypes.string.isRequired
}
