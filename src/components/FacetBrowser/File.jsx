import React, { useState } from 'react'
import styles from './FacetBrowser.module.css'
import CornerstoneViewport from 'react-cornerstone-viewport'
import PropTypes from 'prop-types'
import Button from 'react-bootstrap/Button'
import 'font-awesome/css/font-awesome.css'

const File = (props) => {
  const [preview, setPreview] = useState(false)
  const [fileIds, setFileIds] = useState(['wadouri:' + '/coreapi/file/' + props.file._id])

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
            src={'/coreapi/file/' + props.file._id}
            alt='File Preview'
            style={{ minWidth: '100%', height: '512px', flex: '1' }}
          />)
        /* eslint-enable react/jsx-closing-bracket-location */
      } else if (props.file._content_type.indexOf('video/') >= 0) {
        return (
          <video
            style={{ minWidth: '100%', height: '512px', flex: '1' }}
            controls
            src={'/coreapi/file/' + props.file._id}
          >
            Your browser does not support the video tag.
          </video>)
      } else if (props.file._content_type.indexOf('audio/') >= 0) {
        return (
          <audio
            style={{ minWidth: '100%', flex: '1' }}
            controls
            src={'/coreapi/file/' + props.file._id}
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

  const wrapPreview = () => {
    if (preview) {
      return <tr><td colSpan='100%'>{showPreview()}</td></tr>
    }
    return <></>
  }

  return (
    <>
      <tr className={styles.file_row}>
        <td>
          <Button
            variant={props.inCart ? 'success' : 'outline-primary'}
            onClick={() => props.toggleCart(props.file._id)}
          >
            <i className='fa fa-shopping-cart' />
          </Button>
        </td>
        <td>{props.file._original_filename}</td>
        <td><a target='_' href={'/coreapi/file/' + props.file._id}>{props.file._id}</a></td>
        <td>{props.file.modality}</td>
        <td>{props.file._content_type}</td>
        <td>
          <Button onClick={() => setPreview(!preview)}>
            Preview
          </Button>
        </td>
      </tr>
      {wrapPreview()}
    </>
  )
}

File.propTypes = {
  file: PropTypes.obj,
  inCart: PropTypes.bool,
  toggleCart: PropTypes.func
}

export default File
