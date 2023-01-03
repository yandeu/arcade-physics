/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { RotateLeft } from '../RotateLeft'
import { RotateRight } from '../RotateRight'

/**
 * Translates the given Array Matrix by shifting each column and row the
 * amount specified.
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
 * @function Phaser.Utils.Array.Matrix.Translate
 * @since 3.50.0
 *
 * @generic T
 * @genericUse {T[][]} - [matrix,$return]
 *
 * @param {T[][]} [matrix] - The array matrix to translate.
 * @param {number} [x=0] - The amount to horizontally translate the matrix by.
 * @param {number} [y=0] - The amount to vertically translate the matrix by.
 *
 * @return {T[][]} The translated matrix.
 */
const TranslateMatrix = (matrix, x, y) => {
  if (x === undefined) {
    x = 0
  }
  if (y === undefined) {
    y = 0
  }

  //  Vertical translation

  if (y !== 0) {
    if (y < 0) {
      //  Shift Up
      RotateLeft(matrix, Math.abs(y))
    } else {
      //  Shift Down
      RotateRight(matrix, y)
    }
  }

  //  Horizontal translation

  if (x !== 0) {
    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i]

      if (x < 0) {
        RotateLeft(row, Math.abs(x))
      } else {
        RotateRight(row, x)
      }
    }
  }

  return matrix
}

export { TranslateMatrix }
