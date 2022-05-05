/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Length from '../line/Length'

import Point from '../point/Point'

/**
 * Returns an array of evenly spaced points on the perimeter of a Triangle.
 *
 * @function Phaser.Geom.Triangle.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get the points from.
 * @param {number} quantity - The number of evenly spaced points to return. Set to 0 to return an arbitrary number of points based on the `stepRate`.
 * @param {number} stepRate - If `quantity` is 0, the distance between each returned point.
 * @param {(array|Phaser.Geom.Point[])} [out] - An array to which the points should be appended.
 *
 * @return {(array|Phaser.Geom.Point[])} The modified `out` array, or a new array if none was provided.
 */
const GetPoints = (triangle, quantity, stepRate, out) => {
  if (out === undefined) {
    out = []
  }

  const line1 = triangle.getLineA()
  const line2 = triangle.getLineB()
  const line3 = triangle.getLineC()

  const length1 = Length(line1)
  const length2 = Length(line2)
  const length3 = Length(line3)

  const perimeter = length1 + length2 + length3

  //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
  if (!quantity && stepRate > 0) {
    quantity = perimeter / stepRate
  }

  for (let i = 0; i < quantity; i++) {
    let p = perimeter * (i / quantity)
    let localPosition = 0

    const point = new Point()

    //  Which line is it on?

    if (p < length1) {
      //  Line 1
      localPosition = p / length1

      point.x = line1.x1 + (line1.x2 - line1.x1) * localPosition
      point.y = line1.y1 + (line1.y2 - line1.y1) * localPosition
    } else if (p > length1 + length2) {
      //  Line 3
      p -= length1 + length2
      localPosition = p / length3

      point.x = line3.x1 + (line3.x2 - line3.x1) * localPosition
      point.y = line3.y1 + (line3.y2 - line3.y1) * localPosition
    } else {
      //  Line 2
      p -= length1
      localPosition = p / length2

      point.x = line2.x1 + (line2.x2 - line2.x1) * localPosition
      point.y = line2.y1 + (line2.y2 - line2.y1) * localPosition
    }

    out.push(point)
  }

  return out
}

export default GetPoints
