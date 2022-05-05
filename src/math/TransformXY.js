/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Vector2 from './Vector2'

/**
 * Takes the `x` and `y` coordinates and transforms them into the same space as
 * defined by the position, rotation and scale values.
 *
 * @function Phaser.Math.TransformXY
 * @since 3.0.0
 *
 * @param {number} x - The x coordinate to be transformed.
 * @param {number} y - The y coordinate to be transformed.
 * @param {number} positionX - Horizontal position of the transform point.
 * @param {number} positionY - Vertical position of the transform point.
 * @param {number} rotation - Rotation of the transform point, in radians.
 * @param {number} scaleX - Horizontal scale of the transform point.
 * @param {number} scaleY - Vertical scale of the transform point.
 * @param {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} [output] - The output vector, point or object for the translated coordinates.
 *
 * @return {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} The translated point.
 */
const TransformXY = (x, y, positionX, positionY, rotation, scaleX, scaleY, output) => {
  if (output === undefined) {
    output = new Vector2()
  }

  const radianSin = Math.sin(rotation)
  const radianCos = Math.cos(rotation)

  // Rotate and Scale
  const a = radianCos * scaleX
  const b = radianSin * scaleX
  const c = -radianSin * scaleY
  const d = radianCos * scaleY

  //  Invert
  const id = 1 / (a * d + c * -b)

  output.x = d * id * x + -c * id * y + (positionY * c - positionX * d) * id
  output.y = a * id * y + -b * id * x + (-positionY * a + positionX * b) * id

  return output
}

export default TransformXY
