/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Center a line on the given coordinates.
 *
 * @function Phaser.Geom.Line.CenterOn
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line to center.
 * @param {number} x - The horizontal coordinate to center the line on.
 * @param {number} y - The vertical coordinate to center the line on.
 *
 * @return {Phaser.Geom.Line} The centered line.
 */
const CenterOn = (line, x, y) => {
  const tx = x - (line.x1 + line.x2) / 2
  const ty = y - (line.y1 + line.y2) / 2

  line.x1 += tx
  line.y1 += ty

  line.x2 += tx
  line.y2 += ty

  return line
}

export default CenterOn
