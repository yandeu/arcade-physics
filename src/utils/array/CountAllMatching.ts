/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { SafeRange } from './SafeRange'

/**
 * Returns the total number of elements in the array which have a property matching the given value.
 *
 * @function Phaser.Utils.Array.CountAllMatching
 * @since 3.4.0
 *
 * @param {array} array - The array to search.
 * @param {string} property - The property to test on each array element.
 * @param {*} value - The value to test the property against. Must pass a strict (`===`) comparison check.
 * @param {number} [startIndex] - An optional start index to search from.
 * @param {number} [endIndex] - An optional end index to search to.
 *
 * @return {number} The total number of elements with properties matching the given value.
 */
export const CountAllMatching = (array, property, value, startIndex = 0, endIndex?) => {
  if (endIndex === undefined) {
    endIndex = array.length
  }

  let total = 0

  if (SafeRange(array, startIndex, endIndex)) {
    for (let i = startIndex; i < endIndex; i++) {
      const child = array[i]

      if (child[property] === value) {
        total++
      }
    }
  }

  return total
}
