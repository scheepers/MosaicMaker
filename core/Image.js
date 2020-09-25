/**
 * @file Image.js
 * @description Image utility class.
 */
"use strict"


const
  gd = require('node-gd')


class Image {


  /* ---- Operations ---- */


  /**
   * Asynchronously loads an image
   * @param {string} path to the image to load.
   * @returns image GD Image object
   */
  static async load(path) {

    var image = await gd.openJpeg(path)

    return image.trueColor
      ? image
      : image.paletteToTrueColor()
  }

  /**
   * Asynchronously creates an image
   * @param {number} width of the image to create.
   * @param {number} height of the image to create.
   */
  static create(width, height) {
    return gd.createTrueColorSync(width, height);
  }


  /* ---- Calculation ---- */


  /**
   * Builds an image key based on its CIE-L*ab average color.
   * @param Image GD Image object.
   * @param string averagingStrategy used to calculate the image average color.
   *              (optional)
   *              Expected values:
   *                Image.LINEAR_STRATEGY or Image.QUADRATIC_STRATEGY
   *              Default: Image.LINEAR_STRATEGY
   * @returns array containing average RGB values.
   */
  static async averageColor(image, averagingStrategy = Image.LINEAR_STRATEGY) {

    /* First get the integer color averages, then convert to RGB, XYZ and
       finally to LAB */

    return averagingStrategy == Image.LINEAR_STRATEGY
      ? Image.toLab(Image.toXYZ(await Image.linearAverageRGB(image)))
      : Image.toLab(Image.toXYZ(await Image.quadraticAverageRGB(image)))
  }

  /**
   * Calculates average image color using linear difference.
   * @param image GD Image object
   * @returns array containing average RGB values.
   */
  static async linearAverageRGB(image) {

    const pixelCount = BigInt(image.width * image.height)
    var rgbTotal = [BigInt(0), BigInt(0), BigInt(0)]

    /* Iterate through each pixel */
    for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {

        /* Get the int color value of the pixel and convert to [r, g, b] */
        let pixelRGB = Image.toRGB(await image.getTrueColorPixel(x, y))

        /* Add r, g, b to to each total */
        rgbTotal = [
          rgbTotal[0] + BigInt(pixelRGB[0]),
          rgbTotal[1] + BigInt(pixelRGB[1]),
          rgbTotal[2] + BigInt(pixelRGB[2]),
        ]
      }
    }

    /* Divide each total by the number of pixels */
    return rgbTotal.map(
      (channelTotal) => {
        return Number(channelTotal / pixelCount)
      }
    )
  }

  /**
   * Calculates average image color the root of quadratic difference.
   * Compensates for the loss of bright- and sharpness (to the human eye)
   * inherent to use of linear difference with images compressed by cameras.
   * @param {image} GD Image object
   * @returns {array} array containing average RGB values.
   */
  static async quadraticAverageRGB(image) {

    const pixelCount = BigInt(image.width * image.height)
    var rgbTotal = [BigInt(0), BigInt(0), BigInt(0)]

    /* Iterate through each pixel */
    for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {

        /* Get the int color value of the pixel and convert to [r, g, b] */
        let pixelRGB = Image.toRGB(await image.getTrueColorPixel(x, y))

        /* Add the square of r, g and b to totals */
        rgbTotal = [
          rgbTotal[0] + BigInt(pixelRGB[0] ** 2),
          rgbTotal[1] + BigInt(pixelRGB[1] ** 2),
          rgbTotal[2] + BigInt(pixelRGB[2] ** 2)
        ]
      }
    }

    /* Divide the totals by the number of pixels and get the square root  */
    return rgbTotal.map(
      (channelTotal) => (Number(channelTotal / pixelCount)) ** 0.5
    )
  }


  /* ---- Conversion ---- */


  /**
   * Extracts RGB values from a number
   * @param {int} colour to convert to [r, g, b]
   * @returns {array} [r, g, b] value array.
   */
  static toRGB(colour) {

    // Bitwise shift and mask to extract RGB channels.
    return [
      (colour >> 16) & 0xFF,
      (colour >> 8) & 0xFF,
      (colour & 0xFF)
    ]
  }

  /**
   * RGB values to XYZ given Observer illuminant and (D65/2° standard illuminant)
   * @param {array} rgb array containing [r, g, b]
   * @returns {array} containing [X, Y, Z]
   */
  static toXYZ(rgb, illuminant = 'D65', degrees = 2) {

    const
      sRGB = rgb.map(
        // Convert sRGB to a fraction between 0 and 1
        channel => channel / 255
      ).map(
        // Inverse compand channels
        channel => (
          channel > 0.04045
            ? ((channel + 0.055) / 1.055) ** 2.4
            : channel / 12.92
        ) * 100
      )

    return [
      // Transform to XYZ using D65 transformation matrix
      sRGB[0] * 0.4124564 + sRGB[1] * 0.3575761 + sRGB[2] * 0.1804375,
      sRGB[0] * 0.2126729 + sRGB[1] * 0.7151522 + sRGB[2] * 0.0721750,
      sRGB[0] * 0.0193339 + sRGB[1] * 0.1191920 + sRGB[2] * 0.9503041
    ]
  }

  /**
   * Converts XYZ to CIE-L*ab.
   * @param {array} xyz array containing [X, Y, Z]
   * @returns {array} containing [L, a, b]
   */
  static toLab(xyz) {

    /* Assuming D65,2deg daylight */
    const

      references = [95.047, 100.000, 108.883],
      fractional = xyz.map((value, index) => value / references[index]),
      intermediate = fractional.map(
        fraction => (
          fraction > 0.008856
            ? fraction ** (1 / 3)
            : (7.787 * fraction) + (16 / 116)
        )
      )

    return [
      116 * intermediate[1] - 16,
      500 * (intermediate[0] - intermediate[1]),
      200 * (intermediate[1] - intermediate[2])
    ]
  }

  /**
   * Converts color number to CIE-L*ab.
   */
  static colorToLab(color) {
    return Image.toLab(Image.toXYZ(Image.toRGB(color)))
  }
}


/* Image constants used in averageColor method */
Image.LINEAR_STRATEGY = 'linear'
Image.QUADRATIC_STRATEGY = 'quadratic'


module.exports = Image