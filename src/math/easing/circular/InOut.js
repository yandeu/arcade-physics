/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Circular ease-in/out.
 *
 * @function Phaser.Math.Easing.Circular.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
const InOut = v => {
  if ((v *= 2) < 1) {
    return -0.5 * (Math.sqrt(1 - v * v) - 1)
  } else {
    return 0.5 * (Math.sqrt(1 - (v -= 2) * v) + 1)
  }
}

export default InOut
