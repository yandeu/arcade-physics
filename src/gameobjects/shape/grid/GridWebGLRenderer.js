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
 * @method Phaser.GameObjects.Grid#renderWebGL
 * @since 3.13.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Grid} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
const GridWebGLRenderer = (renderer, src, camera, parentMatrix) => {
  camera.addToRenderList(src)

  const pipeline = renderer.pipelines.set(src.pipeline)

  const result = GetCalcMatrix(src, camera, parentMatrix)

  const calcMatrix = pipeline.calcMatrix.copyFrom(result.calc)

  calcMatrix.translate(-src._displayOriginX, -src._displayOriginY)

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

  let fillTint
  let fillTintColor

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

  renderer.pipelines.preBatch(src)

  if (showCells && src.fillAlpha > 0) {
    fillTint = pipeline.fillTint
    fillTintColor = Utils.getTintAppendFloatAlpha(src.fillColor, src.fillAlpha * alpha)

    fillTint.TL = fillTintColor
    fillTint.TR = fillTintColor
    fillTint.BL = fillTintColor
    fillTint.BR = fillTintColor

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

        pipeline.batchFillRect(x * cellWidth, y * cellHeight, cw, ch)
      }
    }
  }

  if (showAltCells && src.altFillAlpha > 0) {
    fillTint = pipeline.fillTint
    fillTintColor = Utils.getTintAppendFloatAlpha(src.altFillColor, src.altFillAlpha * alpha)

    fillTint.TL = fillTintColor
    fillTint.TR = fillTintColor
    fillTint.BL = fillTintColor
    fillTint.BR = fillTintColor

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

        pipeline.batchFillRect(x * cellWidth, y * cellHeight, cw, ch)
      }
    }
  }

  if (showOutline && src.outlineFillAlpha > 0) {
    const strokeTint = pipeline.strokeTint
    const color = Utils.getTintAppendFloatAlpha(src.outlineFillColor, src.outlineFillAlpha * alpha)

    strokeTint.TL = color
    strokeTint.TR = color
    strokeTint.BL = color
    strokeTint.BR = color

    for (x = 1; x < gridWidth; x++) {
      const x1 = x * cellWidth

      pipeline.batchLine(x1, 0, x1, height, 1, 1, 1, 0, false)
    }

    for (y = 1; y < gridHeight; y++) {
      const y1 = y * cellHeight

      pipeline.batchLine(0, y1, width, y1, 1, 1, 1, 0, false)
    }
  }

  renderer.pipelines.postBatch(src)
}

export default GridWebGLRenderer
