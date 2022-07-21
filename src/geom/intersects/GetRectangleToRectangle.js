/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import GetLineToRectangle from './GetLineToRectangle'

import RectangleToRectangle from './RectangleToRectangle'

/**
 * Checks if two Rectangles intersect and returns the intersection points as a Point object array.
 *
 * A Rectangle intersects another Rectangle if any part of its bounds is within the other Rectangle's bounds. As such, the two Rectangles are considered "solid". A Rectangle with no width or no height will never intersect another Rectangle.
 *
 * @function Phaser.Geom.Intersects.GetRectangleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to check for intersection.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to check for intersection.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
const GetRectangleToRectangle = (rectA, rectB, out) => {
  if (out === undefined) {
    out = []
  }

  if (RectangleToRectangle(rectA, rectB)) {
    const lineA = rectA.getLineA()
    const lineB = rectA.getLineB()
    const lineC = rectA.getLineC()
    const lineD = rectA.getLineD()

    GetLineToRectangle(lineA, rectB, out)
    GetLineToRectangle(lineB, rectB, out)
    GetLineToRectangle(lineC, rectB, out)
    GetLineToRectangle(lineD, rectB, out)
  }

  return out
}

export default GetRectangleToRectangle