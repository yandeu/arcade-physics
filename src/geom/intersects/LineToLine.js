/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Point from '../point/Point'

//  This is based off an explanation and expanded math presented by Paul Bourke:
//  See http:'local.wasp.uwa.edu.au/~pbourke/geometry/lineline2d/

/**
 * Checks if two Lines intersect. If the Lines are identical, they will be treated as parallel and thus non-intersecting.
 *
 * @function Phaser.Geom.Intersects.LineToLine
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line1 - The first Line to check.
 * @param {Phaser.Geom.Line} line2 - The second Line to check.
 * @param {Phaser.Geom.Point} [out] - A Point in which to optionally store the point of intersection.
 *
 * @return {boolean} `true` if the two Lines intersect, and the `out` object will be populated, if given. Otherwise, `false`.
 */
const LineToLine = (line1, line2, out) => {
  if (out === undefined) {
    out = new Point()
  }

  const x1 = line1.x1
  const y1 = line1.y1
  const x2 = line1.x2
  const y2 = line1.y2

  const x3 = line2.x1
  const y3 = line2.y1
  const x4 = line2.x2
  const y4 = line2.y2

  const numA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)
  const numB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)
  const deNom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)

  //  Make sure there is not a division by zero - this also indicates that the lines are parallel.
  //  If numA and numB were both equal to zero the lines would be on top of each other (coincidental).
  //  This check is not done because it is not necessary for this implementation (the parallel check accounts for this).

  if (deNom === 0) {
    return false
  }

  //  Calculate the intermediate fractional point that the lines potentially intersect.

  const uA = numA / deNom
  const uB = numB / deNom

  //  The fractional point will be between 0 and 1 inclusive if the lines intersect.
  //  If the fractional calculation is larger than 1 or smaller than 0 the lines would need to be longer to intersect.

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    out.x = x1 + uA * (x2 - x1)
    out.y = y1 + uA * (y2 - y1)

    return true
  }

  return false
}

export default LineToLine
