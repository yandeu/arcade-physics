/**
 * @author       Richard Davey
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Vector3 from '../../math/Vector3'

import Vector4 from '../../math/Vector4'
import GetLineToPoints from './GetLineToPoints'

//  Temp vec3
const tempIntersect = new Vector3()

/**
 * Checks for the closest point of intersection between a line segment and an array of polygons.
 *
 * If no intersection is found, this function returns `null`.
 *
 * If intersection was found, a Vector4 is returned with the following properties:
 *
 * The `x` and `y` components contain the point of the intersection.
 * The `z` component contains the closest distance.
 * The `w` component contains the index of the polygon, in the given array, that triggered the intersection.
 *
 * @function Phaser.Geom.Intersects.GetLineToPolygon
 * @since 3.50.0
 *
 * @param {Phaser.Geom.Line} line - The line segment to check.
 * @param {Phaser.Geom.Polygon | Phaser.Geom.Polygon[]} polygons - A single polygon, or array of polygons, to check.
 * @param {Phaser.Math.Vector4} [out] - A Vector4 to store the intersection results in.
 *
 * @return {Phaser.Math.Vector4} A Vector4 containing the intersection results, or `null`.
 */
const GetLineToPolygon = (line, polygons, out) => {
  if (out === undefined) {
    out = new Vector4()
  }

  if (!Array.isArray(polygons)) {
    polygons = [polygons]
  }

  let closestIntersect = false

  //  Reset our vec4s
  out.set()
  tempIntersect.set()

  for (let i = 0; i < polygons.length; i++) {
    if (GetLineToPoints(line, polygons[i].points, tempIntersect)) {
      if (!closestIntersect || tempIntersect.z < out.z) {
        out.set(tempIntersect.x, tempIntersect.y, tempIntersect.z, i)

        closestIntersect = true
      }
    }
  }

  return closestIntersect ? out : null
}

export default GetLineToPolygon
