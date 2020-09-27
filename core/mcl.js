/**
 * @file mcl.js
 * @description: Command line interface for MosaicMaker
 */


const
  fs = require('fs'),
  path = require("path"),
  MosaicMaker = require("./MosaicMaker.js"),
  Image = require('./Image'),
  usage = '\nUsage:\n' +
    '\tnode mcl.js ./source/image.jpg ./path/to/palette/folder|paletteName ' +
    'columns rows [linear|quadratic]\n' +
    'Where:\n' +
    '\tpaletteName may be any of the folder names under ./palette\n'


if (process.argv.length >= 4) {

  // Only run if enough arguments are supplied.

  // Get command line arguments.
  const [
    imagePath,
    palette,
    columns,
    rows,
    averagingStrategy
  ] = process.argv.slice(2);

  // Verify arguments.
  switch (true) {

    case !fs.existsSync(imagePath):
      console.log(`${usage}\n\x1b[31mImage does not exist!\n`)
      break;

    case !(fs.existsSync(palette) || fs.existsSync(`./palettes/${palette}`)):
      console.log(`${usage}\n\x1b[31mPalette does not exist!\n`)
      break;

    case !(Number.isInteger(+columns) && +columns > 0):
      console.log(`${usage}\n\x1b[31mColumns must be an integer value!\n`)
      break;

    case !(Number.isInteger(+rows) && +rows > 0):
      console.log(`${usage}\n\x1b[31mColumns must be an integer value!\n`)
      break;

    case averagingStrategy &&
      !(averagingStrategy == Image.LINEAR_STRATEGY
        ||
        averagingStrategy == Image.QUADRATIC_STRATEGY
      ):
      console.log(`${usage}\n\x1b[31mInvalid averaging strategy!\n`)
      break;

    // All arguments are valid, make magic!
    default:

      (
        async () => {

          // Load the template image
          const
            ext = path.extname(imagePath),
            name = path.basename(imagePath, ext),
            image = await Image.load(imagePath)

          // Create!
          MosaicMaker.compose(
            name,
            image,
            palette,
            columns,
            rows,
            averagingStrategy
          )
        }
      )()

  }
} else {

  // Not enough arguments, print usage instructions.
  console.log(usage)
}