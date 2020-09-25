/**
 * @file Palette.js
 * @description Tile palette and utilities.
 */
"use strict"


const
  fs = require('fs'),
  Image = require('./Image')


class Palette {


  /* ---- Construct / Destroy ---- */


  /**
   * Initializes the tile store
   * @param {string} name path or name of the palette to load.
   * @param {function} done callback to execute on completion.
   * @param {string} averagingStrategy to use to compute color averages.
   */
  constructor(name, done, averagingStrategy) {

    this.tiles = {}

    const
      palettePath = name.startsWith('./')
        ? name
        : `./palettes/${name}`,
      files = fs.readdirSync(palettePath, { withFileTypes: true }).
        filter(
          (entry) => entry.isFile() && !entry.name.startsWith('.')
        ).map(
          (entry) => entry.name
        )

    var
      left = files.length

    // TODO Implement Octree for quicker searching
    for (let index = 0; index < files.length; index++) {

      const
        fileName = files[index],
        imagePath = `${palettePath}\/${fileName}`,
        tileKey = fileName.replace(/.[^.]+$/, '')
        ;

      // Load images in their own threads
      (
        async (palette, tileKey) => {

          const
            image = await Image.load(imagePath),
            averageColor = await Image.averageColor(image, averagingStrategy)

          palette.tiles[tileKey] = {
            image: image,
            color: averageColor,
            name: tileKey
          }

          process.stdout.write(`\rLoading palette [${
            Math.round((index + 1) / files.length * 100)
          }%] `)

          if (--left == 0) {
            console.log('Done!\n')
            done()
          }
        }
      )(this, tileKey)
    }
  }

  /**
    * Destroys the palette by releasing image resources.
    * @param {function} done Callback to invoke when the palette has been
    *                       destroyed.
    * @param {function} done callback to be executed once resource destruction
    */
  destroy(done = () => { }) {

    var
      keys = Object.keys(this.tiles),
      toDo = keys.length

    keys.map(
      key => {
        (
          async () => {
            await this.tiles[key].image.destroy()
            if (--toDo == 0) {
              this.tiles = {}
              done()
            }
          }
        )()
      }
    )
  }


  /* ---- Utilities ---- */


  /** Finds the nearest color.
   * @param {number} findColor target color to match.
   * @returns {object} with attributes:
   * { image, color, key, name }
   */
  findPaint(findColor) {

    var
      closestTile,
      closestKey,
      distance = 1000

    // TODO Implement Octree for quicker searching
    for (let key of Object.keys(this.tiles)) {

      let currentDistance = Palette.getDistance(
        findColor, this.tiles[key].color
      )

      if (currentDistance < distance) {
        distance = currentDistance
        closestKey = key
      }
    }

    closestTile = this.tiles[closestKey];

    return closestTile
  }

  /**
   * Calculates the Delta E*CIE difference between two colors.
   * @param {array} fromColor [L, a, b]
   * @param {array} toColor [L, a, b]
   * @returns {number} the distance between the two colors.
   */
  static getDistance(fromLab, toLab) {
    return (
      (fromLab[0] - toLab[0]) ** 2 +
      (fromLab[1] - toLab[1]) ** 2 +
      (fromLab[2] - toLab[2]) ** 2
    ) ** 0.5
  }
}


module.exports = Palette