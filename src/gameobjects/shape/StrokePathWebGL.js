/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Utils from '../../renderer/webgl/Utils'

/**
 * Renders a stroke outline around the given Shape.
 *
 * @method Phaser.GameObjects.Shape#StrokePathWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The WebGL Pipeline used to render this Shape.
 * @param {Phaser.GameObjects.Shape} src - The Game Object shape being rendered in this call.
 * @param {number} alpha - The base alpha value.
 * @param {number} dx - The source displayOriginX.
 * @param {number} dy - The source displayOriginY.
 */
const StrokePathWebGL = (pipeline, src, alpha, dx, dy) => {
  const strokeTint = pipeline.strokeTint
  const strokeTintColor = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha)

  strokeTint.TL = strokeTintColor
  strokeTint.TR = strokeTintColor
  strokeTint.BL = strokeTintColor
  strokeTint.BR = strokeTintColor

  const path = src.pathData
  let pathLength = path.length - 1
  const lineWidth = src.lineWidth
  const halfLineWidth = lineWidth / 2

  let px1 = path[0] - dx
  let py1 = path[1] - dy

  if (!src.closePath) {
    pathLength -= 2
  }

  for (let i = 2; i < pathLength; i += 2) {
    const px2 = path[i] - dx
    const py2 = path[i + 1] - dy

    pipeline.batchLine(
      px1,
      py1,
      px2,
      py2,
      halfLineWidth,
      halfLineWidth,
      lineWidth,
      i - 2,
      src.closePath ? i === pathLength - 1 : false
    )

    px1 = px2
    py1 = py2
  }
}

export default StrokePathWebGL
