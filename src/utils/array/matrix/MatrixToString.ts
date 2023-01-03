/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Pad from '../../string/Pad'

import { CheckMatrix } from './CheckMatrix'

/**
 * Generates a string (which you can pass to console.log) from the given Array Matrix.
 *
 * A matrix is a two-dimensional array (array of arrays), where all sub-arrays (rows)
 * have the same length. There must be at least two rows. This is an example matrix:
 *
 * ```
 * [
 *    [ 1, 1, 1, 1, 1, 1 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 2, 0, 1, 2, 0, 4 ],
 *    [ 2, 0, 3, 4, 0, 4 ],
 *    [ 2, 0, 0, 0, 0, 4 ],
 *    [ 3, 3, 3, 3, 3, 3 ]
 * ]
 * ```
 *
 * @function Phaser.Utils.Array.Matrix.MatrixToString
 * @since 3.0.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix]
 *
 * @param {T[][]} [matrix] - A 2-dimensional array.
 *
 * @return {string} A string representing the matrix.
 */
const MatrixToString = matrix => {
  let str = ''

  if (!CheckMatrix(matrix)) {
    return str
  }

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      const cell = matrix[r][c].toString()

      if (cell !== 'undefined') {
        str += Pad(cell, 2)
      } else {
        str += '?'
      }

      if (c < matrix[r].length - 1) {
        str += ' |'
      }
    }

    if (r < matrix.length - 1) {
      str += '\n'

      for (let i = 0; i < matrix[r].length; i++) {
        str += '---'

        if (i < matrix[r].length - 1) {
          str += '+'
        }
      }

      str += '\n'
    }
  }

  return str
}

export { MatrixToString }
