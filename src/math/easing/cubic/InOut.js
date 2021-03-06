/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Cubic ease-in/out.
 *
 * @function Phaser.Math.Easing.Cubic.InOut
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
const InOut = v => {
  if ((v *= 2) < 1) {
    return 0.5 * v * v * v
  } else {
    return 0.5 * ((v -= 2) * v * v + 2)
  }
}

export default InOut
