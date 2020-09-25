/**
 * @file Image.test.js
 * @description Tests the Image object.
 */
"use strict"


/*
  Extend Jest expect with a variance function to allow for jpeg compression and
  compounded float rounding errors that are too big for .closeTo() to handle.
*/
expect.extend(require('./varianceMatcher'))


const
  Image = require('../Image'),
  testDir = './core/test/images'


describe('Creating an Image',
  () => {

    test('Create 100x100 true color image',
      (done) => {
        (

          async () => {
            const image = await Image.create(100, 100)

            expect(image.width).toBe(100)
            expect(image.height).toBe(100)
            expect(image.trueColor).toBe(1)

            done()
          }
        )()
      }
    )
  }
)

describe('Loading an Image',
  () => {

    var image

    beforeEach(
      (done) => {
        (
          async () => {
            image = await Image.load(`${testDir}/red.jpg`)
            done()
          }
        )(done)
      }
    )

    test('Image is an object',
      () => {
        expect(typeof image).toBe('object')
      }
    )

    test('Image is true color',
      () => {
        expect(image.trueColor).toBe(1)
      }
    )

    test('Test image dimensions are 100x100px',
      () => {
        expect(image.width).toBe(100)
        expect(image.height).toBe(100)
      }
    )

    test('Red test image color is red(ish)',
      () => {

        const
          color = image.imageColorAt(50, 50),
          red = (color >> 16) & 0xFF,
          green = (color >> 8) & 0xFF,
          blue = (color & 0xFF)

        expect(red).toBeNear(0xFF, 1)
        expect(green).toBeNear(0x00, 1)
        expect(blue).toBeNear(0x00, 1)
      }
    )

    afterEach(
      (done) => {
        (
          async () => {
            await image.destroy(done)
            image = null
            done()
          }
        )(done)
      }
    )
  }
)

describe('Linear RGB averaging of an Image',
  () => {

    const testColors = {
      'red': 0xFF0000,
      'green': 0x00FF00,
      'blue': 0x0000FF,
      'red-green-blue': 0x555555
    }

    for (let colorName in testColors) {

      let tilePath = `${testDir}\/${colorName}.jpg`

      test(`Test ${colorName} Image averaging`,
        (done) => {
          (
            async (colorName) => {

              var
                image = await Image.load(tilePath),
                rgbAverage = await Image.linearAverageRGB(image),
                target = Image.toRGB(testColors[colorName])

              expect(rgbAverage[0]).toBeNear(target[0], 1)
              expect(rgbAverage[1]).toBeNear(target[1], 1)
              expect(rgbAverage[2]).toBeNear(target[2], 1)

              done()
            }
          )(colorName)
        }
      )
    }
  }
)

describe('Quadratic RGB averaging of an Image',
  () => {

    const testColors = {
      'red': 0xFF0000,
      'green': 0x00FF00,
      'blue': 0x0000FF,
      'red-green-blue': 0x939393
    }

    for (let colorName in testColors) {

      let tilePath = `${testDir}\/${colorName}.jpg`

      test(`Test ${colorName} Image averaging`,
        (done) => {
          (
            async (colorName, done) => {

              var
                image = await Image.load(tilePath),
                rgbAverage = await Image.quadraticAverageRGB(image),
                target = Image.toRGB(testColors[colorName])

              expect(rgbAverage[0]).toBeNear(target[0], 1)
              expect(rgbAverage[1]).toBeNear(target[1], 1)
              expect(rgbAverage[2]).toBeNear(target[2], 1)

              done()
            }
          )(colorName, done)
        }
      )
    }
  }
)

describe('Color integer conversion to RGB array',
  () => {

    test('Black',
      () => {
        expect(Image.toRGB(0x000000)).toEqual(
          expect.arrayContaining([0, 0, 0])
        )
      }
    )

    test('White',
      () => {
        expect(Image.toRGB(0xFFFFFF)).toEqual(
          expect.arrayContaining([255, 255, 255])
        )
      }
    )

    test('Grey',
      () => {
        expect(Image.toRGB(0xd3d3d3)).toEqual(
          expect.arrayContaining([211, 211, 211])
        )
      }
    )

    test('Red',
      () => {
        expect(Image.toRGB(0xFF0000)).toEqual(
          expect.arrayContaining([255, 0, 0])
        )
      }
    )
    test('Green',
      () => {
        expect(Image.toRGB(0x00FF00)).toEqual(
          expect.arrayContaining([0, 255, 0])
        )
      }
    )
    test('Blue',
      () => {
        expect(Image.toRGB(0x0000ff)).toEqual(
          expect.arrayContaining([0, 0, 255])
        )
      }
    )
  }
)

describe('Image RGB array conversion to XYZ array',
  () => {

    test('Black',
      () => {

        const expected = [0, 0, 0]

        Image.toXYZ(Image.toRGB(0x000000)).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('White',
      () => {

        const expected = [95.047, 100.000, 108.883]

        Image.toXYZ(Image.toRGB(0xffffff)).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Grey',
      () => {

        const expected = [61.914, 65.141, 70.927]

        Image.toXYZ(Image.toRGB(0xd3d3d3)).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Red',
      () => {

        const expected = [41.246, 21.267, 1.933]

        Image.toXYZ(Image.toRGB(0xFF0000)).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )
    test('Green',

      () => {

        const expected = [35.758, 71.515, 11.919]

        Image.toXYZ(Image.toRGB(0x00FF00)).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )
    test('Blue',
      () => {

        const expected = [18.044, 7.217, 95.030]

        Image.toXYZ(Image.toRGB(0x0000ff)).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )
  }
)

describe('Image XYZ array conversion to CIE-L*ab array',
  () => {

    test('Black',
      () => {

        const expected = [0, 0, 0]

        Image.toLab(Image.toXYZ(Image.toRGB(0x000000))).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('White',
      () => {

        const expected = [100, 0, 0]

        Image.toLab(Image.toXYZ(Image.toRGB(0xffffff))).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Grey',
      () => {

        const expected = [84.556, 0, 0]

        Image.toLab(Image.toXYZ(Image.toRGB(0xd3d3d3))).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Red',
      () => {

        const expected = [53.241, 80.092, 67.203]

        Image.toLab(Image.toXYZ(Image.toRGB(0xFF0000))).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Green',
      () => {

        const expected = [87.735, -86.183, 83.179]

        Image.toLab(Image.toXYZ(Image.toRGB(0x00FF00))).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Blue',
      () => {

        const expected = [32.297, 79.188, -107.860]

        Image.toLab(Image.toXYZ(Image.toRGB(0x0000FF))).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )
  }
)

describe('Color number conversion to CIE-L*ab array',
  () => {

    test('Black',
      () => {

        const expected = [0, 0, 0]

        Image.colorToLab(0x000000).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('White',
      () => {

        const expected = [100, 0, 0]

        Image.colorToLab(0xFFFFFF).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Grey',
      () => {

        const expected = [84.556, 0, 0]

        Image.colorToLab(0xD3D3D3).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Red',
      () => {

        const expected = [53.241, 80.092, 67.203]

        Image.colorToLab(0xFF0000).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Green',
      () => {

        const expected = [87.735, -86.183, 83.179]

        Image.colorToLab(0x00FF00).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )

    test('Blue',
      () => {

        const expected = [32.297, 79.188, -107.860]

        Image.colorToLab(0x0000FF).forEach(
          (value, index) => expect(value).toBeNear(expected[index], 0.02)
        )
      }
    )
  }
)