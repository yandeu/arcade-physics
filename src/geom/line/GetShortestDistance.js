/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Florian Mertens
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Get the shortest distance from a Line to the given Point.
 *
 * @function Phaser.Geom.Line.GetShortestDistance
 * @since 3.16.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Line} line - The line to get the distance from.
 * @param {(Phaser.Geom.Point|object)} point - The point to get the shortest distance to.
 *
 * @return {number} The shortest distance from the line to the point.
 */
const GetShortestDistance = (line, point) => {
  const x1 = line.x1
  const y1 = line.y1

  const x2 = line.x2
  const y2 = line.y2

  const L2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)

  if (L2 === 0) {
    return false
  }

  const s = ((y1 - point.y) * (x2 - x1) - (x1 - point.x) * (y2 - y1)) / L2

  return Math.abs(s) * Math.sqrt(L2)
}

export default GetShortestDistance
