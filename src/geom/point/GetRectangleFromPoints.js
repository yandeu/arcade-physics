/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Rectangle from '../rectangle/Rectangle'

/**
 * Calculates the Axis Aligned Bounding Box (or aabb) from an array of points.
 *
 * @function Phaser.Geom.Point.GetRectangleFromPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [out,$return]
 *
 * @param {Phaser.Types.Math.Vector2Like[]} points - An array of Vector2Like objects to get the AABB from.
 * @param {Phaser.Geom.Rectangle} [out] - A Rectangle object to store the results in. If not given, a new Rectangle instance is created.
 *
 * @return {Phaser.Geom.Rectangle} A Rectangle object holding the AABB values for the given points.
 */
const GetRectangleFromPoints = (points, out) => {
  if (out === undefined) {
    out = new Rectangle()
  }

  let xMax = Number.NEGATIVE_INFINITY
  let xMin = Number.POSITIVE_INFINITY
  let yMax = Number.NEGATIVE_INFINITY
  let yMin = Number.POSITIVE_INFINITY

  for (let i = 0; i < points.length; i++) {
    const point = points[i]

    if (point.x > xMax) {
      xMax = point.x
    }

    if (point.x < xMin) {
      xMin = point.x
    }

    if (point.y > yMax) {
      yMax = point.y
    }

    if (point.y < yMin) {
      yMin = point.y
    }
  }

  out.x = xMin
  out.y = yMin
  out.width = xMax - xMin
  out.height = yMax - yMin

  return out
}

export default GetRectangleFromPoints
