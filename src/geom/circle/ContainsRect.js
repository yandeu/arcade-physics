/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Contains from './Contains'

/**
 * Check to see if the Circle contains all four points of the given Rectangle object.
 *
 * @function Phaser.Geom.Circle.ContainsRect
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circle - The Circle to check.
 * @param {(Phaser.Geom.Rectangle|object)} rect - The Rectangle object to check if it's within the Circle or not.
 *
 * @return {boolean} True if all of the Rectangle coordinates are within the circle, otherwise false.
 */
const ContainsRect = (circle, rect) => {
  return (
    Contains(circle, rect.x, rect.y) &&
    Contains(circle, rect.right, rect.y) &&
    Contains(circle, rect.x, rect.bottom) &&
    Contains(circle, rect.right, rect.bottom)
  )
}

export default ContainsRect
