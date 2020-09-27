/**
 * @file Preview.js
 * @description Mosaic Preview Image Component.
 */


import React from 'react'
import Slider from '@material-ui/core/Slider'
import IconButton from '@material-ui/core/IconButton'
import ZoomInIcon from '@material-ui/icons/ZoomIn'
import ZoomOutIcon from '@material-ui/icons/ZoomOut'


import './preview.css'
import mona from '../mona.jpg'


const marks = [
  { value: 0, label: '0%' },
  { value: 100, label: '100%' },
  { value: 400, label: '400%' }
]


class Preview extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      zoom: 100
    }

    this.onImageLoad = this.onImageLoad.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onZoomIn = this.onZoomIn.bind(this)
    this.onZoomOut = this.onZoomOut.bind(this)
  }

  render() {

    const
      mosaicWidth = this.state.width * this.state.zoom / 100,
      mosaicHeight = this.state.height * this.state.zoom / 100,
      mosaicLeftOffset = mosaicWidth / 2,
      mosaicTopOffset = mosaicHeight / 2,

      mosaicStyle = {
        width: mosaicWidth,
        marginTop: -mosaicTopOffset,
        marginLeft: -mosaicLeftOffset
    }

    return (
      <aside className={'preview ' + this.props.className}>

        <main className="wrapper">
          <img
            className="mosaic"
            onLoad={this.onImageLoad}
            style={mosaicStyle.width ? mosaicStyle : {}}
            src={mona}
            alt="Mosaic preview"
          />
        </main>

        <footer className="zoom">

          <IconButton
            aria-label="Zoom out"
            className="zoom-button zoom-out"
            onClick={this.onZoomOut}>
            <ZoomOutIcon />
          </IconButton>

          <Slider
            className="slider"
            value={this.state.zoom}
            min={0}
            step={10}
            max={400}
            // scale={(x) => x ** 10}
            getAriaValueText={(value) => `${value}%`}
            valueLabelFormat={(value) => `${value}%`}
            onChangeCommitted={this.onChange}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
            marks={marks}
          />

          <IconButton
            aria-label="Zoom in"
            className="zoom-button zoom-in"
            onClick={this.onZoomIn}>
            <ZoomInIcon />
          </IconButton>

        </footer>

      </aside>
    )
  }


  /* ----- Event handling ----- */


  onImageLoad({ target: img }){
    this.setState(
      {
        width: img.width,
        height: img.height,
      }
    )
  }

  onChange(event, value) {
    this.setState({ zoom: value })
  }

  onZoomIn() {
    this.setState(
      {
        zoom: this.state.zoom + 10 <= 400
          ? this.state.zoom + 10
          : 400
      }
    )
  }

  onZoomOut() {
    this.setState(
      {
        zoom: this.state.zoom - 10 >= 0
          ? this.state.zoom - 10
          : 0
      }
    )
  }


  /* ----- Utility ----- */


  percentFormat(value) {
    return
  }
}


export default Preview