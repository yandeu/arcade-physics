/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Bounce ease-in.
 *
 * @function Phaser.Math.Easing.Bounce.In
 * @since 3.0.0
 *
 * @param {number} v - The value to be tweened.
 *
 * @return {number} The tweened value.
 */
const In = v => {
  v = 1 - v

  if (v < 1 / 2.75) {
    return 1 - 7.5625 * v * v
  } else if (v < 2 / 2.75) {
    return 1 - (7.5625 * (v -= 1.5 / 2.75) * v + 0.75)
  } else if (v < 2.5 / 2.75) {
    return 1 - (7.5625 * (v -= 2.25 / 2.75) * v + 0.9375)
  } else {
    return 1 - (7.5625 * (v -= 2.625 / 2.75) * v + 0.984375)
  }
}

export default In
