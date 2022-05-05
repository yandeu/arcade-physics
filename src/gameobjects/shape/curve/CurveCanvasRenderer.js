/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import FillStyleCanvas from '../FillStyleCanvas'

import LineStyleCanvas from '../LineStyleCanvas'
import SetTransform from '../../../renderer/canvas/utils/SetTransform'

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Curve#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Curve} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
const CurveCanvasRenderer = (renderer, src, camera, parentMatrix) => {
  camera.addToRenderList(src)

  const ctx = renderer.currentContext

  if (SetTransform(renderer, ctx, src, camera, parentMatrix)) {
    const dx = src._displayOriginX + src._curveBounds.x
    const dy = src._displayOriginY + src._curveBounds.y

    const path = src.pathData
    let pathLength = path.length - 1

    const px1 = path[0] - dx
    const py1 = path[1] - dy

    ctx.beginPath()

    ctx.moveTo(px1, py1)

    if (!src.closePath) {
      pathLength -= 2
    }

    for (let i = 2; i < pathLength; i += 2) {
      const px2 = path[i] - dx
      const py2 = path[i + 1] - dy

      ctx.lineTo(px2, py2)
    }

    if (src.closePath) {
      ctx.closePath()
    }

    if (src.isFilled) {
      FillStyleCanvas(ctx, src)

      ctx.fill()
    }

    if (src.isStroked) {
      LineStyleCanvas(ctx, src)

      ctx.stroke()
    }

    //  Restore the context saved in SetTransform
    ctx.restore()
  }
}

export default CurveCanvasRenderer
