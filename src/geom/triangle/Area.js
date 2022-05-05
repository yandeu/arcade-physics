/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// The 2D area of a triangle. The area value is always non-negative.

/**
 * Returns the area of a Triangle.
 *
 * @function Phaser.Geom.Triangle.Area
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to use.
 *
 * @return {number} The area of the Triangle, always non-negative.
 */
const Area = triangle => {
  const x1 = triangle.x1
  const y1 = triangle.y1

  const x2 = triangle.x2
  const y2 = triangle.y2

  const x3 = triangle.x3
  const y3 = triangle.y3

  return Math.abs(((x3 - x1) * (y2 - y1) - (x2 - x1) * (y3 - y1)) / 2)
}

export default Area
