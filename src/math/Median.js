/**
 * @author       Vladislav Forsh <vlad@robowhale.com>
 * @copyright    2021 RoboWhale
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the median of the given values. The values are sorted and the middle value is returned.
 * In case of an even number of values, the average of the two middle values is returned.
 *
 * @function Phaser.Math.Median
 * @since 3.54.0
 *
 * @param {number[]} values - The values to average.
 *
 * @return {number} The median value.
 */
const Median = values => {
  const valuesNum = values.length
  if (valuesNum === 0) {
    return 0
  }

  values.sort((a, b) => {
    return a - b
  })

  const halfIndex = Math.floor(valuesNum / 2)

  return valuesNum % 2 === 0 ? (values[halfIndex] + values[halfIndex - 1]) / 2 : values[halfIndex]
}

export default Median
