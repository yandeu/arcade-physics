/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rotate a `point` around `x` and `y` to the given `angle`, at the same distance.
 *
 * In polar notation, this maps a point from (r, t) to (r, angle), vs. the origin (x, y).
 *
 * @function Phaser.Math.RotateAround
 * @since 3.0.0
 *
 * @generic {Phaser.Types.Math.Vector2Like} T - [point,$return]
 *
 * @param {(Phaser.Geom.Point|object)} point - The point to be rotated.
 * @param {number} x - The horizontal coordinate to rotate around.
 * @param {number} y - The vertical coordinate to rotate around.
 * @param {number} angle - The angle of rotation in radians.
 *
 * @return {Phaser.Types.Math.Vector2Like} The given point.
 */
const RotateAround = (point, x, y, angle) => {
  const c = Math.cos(angle)
  const s = Math.sin(angle)

  const tx = point.x - x
  const ty = point.y - y

  point.x = tx * c - ty * s + x
  point.y = tx * s + ty * c + y

  return point
}

export default RotateAround
