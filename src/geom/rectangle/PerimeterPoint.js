/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Point from '../point/Point'

import DegToRad from '../../math/DegToRad'

/**
 * Returns a Point from the perimeter of a Rectangle based on the given angle.
 *
 * @function Phaser.Geom.Rectangle.PerimeterPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectangle - The Rectangle to get the perimeter point from.
 * @param {number} angle - The angle of the point, in degrees.
 * @param {Phaser.Geom.Point} [out] - The Point object to store the position in. If not given, a new Point instance is created.
 *
 * @return {Phaser.Geom.Point} A Point object holding the coordinates of the Rectangle perimeter.
 */
const PerimeterPoint = (rectangle, angle, out) => {
  if (out === undefined) {
    out = new Point()
  }

  angle = DegToRad(angle)

  const s = Math.sin(angle)
  const c = Math.cos(angle)

  let dx = c > 0 ? rectangle.width / 2 : rectangle.width / -2
  let dy = s > 0 ? rectangle.height / 2 : rectangle.height / -2

  if (Math.abs(dx * s) < Math.abs(dy * c)) {
    dy = (dx * s) / c
  } else {
    dx = (dy * c) / s
  }

  out.x = dx + rectangle.centerX
  out.y = dy + rectangle.centerY

  return out
}

export default PerimeterPoint
