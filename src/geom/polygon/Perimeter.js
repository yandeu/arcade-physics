/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Length from '../line/Length'

import Line from '../line/Line'

/**
 * Returns the perimeter of the given Polygon.
 *
 * @function Phaser.Geom.Polygon.Perimeter
 * @since 3.12.0
 *
 * @param {Phaser.Geom.Polygon} polygon - The Polygon to get the perimeter of.
 *
 * @return {number} The perimeter of the Polygon.
 */
const Perimeter = polygon => {
  const points = polygon.points
  let perimeter = 0

  for (let i = 0; i < points.length; i++) {
    const pointA = points[i]
    const pointB = points[(i + 1) % points.length]
    const line = new Line(pointA.x, pointA.y, pointB.x, pointB.y)

    perimeter += Length(line)
  }

  return perimeter
}

export default Perimeter
