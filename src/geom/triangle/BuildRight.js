/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Triangle from './Triangle'

//  Builds a right triangle, with one 90 degree angle and two acute angles
//  The x/y is the coordinate of the 90 degree angle (and will map to x1/y1 in the resulting Triangle)
//  w/h can be positive or negative and represent the length of each side

/**
 * Builds a right triangle, i.e. one which has a 90-degree angle and two acute angles.
 *
 * @function Phaser.Geom.Triangle.BuildRight
 * @since 3.0.0
 *
 * @param {number} x - The X coordinate of the right angle, which will also be the first X coordinate of the constructed Triangle.
 * @param {number} y - The Y coordinate of the right angle, which will also be the first Y coordinate of the constructed Triangle.
 * @param {number} width - The length of the side which is to the left or to the right of the right angle.
 * @param {number} height - The length of the side which is above or below the right angle.
 *
 * @return {Phaser.Geom.Triangle} The constructed right Triangle.
 */
const BuildRight = (x, y, width, height) => {
  if (height === undefined) {
    height = width
  }

  //  90 degree angle
  const x1 = x
  const y1 = y

  const x2 = x
  const y2 = y - height

  const x3 = x + width
  const y3 = y

  return new Triangle(x1, y1, x2, y2, x3, y3)
}

export default BuildRight
