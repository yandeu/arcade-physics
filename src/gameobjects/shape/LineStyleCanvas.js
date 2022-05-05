/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets the strokeStyle and lineWidth on the target context based on the given Shape.
 *
 * @method Phaser.GameObjects.Shape#LineStyleCanvas
 * @since 3.13.0
 * @private
 *
 * @param {CanvasRenderingContext2D} ctx - The context to set the stroke style on.
 * @param {Phaser.GameObjects.Shape} src - The Game Object to set the stroke style from.
 * @param {number} [altColor] - An alternative color to render with.
 * @param {number} [altAlpha] - An alternative alpha to render with.
 */
const LineStyleCanvas = (ctx, src, altColor, altAlpha) => {
  const strokeColor = altColor ? altColor : src.strokeColor
  const strokeAlpha = altAlpha ? altAlpha : src.strokeAlpha

  const red = (strokeColor & 0xff0000) >>> 16
  const green = (strokeColor & 0xff00) >>> 8
  const blue = strokeColor & 0xff

  ctx.strokeStyle = `rgba(${red},${green},${blue},${strokeAlpha})`
  ctx.lineWidth = src.lineWidth
}

export default LineStyleCanvas
