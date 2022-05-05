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
 * @method Phaser.GameObjects.Grid#renderCanvas
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Grid} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
const GridCanvasRenderer = (renderer, src, camera, parentMatrix) => {
  camera.addToRenderList(src)

  const ctx = renderer.currentContext

  if (SetTransform(renderer, ctx, src, camera, parentMatrix)) {
    const dx = -src._displayOriginX
    const dy = -src._displayOriginY

    const alpha = camera.alpha * src.alpha

    //  Work out the grid size

    const width = src.width
    const height = src.height

    const cellWidth = src.cellWidth
    const cellHeight = src.cellHeight

    const gridWidth = Math.ceil(width / cellWidth)
    const gridHeight = Math.ceil(height / cellHeight)

    let cellWidthA = cellWidth
    let cellHeightA = cellHeight

    let cellWidthB = cellWidth - (gridWidth * cellWidth - width)
    let cellHeightB = cellHeight - (gridHeight * cellHeight - height)

    const showCells = src.showCells
    const showAltCells = src.showAltCells
    const showOutline = src.showOutline

    let x = 0
    let y = 0
    let r = 0
    let cw = 0
    let ch = 0

    if (showOutline) {
      //  To make room for the grid lines (in case alpha < 1)
      cellWidthA--
      cellHeightA--

      if (cellWidthB === cellWidth) {
        cellWidthB--
      }

      if (cellHeightB === cellHeight) {
        cellHeightB--
      }
    }

    if (showCells && src.fillAlpha > 0) {
      FillStyleCanvas(ctx, src)

      for (y = 0; y < gridHeight; y++) {
        if (showAltCells) {
          r = y % 2
        }

        for (x = 0; x < gridWidth; x++) {
          if (showAltCells && r) {
            r = 0
            continue
          }

          r++

          cw = x < gridWidth - 1 ? cellWidthA : cellWidthB
          ch = y < gridHeight - 1 ? cellHeightA : cellHeightB

          ctx.fillRect(dx + x * cellWidth, dy + y * cellHeight, cw, ch)
        }
      }
    }

    if (showAltCells && src.altFillAlpha > 0) {
      FillStyleCanvas(ctx, src, src.altFillColor, src.altFillAlpha * alpha)

      for (y = 0; y < gridHeight; y++) {
        if (showAltCells) {
          r = y % 2
        }

        for (x = 0; x < gridWidth; x++) {
          if (showAltCells && !r) {
            r = 1
            continue
          }

          r = 0

          cw = x < gridWidth - 1 ? cellWidthA : cellWidthB
          ch = y < gridHeight - 1 ? cellHeightA : cellHeightB

          ctx.fillRect(dx + x * cellWidth, dy + y * cellHeight, cw, ch)
        }
      }
    }

    if (showOutline && src.outlineFillAlpha > 0) {
      LineStyleCanvas(ctx, src, src.outlineFillColor, src.outlineFillAlpha * alpha)

      for (x = 1; x < gridWidth; x++) {
        const x1 = x * cellWidth

        ctx.beginPath()

        ctx.moveTo(x1 + dx, dy)
        ctx.lineTo(x1 + dx, height + dy)

        ctx.stroke()
      }

      for (y = 1; y < gridHeight; y++) {
        const y1 = y * cellHeight

        ctx.beginPath()

        ctx.moveTo(dx, y1 + dy)
        ctx.lineTo(dx + width, y1 + dy)

        ctx.stroke()
      }
    }

    //  Restore the context saved in SetTransform
    ctx.restore()
  }
}

export default GridCanvasRenderer
