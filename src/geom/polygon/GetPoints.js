/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Length from '../line/Length'

import Line from '../line/Line'
import Perimeter from './Perimeter'

/**
 * Returns an array of Point objects containing the coordinates of the points around the perimeter of the Polygon,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Polygon.GetPoints
 * @since 3.12.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to get the points from.
 * @param {number} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the perimeter of the Polygon and dividing it by the stepRate.
 * @param {array} [output] - An array to insert the points in to. If not provided a new array will be created.
 *
 * @return {Phaser.Geom.Point[]} An array of Point objects pertaining to the points around the perimeter of the Polygon.
 */
const GetPoints = (polygon, quantity, stepRate, out) => {
  if (out === undefined) {
    out = []
  }

  const points = polygon.points
  const perimeter = Perimeter(polygon)

  //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
  if (!quantity && stepRate > 0) {
    quantity = perimeter / stepRate
  }

  for (let i = 0; i < quantity; i++) {
    const position = perimeter * (i / quantity)
    let accumulatedPerimeter = 0

    for (let j = 0; j < points.length; j++) {
      const pointA = points[j]
      const pointB = points[(j + 1) % points.length]
      const line = new Line(pointA.x, pointA.y, pointB.x, pointB.y)
      const length = Length(line)

      if (position < accumulatedPerimeter || position > accumulatedPerimeter + length) {
        accumulatedPerimeter += length
        continue
      }

      const point = line.getPoint((position - accumulatedPerimeter) / length)
      out.push(point)

      break
    }
  }

  return out
}

export default GetPoints
