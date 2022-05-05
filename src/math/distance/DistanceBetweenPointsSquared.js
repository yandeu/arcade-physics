/**
 * @author       samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the squared distance between two points.
 *
 * @function Phaser.Math.Distance.BetweenPointsSquared
 * @since 3.22.0
 *
 * @param {Phaser.Types.Math.Vector2Like} a - The first point.
 * @param {Phaser.Types.Math.Vector2Like} b - The second point.
 *
 * @return {number} The squared distance between the points.
 */
const DistanceBetweenPointsSquared = (a, b) => {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return dx * dx + dy * dy
}

export default DistanceBetweenPointsSquared
