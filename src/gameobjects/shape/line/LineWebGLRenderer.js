/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import GetCalcMatrix from '../../GetCalcMatrix'

import Utils from '../../../renderer/webgl/Utils'

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Line#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Line} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
const LineWebGLRenderer = (renderer, src, camera, parentMatrix) => {
  camera.addToRenderList(src)

  const pipeline = renderer.pipelines.set(src.pipeline)

  const result = GetCalcMatrix(src, camera, parentMatrix)

  pipeline.calcMatrix.copyFrom(result.calc)

  const dx = src._displayOriginX
  const dy = src._displayOriginY
  const alpha = camera.alpha * src.alpha

  renderer.pipelines.preBatch(src)

  if (src.isStroked) {
    const strokeTint = pipeline.strokeTint
    const color = Utils.getTintAppendFloatAlpha(src.strokeColor, src.strokeAlpha * alpha)

    strokeTint.TL = color
    strokeTint.TR = color
    strokeTint.BL = color
    strokeTint.BR = color

    const startWidth = src._startWidth
    const endWidth = src._endWidth

    pipeline.batchLine(
      src.geom.x1 - dx,
      src.geom.y1 - dy,
      src.geom.x2 - dx,
      src.geom.y2 - dy,
      startWidth,
      endWidth,
      1,
      0,
      false,
      result.sprite,
      result.camera
    )
  }

  renderer.pipelines.postBatch(src)
}

export default LineWebGLRenderer
