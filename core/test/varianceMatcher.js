/**
 * @file varianceMatcher.js
 * @description Extention Object to extend Jest expect with a variance function
 *              to allow for jpeg compression loss.
 */

module.exports =  {
  toBeNear(toTest, expected, variance){
    return toTest - variance <= expected && toTest + variance >= expected
      ? {
        message: () => `expected ${toTest} to be within ${variance} from ` +
                  `${expected}`,
        pass: true
      }
      : {
        message: () => `expected ${toTest} to be within ${variance} from ` +
                  `${expected}`,
        pass: false
      }
  }
}
