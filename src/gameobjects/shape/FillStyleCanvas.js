/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Sets the fillStyle on the target context based on the given Shape.
 *
 * @method Phaser.GameObjects.Shape#FillStyleCanvas
 * @since 3.13.0
 * @private
 *
 * @param {CanvasRenderingContext2D} ctx - The context to set the fill style on.
 * @param {Phaser.GameObjects.Shape} src - The Game Object to set the fill style from.
 * @param {number} [altColor] - An alternative color to render with.
 * @param {number} [altAlpha] - An alternative alpha to render with.
 */
const FillStyleCanvas = (ctx, src, altColor, altAlpha) => {
  const fillColor = altColor ? altColor : src.fillColor
  const fillAlpha = altAlpha ? altAlpha : src.fillAlpha

  const red = (fillColor & 0xff0000) >>> 16
  const green = (fillColor & 0xff00) >>> 8
  const blue = fillColor & 0xff

  ctx.fillStyle = `rgba(${red},${green},${blue},${fillAlpha})`
}

export default FillStyleCanvas
