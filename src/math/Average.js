/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the mean average of the given values.
 *
 * @function Phaser.Math.Average
 * @since 3.0.0
 *
 * @param {number[]} values - The values to average.
 *
 * @return {number} The average value.
 */
const Average = values => {
  let sum = 0

  for (let i = 0; i < values.length; i++) {
    sum += +values[i]
  }

  return sum / values.length
}

export default Average
