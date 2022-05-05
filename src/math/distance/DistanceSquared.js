/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two sets of coordinates (points), squared.
 *
 * @function Phaser.Math.Distance.Squared
 * @since 3.0.0
 *
 * @param {number} x1 - The x coordinate of the first point.
 * @param {number} y1 - The y coordinate of the first point.
 * @param {number} x2 - The x coordinate of the second point.
 * @param {number} y2 - The y coordinate of the second point.
 *
 * @return {number} The distance between each point, squared.
 */
const DistanceSquared = (x1, y1, x2, y2) => {
  const dx = x1 - x2
  const dy = y1 - y2

  return dx * dx + dy * dy
}

export default DistanceSquared
