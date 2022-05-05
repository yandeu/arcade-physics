/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compute a random integer between the `min` and `max` values, inclusive.
 *
 * @function Phaser.Math.Between
 * @since 3.0.0
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 *
 * @return {number} The random integer.
 */
const Between = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default Between
