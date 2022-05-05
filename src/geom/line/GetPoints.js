/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Length from './Length'

import Point from '../point/Point'

/**
 * Get a number of points along a line's length.
 *
 * Provide a `quantity` to get an exact number of points along the line.
 *
 * Provide a `stepRate` to ensure a specific distance between each point on the line. Set `quantity` to `0` when
 * providing a `stepRate`.
 *
 * @function Phaser.Geom.Line.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {number} quantity - The number of points to place on the line. Set to `0` to use `stepRate` instead.
 * @param {number} [stepRate] - The distance between each point on the line. When set, `quantity` is implied and should be set to `0`.
 * @param {(array|Phaser.Geom.Point[])} [out] - An optional array of Points, or point-like objects, to store the coordinates of the points on the line.
 *
 * @return {(array|Phaser.Geom.Point[])} An array of Points, or point-like objects, containing the coordinates of the points on the line.
 */
const GetPoints = (line, quantity, stepRate, out) => {
  if (out === undefined) {
    out = []
  }

  //  If quantity is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
  if (!quantity && stepRate > 0) {
    quantity = Length(line) / stepRate
  }

  const x1 = line.x1
  const y1 = line.y1

  const x2 = line.x2
  const y2 = line.y2

  for (let i = 0; i < quantity; i++) {
    const position = i / quantity

    const x = x1 + (x2 - x1) * position
    const y = y1 + (y2 - y1) * position

    out.push(new Point(x, y))
  }

  return out
}

export default GetPoints
