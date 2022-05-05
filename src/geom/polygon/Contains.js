/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

// Checks whether the x and y coordinates are contained within this polygon.
//  Adapted from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html by Jonas Raoni Soares Silva

/**
 * Checks if a point is within the bounds of a Polygon.
 *
 * @function Phaser.Geom.Polygon.Contains
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to check against.
 * @param {number} x - The X coordinate of the point to check.
 * @param {number} y - The Y coordinate of the point to check.
 *
 * @return {boolean} `true` if the point is within the bounds of the Polygon, otherwise `false`.
 */
const Contains = (polygon, x, y) => {
  let inside = false

  for (let i = -1, j = polygon.points.length - 1; ++i < polygon.points.length; j = i) {
    const ix = polygon.points[i].x
    const iy = polygon.points[i].y

    const jx = polygon.points[j].x
    const jy = polygon.points[j].y

    if (((iy <= y && y < jy) || (jy <= y && y < iy)) && x < ((jx - ix) * (y - iy)) / (jy - iy) + ix) {
      inside = !inside
    }
  }

  return inside
}

export default Contains
