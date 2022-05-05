/**
 * @author       Florian Vazelle
 * @author       Geoffrey Glaive
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Point from '../point/Point'

import LineToCircle from './LineToCircle'

/**
 * Checks for intersection between the line segment and circle,
 * and returns the intersection points as a Point object array.
 *
 * @function Phaser.Geom.Intersects.GetLineToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line segment to check.
 * @param {Phaser.Geom.Circle} circle - The circle to check against the line.
 * @param {array} [out] - An optional array in which to store the points of intersection.
 *
 * @return {array} An array with the points of intersection if objects intersect, otherwise an empty array.
 */
const GetLineToCircle = (line, circle, out) => {
  if (out === undefined) {
    out = []
  }

  if (LineToCircle(line, circle)) {
    const lx1 = line.x1
    const ly1 = line.y1

    const lx2 = line.x2
    const ly2 = line.y2

    const cx = circle.x
    const cy = circle.y
    const cr = circle.radius

    const lDirX = lx2 - lx1
    const lDirY = ly2 - ly1
    const oDirX = lx1 - cx
    const oDirY = ly1 - cy

    const coefficientA = lDirX * lDirX + lDirY * lDirY
    const coefficientB = 2 * (lDirX * oDirX + lDirY * oDirY)
    const coefficientC = oDirX * oDirX + oDirY * oDirY - cr * cr

    const lambda = coefficientB * coefficientB - 4 * coefficientA * coefficientC

    let x, y

    if (lambda === 0) {
      const root = -coefficientB / (2 * coefficientA)
      x = lx1 + root * lDirX
      y = ly1 + root * lDirY
      if (root >= 0 && root <= 1) {
        out.push(new Point(x, y))
      }
    } else if (lambda > 0) {
      const root1 = (-coefficientB - Math.sqrt(lambda)) / (2 * coefficientA)
      x = lx1 + root1 * lDirX
      y = ly1 + root1 * lDirY
      if (root1 >= 0 && root1 <= 1) {
        out.push(new Point(x, y))
      }

      const root2 = (-coefficientB + Math.sqrt(lambda)) / (2 * coefficientA)
      x = lx1 + root2 * lDirX
      y = ly1 + root2 * lDirY
      if (root2 >= 0 && root2 <= 1) {
        out.push(new Point(x, y))
      }
    }
  }

  return out
}

export default GetLineToCircle
