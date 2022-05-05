/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       @samme
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import FloatBetween from '../FloatBetween'

/**
 * Returns a random angle in the range [-pi, pi].
 *
 * @function Phaser.Math.Angle.Random
 * @since 3.23.0
 *
 * @return {number} The angle, in radians.
 */
const Random = () => {
  return FloatBetween(-Math.PI, Math.PI)
}

export default Random
