/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import GetCalcMatrix from '../../GetCalcMatrix'

import FillPathWebGL from '../FillPathWebGL'
import StrokePathWebGL from '../StrokePathWebGL'

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Arc#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Arc} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
const ArcWebGLRenderer = (renderer, src, camera, parentMatrix) => {
  camera.addToRenderList(src)

  const pipeline = renderer.pipelines.set(src.pipeline)

  const result = GetCalcMatrix(src, camera, parentMatrix)

  const calcMatrix = pipeline.calcMatrix.copyFrom(result.calc)

  const dx = src._displayOriginX
  const dy = src._displayOriginY

  const alpha = camera.alpha * src.alpha

  renderer.pipelines.preBatch(src)

  if (src.isFilled) {
    FillPathWebGL(pipeline, calcMatrix, src, alpha, dx, dy)
  }

  if (src.isStroked) {
    StrokePathWebGL(pipeline, src, alpha, dx, dy)
  }

  renderer.pipelines.postBatch(src)
}

export default ArcWebGLRenderer
