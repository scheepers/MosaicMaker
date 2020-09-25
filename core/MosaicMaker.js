/**
 * @file Image.js
 * @description Creates a mosaic given a source image, palette, number of
 *              columns and rows.
 */
"use strict"


const
  Image = require('./Image'),
  Palette = require('./Palette')


class MosaicMaker {

  /**
   * Composes a Mosaic.
   * @param {GD Image} image to use as a template.
   * @param {Palette} palette palette to utilise.
   * @param {number} columns number of columns of tiles.
   * @param {number} rows number of rows of tiles.
   * @param {string} averagingStrategy strategy to calculate average colors.
   */
  static compose(
    name,
    image,
    palette,
    columns,
    rows,
    averagingStrategy = Image.LINEAR_STRATEGY
  ) {

    const
      tileWidth = image.width / columns,
      tileHeight = image.height / rows,
      mosaic = Image.create(tileWidth * columns, tileHeight * rows),
      outputFile = `./${name}.mosaic.jpg`

    palette = new Palette(
      palette,
      () => {

        this.slice(image, columns, rows, tileWidth, tileHeight,
          (slice) => {

            for (let x in slice) {
              for (let y in slice[x]) {

                // Find closest matching tile
                let tile = palette.findPaint(slice[x][y].color)

                tile.image
                  // Resize and copy the tile onto the mosaic
                  .copyResized(
                    mosaic,
                    x * tileWidth, y * tileHeight, // Mosaic start X, Y
                    0, 0, // Tile start X, Y
                    tileWidth, tileHeight, // Destination width, height
                    tile.image.width, tile.image.height // Source width, height
                  )

                  /*
                    copyResized does not return a promise, but GD destroys the
                    image before finishing the copy...
                  */
                  setTimeout(
                    () => tile.image.destroy(),
                    1000
                  )

              }
            }

            (
              async () => {
                process.stdout.write(`\rExporting `)
                await mosaic.saveJpeg(outputFile)
                image.destroy()
                palette.destroy()
                console.log(
                  `Done!\n\nCheck out the generated image: ${outputFile}`
                );
              }
            )()
          },
          averagingStrategy
        )
      },
      averagingStrategy
    )
  }


  /**
   * Slices an image into tiles and computes average colors.
   * @param {GD Image} image to be sliced.
   * @param {number} columns number of columns to slice the image into.
   * @param {number} rows number of rows to slice the image into.
   * @param {number} tileWidth width of a single tile
   * @param {number} tileHeight height of a single tile
   * @param {function} done callback to execute on completion.
   */
  static async slice(
    image,
    columns,
    rows,
    tileWidth,
    tileHeight,
    done,
    averagingStrategy
  ) {

    const total = (columns - 1) * (rows - 1)

    var slice = []

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {

        process.stdout.write(
          `\rSlicing image [${Math.round(x * y / total * 100)}%] `
        )

        let
          canvasX = x * tileWidth,
          canvasY = y * tileHeight,
          tile = await Image.create(tileWidth, tileHeight)

        image.copy(
          tile,
          0, 0,
          canvasX, canvasY,
          tileWidth, tileHeight
        )

        slice[x] = slice[x] || []
        slice[x][y] = {
          color: await Image.averageColor(tile, averagingStrategy),
          tile: tile
        }
      }
    }

    console.log('Done!\n')

    done(slice)
  }
}


module.exports = MosaicMaker