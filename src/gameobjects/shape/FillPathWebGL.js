/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Utils from '../../renderer/webgl/Utils'

/**
 * Renders a filled path for the given Shape.
 *
 * @method Phaser.GameObjects.Shape#FillPathWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The WebGL Pipeline used to render this Shape.
 * @param {Phaser.GameObjects.Components.TransformMatrix} calcMatrix - The transform matrix used to get the position values.
 * @param {Phaser.GameObjects.Shape} src - The Game Object shape being rendered in this call.
 * @param {number} alpha - The base alpha value.
 * @param {number} dx - The source displayOriginX.
 * @param {number} dy - The source displayOriginY.
 */
const FillPathWebGL = (pipeline, calcMatrix, src, alpha, dx, dy) => {
  const fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha)

  const path = src.pathData
  const pathIndexes = src.pathIndexes

  for (let i = 0; i < pathIndexes.length; i += 3) {
    const p0 = pathIndexes[i] * 2
    const p1 = pathIndexes[i + 1] * 2
    const p2 = pathIndexes[i + 2] * 2

    const x0 = path[p0 + 0] - dx
    const y0 = path[p0 + 1] - dy
    const x1 = path[p1 + 0] - dx
    const y1 = path[p1 + 1] - dy
    const x2 = path[p2 + 0] - dx
    const y2 = path[p2 + 1] - dy

    const tx0 = calcMatrix.getX(x0, y0)
    const ty0 = calcMatrix.getY(x0, y0)

    const tx1 = calcMatrix.getX(x1, y1)
    const ty1 = calcMatrix.getY(x1, y1)

    const tx2 = calcMatrix.getX(x2, y2)
    const ty2 = calcMatrix.getY(x2, y2)

    pipeline.batchTri(src, tx0, ty0, tx1, ty1, tx2, ty2, 0, 0, 1, 1, fillTintColor, fillTintColor, fillTintColor, 2)
  }
}

export default FillPathWebGL
