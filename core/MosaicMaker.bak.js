/**
 * @file Image.js
 * @description Object educes an image to its average color values.
 */
"use strict"


const
  fs = require('fs'),
  gd = require('node-gd'),
  Image = require('./Image'),
  Palette = require('./Palette')


class MosaicMaker {


  /* ---- Construct / Destroy ---- */


  /**
   * Initializes palette and slice cache.
   */
  // constructor() {
  //   this.mosaics = {}
  //   this.palettes = {}
  //   this.slices = {}
  // }

  /**
   * Destroys the maker, its palettes and cached slices.
   * @param {function} done callback to be executed once resource destruction
   *                        has started.
   */
  // async destroy(done) {

    // Destroy cached mosaics.
    // for (const paletteName in this.palettes) {
    //   for (let paletteStrategy in this.palettes[paletteName]) {
    //     (
    //       (palette) => {
    //         palette.destroy()
    //       }
    //     )(this.palettes[paletteName][paletteStrategy])
    //   }
    // }

    // Destroy cached palettes.
    // for (const paletteName in this.palettes) {
    //   for (let paletteStrategy in this.palettes[paletteName]) {
    //     (
    //       (palette) => {
    //         palette.destroy()
    //       }
    //     )(this.palettes[paletteName][paletteStrategy])
    //   }
    // }

    // Destroy cached slices.
    // for (let sliceName in this.slices) {
    //   for (let sliceStrategy in this.slices[sliceName]) {
    //     (
    //       (slice) => slice.destroy()
    //     )(this.slices[sliceName][sliceStrategy])
    //   }
    // }

    // this.palettes = {}
    // this.slices = {}

  //   if (done) done()
  // }


  /* ---- Operations ---- */


/**
   * Mosaics an Image into tiles of average color, replaces them images from a suitable  The result is cached.
   * @param {string} name of the image.
   * @param {object} image GD image object to mosaic
   * @param {int} mosaicColumns number of columns to slice the image into.
   * @param {int} mosaicRows number of rows to slice the image into.
   * @param {boolean} cache true to utilise the cache.
   * @param {string} strategy strategy used to calculate average color.
   * @see Image.averageColor
   */
  static async mosaic(
    name,
    image,
    palette,
    columns,
    rows,
    // cache = false,
    strategy = Image.LINEAR_STRATEGY
  ){

    // const
    //   key = `${name}[${columns}x${rows}]${strategy}`
    // Check the mosaic cache
    // if (cache && this.mosaics[key]) return this.mosaics[key]

    var
      tileWidth = image.width / columns,
      tileHeight = image.height / rows,
      palette = new Palette(),
      target = await Image.create(image.width, image.height)

    await palette.load(palette)

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {

        let
          canvasX = x*tileWidth,
          canvasY = y*tileHeight,
          tile = image.crop(
            canvasX,
            canvasY,
            tileWidth,
            tileHeight
          ),
          color = Image.averageColor(tile, strategy)
          paint = palette.findColor(color)

        paint.copyResized(
          target,
          canvasX, canvasY,
          0, 0,
          tileWidth, tileHeight,
          paint.width, paint.height
        )
      }
    }

    return sliced
  }

  /**
   * Loads and caches a palette.
   * @param {string} paletteName of the palette to load. By default palettes are
   *                             stored within the palettes folder. If the name
   *                             contains a path, that will be used in stead.
   * @param {boolean} reload true if the cached palette is to be discarded and
   *                         reloaded.
   * @param {string} strategy Image.LINEAR_STRATEGY
   */
  // async loadPalette(
  //   paletteName,
  //   reload = false,
  //   strategy = Image.LINEAR_STRATEGY
  // ) {

  //   var palettePath = paletteName.match(/^[\.|\/]/)
  //     ? paletteName
  //     : `./palettes/${paletteName}`

  //   const
  //     cachedPalette =
  //       this.palettes[paletteName] && this.palettes[paletteName][strategy]
  //         ? this.palettes[paletteName][strategy]
  //         : false

  //   if (reload && cachedPalette) {
  //     existing.destroy()
  //   } else if (cachedPalette) return cachedPalette

  //   var palette = new Palette()
  //   await palette.load(palettePath)

  //   this.palettes[paletteName]
  //     ? this.palettes[paletteName][strategy] = palette
  //     : this.palettes[paletteName] = { [strategy]: palette }
  // }
}


module.exports = MosaicMaker