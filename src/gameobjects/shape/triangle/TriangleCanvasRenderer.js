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
 * @method Phaser.GameObjects.Triangle#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Triangle} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
const TriangleCanvasRenderer = (renderer, src, camera, parentMatrix) => {
  camera.addToRenderList(src)

  const ctx = renderer.currentContext

  if (SetTransform(renderer, ctx, src, camera, parentMatrix)) {
    const dx = src._displayOriginX
    const dy = src._displayOriginY

    const x1 = src.geom.x1 - dx
    const y1 = src.geom.y1 - dy
    const x2 = src.geom.x2 - dx
    const y2 = src.geom.y2 - dy
    const x3 = src.geom.x3 - dx
    const y3 = src.geom.y3 - dy

    ctx.beginPath()

    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x3, y3)

    ctx.closePath()

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

export default TriangleCanvasRenderer
