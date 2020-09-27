/**
 * @file Palette.test.js
 * @description Tests the Palette Image object.
 */
"use strict"


/*
  Extend Jest expect with a variance function to allow for jpeg compression and
  compounded float rounding errors that are too big for .closeTo() to handle.
*/
expect.extend(require('./varianceMatcher'))
/* Increase the timeout */
jest.setTimeout(10000)


const
  Image = require('../Image'),
  Palette = require('../Palette'),
  testDir = './palette',
  testColors = {
    black: 0x000000,
    white: 0xFFFFFF,
    grey: 0xD3D3D3,
    red: 0xFF0000,
    green: 0x00FF00,
    blue: 0x0000FF
  }


describe('Palette initiation and destruction',
  () => {

    test(
      'Initiate palette',
      (done) => {

        var palette = new Palette(
          testDir,
          () => {

            expect(typeof palette.tiles).toBe('object')
            expect(Object.keys(palette.tiles).length).toBe(6)

            palette.destroy(
              () => {
                expect(Object.keys(palette.tiles).length).toBe(0)
                done()
              }
            )
          }
        )
      }
    )
  }
)

describe('Palette loading',
  () => {

    test('Load palette averaged linearly',
      (done) => {
        var palette = new Palette(
          testDir,
          () => {
            (
              async () => {

                const keys = Object.keys(palette.tiles)

                expect(keys.length).toBe(6)

                for(let tileKey of keys){

                  let generatedKey = Image.toLab(
                    Image.toXYZ(
                      await Image.linearAverageRGB(palette.tiles[tileKey].image)
                    )
                  )

                  expect(typeof palette.tiles[tileKey]).toBe('object')
                  expect(typeof palette.tiles[tileKey].image).toBe('object')
                  expect(palette.tiles[tileKey].color).toStrictEqual(
                    expect.arrayContaining(generatedKey)
                  )
                }

                palette.destroy(done)
              }
            )()
          }
        )
      }
    )
  }
)

describe('Color distance calculation',
  () => {

    const
      testCases = {
        'Black to white': {
          from: testColors.black, to: testColors.white, expected: 100
        },
        'Red to green': {
          from: testColors.red, to: testColors.green, expected: 170.5842
        },
        'Green to Blue': {
          from: testColors.red, to: testColors.green, expected: 170.5842
        },
        'Blue to Red': {
          from: testColors.blue, to: testColors.red, expected: 176.5842
        },
        'Grey to white': {
          from: testColors.grey, to: testColors.white, expected: 15.4439
        },
        'Grey to Black': {
          from: testColors.grey, to: testColors.black, expected: 84.5561
        },
        'Grey to Grey': {
          from: testColors.grey, to: testColors.grey, expected: 0
        },
        'Grey to Red': {
          from: testColors.grey, to: testColors.red, expected: 109.1681
        },
        'Grey to Green': {
          from: testColors.grey, to: testColors.green, expected: 119.8303
        },
        'Grey to Blue': {
          from: testColors.grey, to: testColors.blue, expected: 143.647
        },
      }

    Object.keys(testCases).forEach(
      (key) => {

        let testCase = testCases[key]
        test(key,
          () => {
            expect(
              Palette.getDistance(
                Image.colorToLab(testCase.from),
                Image.colorToLab(testCase.to)
              )
            ).toBeNear(testCase.expected, 0.3)
          }
        )
      }
    )
  }
)

describe('Color finding',
  () => {

    var
      expected = {
        'black': 'black',
        'white': 'white',
        'grey': 'white',
        'red': 'red',
        'green': 'green',
        'blue': 'blue'
      }


    for(let key in testColors){
      test(
        `Find closest to ${key}`,
        (done) => {
          var palette = new Palette(
            testDir,
            () => {

              var lab = Image.colorToLab(testColors[key])

              expect(palette.findPaint(lab).name).toBe(expected[key])

              palette.destroy(done)
            }
          )
        }
      )
    }
  }
)