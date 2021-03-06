/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sinusoidal ease-out.
 *
 * @function Phaser.Math.Easing.Sine.Out
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
const Out = v => {
  if (v === 0) {
    return 0
  } else if (v === 1) {
    return 1
  } else {
    return Math.sin((v * Math.PI) / 2)
  }
}

export default Out
