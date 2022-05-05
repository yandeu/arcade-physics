/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Returns the nearest power of 2 to the given `value`.
 *
 * @function Phaser.Math.Pow2.GetNext
 * @since 3.0.0
 *
 * @param {number} value - The value.
 *
 * @return {number} The nearest power of 2 to `value`.
 */
const GetPowerOfTwo = value => {
  const index = Math.log(value) / 0.6931471805599453

  return 1 << Math.ceil(index)
}

export default GetPowerOfTwo
