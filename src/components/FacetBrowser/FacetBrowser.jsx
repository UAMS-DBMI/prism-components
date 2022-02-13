import React, { useState, useEffect } from 'react'
import './App.css'
import CheckboxFilter from './CheckboxFilter'
import SearchFilter from './SearchFilter'
import CornerstoneViewport from 'react-cornerstone-viewport'
import PropTypes from 'prop-types'

const File = (props) => {
  const [preview, setPreview] = useState(false)
  const [fileIds, setFileIds] = useState(['wadouri:' + 'http://core-api.apps.dbmi.cloud/v1/' + 'file/' + props.file._id])

  const tools = [
    // Mouse
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 }
    },
    {
      name: 'Zoom',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 }
    },
    {
      name: 'Pan',
      mode: 'active',
      modeOptions: { mouseButtonMask: 4 }
    },
    // Scroll
    { name: 'StackScrollMouseWheel', mode: 'active' },
    // Touch
    { name: 'PanMultiTouch', mode: 'active' },
    { name: 'ZoomTouchPinch', mode: 'active' },
    { name: 'StackScrollMultiTouch', mode: 'active' }
  ]

  const showPreview = () => {
    if (preview) {
      if (props.file._content_type === 'application/dicom') {
        return (
          <CornerstoneViewport
            tools={tools}
            imageIds={fileIds}
            isStackPrefetchEnabled
            onElementEnabled={elementEnabledEvt => {
              const cornerstoneElement = elementEnabledEvt.detail.element
              /*
            // Save this for later
            this.setState({
              cornerstoneElement,
            });
            */

              // Wait for image to render, then invert it
              cornerstoneElement.addEventListener(
                'cornerstonenewimage',
                imageEvent => {
                  if (fileIds.length !== 1) {
                    return
                  }
                  const image = imageEvent.detail.image
                  const numFrames = image.data.intString('x00280008')
                  const imageId = fileIds[0]
                  if (numFrames) {
                    var multiImageIds = []

                    for (var i = 0; i < numFrames; i++) {
                      var newId = imageId + '?frame=' + i
                      multiImageIds.push(newId)
                    }
                    setFileIds(multiImageIds)
                  }
                }
              )
            }}
            style={{ minWidth: '100%', height: '512px', flex: '1' }}
          />)
      } else if (props.file._content_type.indexOf('image/') >= 0) {
        return (
          /* eslint-disable react/jsx-closing-bracket-location */
          <img
            src={'http://core-api.apps.dbmi.cloud/v1/' + 'file/' + props.file._id}
            alt='File Preview'
            style={{ minWidth: '100%', height: '512px', flex: '1' }}
          />)
        /* eslint-enable react/jsx-closing-bracket-location */
      } else if (props.file._content_type.indexOf('video/') >= 0) {
        return (
          <video
            style={{ minWidth: '100%', height: '512px', flex: '1' }}
            controls
            src={'http://core-api.apps.dbmi.cloud/v1/' + 'file/' + props.file._id}
          >
            Your browser does not support the video tag.
          </video>)
      } else if (props.file._content_type.indexOf('audio/') >= 0) {
        return (
          <audio
            style={{ minWidth: '100%', flex: '1' }}
            controls
            src={'http://core-api.apps.dbmi.cloud/v1/' + 'file/' + props.file._id}
          >
            Your browser does not support the audio tag.
          </audio>)
      } else {
        return <span>Unable Preview</span>
      }
    } else {
      return <></>
    }
  }

  return (
    <>
      <tr className='file_row'>
        <td>
          <button
            onClick={() => props.toggleCart(props.file._id)}
            style={{ backgroundColor: props.inCart ? 'lightpink' : 'white' }}
          >
            [Cart]
          </button>
        </td>
        <td>{props.file._original_filename}</td>
        <td><a target='_' href={'http://core-api.apps.dbmi.cloud/v1/' + 'file/' + props.file._id}>{props.file._id}</a></td>
        <td>{props.file.modality}</td>
        <td>{props.file._content_type}</td>
        <td>
          <button onClick={() => setPreview(!preview)}>
            Preview
          </button>
        </td>
      </tr>
      <tr>
        <td colSpan='6'>
          {showPreview()}
        </td>
      </tr>
    </>
  )
}

File.propTypes = {
  file: PropTypes.obj,
  inCart: PropTypes.bool,
  toggleCart: PropTypes.func
}

function FacetBrowser () {
  const [itemsInCart, setCart] = useState([])
  const [searchFilter, setFilter] = useState({
    prism_demo: {
      $or: [
        {
          prism_demo: 'true'
        }
      ]
    }
  })
  const [files, setFiles] = useState(null)
  const [fileCount, setFileCount] = useState(null)
  const [stale, setStale] = useState(true)
  const [loading, setLoading] = useState(false)

  function searchParams () {
    const searchParams = new URLSearchParams()
    const meta = {}
    const clauses = []
    for (const key in searchFilter) {
      if (searchFilter[key]) {
        clauses.push(searchFilter[key])
      }
    }
    if (clauses.length > 0) {
      meta.$and = clauses
    }
    searchParams.set('meta', JSON.stringify(meta))
    setLoading(true)
    return searchParams.toString()
  }

  async function fetchFiles () {
    const opts = {
      redirect: 'follow',
      method: 'GET'
    }
    const url = 'http://core-api.apps.dbmi.cloud/v1/' + 'search/?'
    const countUrl = 'http://core-api.apps.dbmi.cloud/v1/' + 'search/count?'
    setLoading(true)
    const params = searchParams()
    const response = await fetch(url + params, opts)
    const countResponse = await fetch(countUrl + params, opts)
    setFileCount(await countResponse.json())
    setFiles(await response.json())
    setStale(false)
    setLoading(false)
  }

  useEffect(() => {
    if (stale && !loading) fetchFiles()
  })

  const toggleCart = (fileId) => {
    console.log(fileId)
    const oldCart = itemsInCart.slice()
    const index = oldCart.indexOf(fileId)
    if (index > -1) {
      // remove from cart
      oldCart.splice(index, 1)
    } else {
      // add to card
      oldCart.push(fileId)
    }
    setCart(oldCart)
  }

  const updateFilter = (name, filter) => {
    console.log(filter)
    const newFilter = { ...searchFilter }
    newFilter[name] = filter
    setFilter(newFilter)
    setStale(true)
  }

  const fileList = () => {
    if (loading) {
      return <tr><td>Loading....</td></tr>
    }
    if (!files) {
      return <tr><td>No Files</td></tr>
    }
    return files.map((file) => {
      const inCart = itemsInCart.indexOf(file._id) > -1
      return <File key={file._id} file={file} inCart={inCart} toggleCart={toggleCart} />
    })
  }

  /*  async function download() {
    // This function will load the POST request into memory
    // and then create a download object
    // DO NOT USE
    let data = {};
    data['file_ids'] = itemsInCart;
    let url = process.env.REACT_APP_API_URL + 'zip/zip';
    const response = await fetch(url, {
      method: 'POST', // or 'PUT'
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    response.blob().then(function(myBlob) {
      let link = document.createElement('a');
      link.href = window.URL.createObjectURL(myBlob);
      link.download = 'test.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
*/

  const items = itemsInCart.join(',')
  const downloadLink = 'http://core-api.apps.dbmi.cloud/v1/' + 'zip/zip?file_ids=' + items

  return (
    <div className='App'>
      <div className='header'>
        <h1>PRISM Facet</h1>
        <a href={downloadLink}><button className='downloadButton'>Download ({itemsInCart.length})</button></a>
      </div>
      <div className='container'>
        <div className='filterBar'>
          <CheckboxFilter
            name='_content_type'
            values={[
              'video/mp4',
              'image/png',
              'audio/x-wav',
              'application/dicom',
              'image/jpeg',
              'image/tiff',
              'video/webm'
            ]}
            onChange={updateFilter}
          />
          <SearchFilter
            name='prism_subject_id'
            onChange={updateFilter}
          />
          <CheckboxFilter
            name='prism_demo'
            values={['toggle']}
            onChange={updateFilter}
          />
        </div>
        <div className='file_list'>
          <h1>{fileCount} Files</h1>
          <table>
            <tbody>
              {fileList()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FacetBrowser
