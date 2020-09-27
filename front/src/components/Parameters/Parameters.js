/**
 * @file Parameters.js
 * @description Mosaic Parameters Component.
 */


import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Slider from '@material-ui/core/Slider'

import './parameters.css'
import mona from '../mona.jpg'


const
  adaptations = {
    "A": "Incandescent/tungsten",
    "B": "Old direct sunlight at noon",
    "C": "Old daylight",
    "D50": "ICC profile PCS",
    "D55": "Mid-morning daylight",
    "D65": "Daylight, sRGB, Adobe-RGB",
    "D75": "North sky daylight",
    "E": "Equal energy",
    "F2": "Daylight Fluorescent",
    "F7": "Daylight fluorescent, D65 simulator",
    "F11": "Ultralume 40, Philips TL84"
  },
  palette = {
    "accordion": "Accordion",
    "airplanes": "Airplanes",
    "faces": "Faces"
  }


class Parameters extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      quadratic: false,
      lighting: 'D65',
      palette: 'accordion',
      columns: 20,
      rows: 20
    }

    this.onStrategyChange = this.onStrategyChange.bind(this)
    this.onLightingChange = this.onLightingChange.bind(this)
    this.onPaletteChange = this.onPaletteChange.bind(this)
    this.onColumnChange = this.onColumnChange.bind(this)
    this.onRowChange = this.onRowChange.bind(this)
    this.onImageLoad = this.onImageLoad.bind(this)
  }

  render() {

    var
      columnWidth = this.state.width / this.state.columns,
      rowHeight = this.state.height / this.state.rows,
      columnGrid = [],
      rowGrid = []

    for (let column = 1; column < this.state.columns; column++) {
      columnGrid.push(
        <div className="grid-column grid-line" style={{ left: columnWidth * column }}></div>
      )
    }

    for (let row = 0; row < this.state.rows; row++) {
      columnGrid.push(
        <div className="grid-row grid-line" style={{ top: rowHeight * row }}></div>
      )
    }

    return (
      <aside className={'parameters ' + this.props.className}>

        <main className="wrapper">

          <section className="source column">
            <h1>Source</h1>

            <FormControlLabel
              label="Ligting"
              labelPlacement="start"
              control={
                <Select
                  labelId="lighting-select-label"
                  id="lighting-select"
                  value={this.state.lighting}
                  onChange={this.onLightingChange}
                >
                  {
                    Object.keys(adaptations).map(
                      (value) => (
                        <MenuItem value={value} key={value}>
                          {adaptations[value]}
                        </MenuItem>
                      )
                    )
                  }
                </Select>
              }
            />

            <div className="mosaic-cutup-wrapper">

              <img
                className="mosaic-cutup"
                src={mona}
                alt="Mosaic preview"
                onLoad={this.onImageLoad}
                onResize={this.onImageLoad}
              />

              {columnGrid}
              {rowGrid}

              <div className="sliders">
                <div className="column-slider-wrapper slider-wrapper">
                  <Slider
                    className="column-slider slider"
                    value={this.state.columns}
                    min={1}
                    step={10}
                    max={100}
                    onChangeCommitted={this.onColumnChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                  />
                </div>

                <div className="row-slider-wrapper slider-wrapper">
                  <Slider
                    className="row-slider slider"
                    value={this.state.rows}
                    min={1}
                    step={10}
                    max={100}
                    orientation="vertical"
                    onChangeCommitted={this.onRowChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
            </div>

            <FormControlLabel
              label="Quadratic averaging"
              labelPlacement="start"
              control={
                <Switch
                  checked={this.state.quadratic}
                  onChange={this.onStrategyChange}
                  color="primary"
                  name="checkedB"
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              }
            />

          </section>

          <section className="palette column">
            <h1>Palette</h1>
            <FormControlLabel
              label="Palette"
              labelPlacement="start"
              control={
                <Select
                  labelId="palette-select-label"
                  id="palette-select"
                  value={this.state.palette}
                  onChange={this.onPaletteChange}
                >
                  {
                    Object.keys(palette).map(
                      (value) => (
                        <MenuItem value={value} key={value}>
                          {palette[value]}
                        </MenuItem>
                      )
                    )
                  }
                </Select>
              }
            />

            <section className="preview"></section>

          </section>


        </main>

      </aside>
    )
  }


  /* ----- Event handling ----- */


  onImageLoad({ target: img }) {
    this.setState(
      {
        width: img.width,
        height: img.height,
      }
    )
  }

  onStrategyChange(event, value) {
    this.setState({ quadratic: value })
  }

  onLightingChange(event, value) {
    this.setState({ lighting: value.props.value })
  }

  onPaletteChange(event, value) {
    this.setState({ palette: value.props.value })
  }

  onColumnChange(event, value) {
    this.setState({ columns: value })
  }

  onRowChange(event, value) {
    this.setState({ rows: value })
  }
}


export default Parameters