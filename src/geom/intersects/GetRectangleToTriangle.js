/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import RectangleToTriangle from './RectangleToTriangle'

import GetLineToRectangle from './GetLineToRectangle'

/**
 * Checks for intersection between Rectangle shape and Triangle shape,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetRectangleToTriangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - Rectangle object to test.
 * @param {Phaser.Geom.Triangle} triangle - Triangle object to test.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
const GetRectangleToTriangle = (rect, triangle, out) => {
  if (out === undefined) {
    out = []
  }

  if (RectangleToTriangle(rect, triangle)) {
    const lineA = triangle.getLineA()
    const lineB = triangle.getLineB()
    const lineC = triangle.getLineC()

    GetLineToRectangle(lineA, rect, out)
    GetLineToRectangle(lineB, rect, out)
    GetLineToRectangle(lineC, rect, out)
  }

  return out
}

export default GetRectangleToTriangle
