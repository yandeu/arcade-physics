/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Normalize from './Normalize'

/**
 * Reverse the given angle.
 *
 * @function Phaser.Math.Angle.Reverse
 * @since 3.0.0
 *
 * @param {number} angle - The angle to reverse, in radians.
 *
 * @return {number} The reversed angle, in radians.
 */
const Reverse = angle => {
  return Normalize(angle + Math.PI)
}

export default Reverse
