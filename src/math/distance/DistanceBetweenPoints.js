/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the distance between two points.
 *
 * @function Phaser.Math.Distance.BetweenPoints
 * @since 3.22.0
 *
 * @param {Phaser.Types.Math.Vector2Like} a - The first point.
 * @param {Phaser.Types.Math.Vector2Like} b - The second point.
 *
 * @return {number} The distance between the points.
 */
const DistanceBetweenPoints = (a, b) => {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return Math.sqrt(dx * dx + dy * dy)
}

export default DistanceBetweenPoints
