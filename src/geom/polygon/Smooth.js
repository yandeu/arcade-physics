/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Igor Ognichenko <ognichenko.igor@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @ignore
 */
const copy = (out, a) => {
  out[0] = a[0]
  out[1] = a[1]

  return out
}

/**
 * Takes a Polygon object and applies Chaikin's smoothing algorithm on its points.
 *
 * @function Phaser.Geom.Polygon.Smooth
 * @since 3.13.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon to be smoothed. The polygon will be modified in-place and returned.
 *
 * @return {Phaser.Geom.Polygon} The input polygon.
 */
const Smooth = polygon => {
  let i
  const points = []
  const data = polygon.points

  for (i = 0; i < data.length; i++) {
    points.push([data[i].x, data[i].y])
  }

  const output = []

  if (points.length > 0) {
    output.push(copy([0, 0], points[0]))
  }

  for (i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const p0x = p0[0]
    const p0y = p0[1]
    const p1x = p1[0]
    const p1y = p1[1]

    output.push([0.85 * p0x + 0.15 * p1x, 0.85 * p0y + 0.15 * p1y])
    output.push([0.15 * p0x + 0.85 * p1x, 0.15 * p0y + 0.85 * p1y])
  }

  if (points.length > 1) {
    output.push(copy([0, 0], points[points.length - 1]))
  }

  return polygon.setTo(output)
}

export default Smooth
