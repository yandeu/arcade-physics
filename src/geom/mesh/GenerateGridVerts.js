/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Face from './Face'

import GetFastValue from '../../utils/object/GetFastValue'
import Matrix4 from '../../math/Matrix4'
import Vector3 from '../../math/Vector3'
import Vertex from './Vertex'

const tempPosition = new Vector3()
const tempRotation = new Vector3()
const tempMatrix = new Matrix4()

/**
 * Creates a grid of vertices based on the given configuration object and optionally adds it to a Mesh.
 *
 * The size of the grid is given in pixels. An example configuration may be:
 *
 * `{ width: 256, height: 256, widthSegments: 2, heightSegments: 2, tile: true }`
 *
 * This will create a grid 256 x 256 pixels in size, split into 2 x 2 segments, with
 * the texture tiling across the cells.
 *
 * You can split the grid into segments both vertically and horizontally. This will
 * generate two faces per grid segment as a result.
 *
 * The `tile` parameter allows you to control if the tile will repeat across the grid
 * segments, or be displayed in full.
 *
 * If adding this grid to a Mesh you can offset the grid via the `x` and `y` properties.
 *
 * UV coordinates are generated based on the given texture and frame in the config. For
 * example, no frame is given, the UVs will be in the range 0 to 1. If a frame is given,
 * such as from a texture atlas, the UVs will be generated within the range of that frame.
 *
 * @function Phaser.Geom.Mesh.GenerateGridVerts
 * @since 3.50.0
 *
 * @param {Phaser.Types.Geom.Mesh.GenerateGridConfig} config - A Grid configuration object.
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateGridVertsResult} A Grid Result object, containing the generated vertices and indicies.
 */
const GenerateGridVerts = config => {
  const mesh = GetFastValue(config, 'mesh')
  let texture = GetFastValue(config, 'texture', null)
  const frame = GetFastValue(config, 'frame')
  let width = GetFastValue(config, 'width', 1)
  let height = GetFastValue(config, 'height', width)
  const widthSegments = GetFastValue(config, 'widthSegments', 1)
  const heightSegments = GetFastValue(config, 'heightSegments', widthSegments)
  const posX = GetFastValue(config, 'x', 0)
  const posY = GetFastValue(config, 'y', 0)
  const posZ = GetFastValue(config, 'z', 0)
  const rotateX = GetFastValue(config, 'rotateX', 0)
  const rotateY = GetFastValue(config, 'rotateY', 0)
  const rotateZ = GetFastValue(config, 'rotateZ', 0)
  const zIsUp = GetFastValue(config, 'zIsUp', true)
  const isOrtho = GetFastValue(config, 'isOrtho', mesh ? mesh.dirtyCache[11] : false)
  let colors = GetFastValue(config, 'colors', [0xffffff])
  let alphas = GetFastValue(config, 'alphas', [1])
  const tile = GetFastValue(config, 'tile', false)
  const flipY = GetFastValue(config, 'flipY', false)

  const widthSet = GetFastValue(config, 'width', null)

  const result = {
    faces: [],
    verts: []
  }

  tempPosition.set(posX, posY, posZ)
  tempRotation.set(rotateX, rotateY, rotateZ)
  tempMatrix.fromRotationXYTranslation(tempRotation, tempPosition, zIsUp)

  if (!texture && mesh) {
    texture = mesh.texture
  } else if (mesh && typeof texture === 'string') {
    texture = mesh.scene.sys.textures.get(texture)
  } else {
    //  There's nothing more we can do without a texture
    return result
  }

  const textureFrame = texture.get(frame)

  //  If the Mesh is ortho and no width / height is given, we'll default to texture sizes (if set!)
  if (!widthSet && isOrtho && texture && mesh) {
    width = textureFrame.width / mesh.height
    height = textureFrame.height / mesh.height
  }

  const halfWidth = width / 2
  const halfHeight = height / 2

  const gridX = Math.floor(widthSegments)
  const gridY = Math.floor(heightSegments)

  const gridX1 = gridX + 1
  const gridY1 = gridY + 1

  const segmentWidth = width / gridX
  const segmentHeight = height / gridY

  const uvs = []
  const vertices = []

  let ix
  let iy

  let frameU0 = 0
  let frameU1 = 1
  let frameV0 = 0
  let frameV1 = 1

  if (textureFrame) {
    frameU0 = textureFrame.u0
    frameU1 = textureFrame.u1

    if (!flipY) {
      frameV0 = textureFrame.v0
      frameV1 = textureFrame.v1
    } else {
      frameV0 = textureFrame.v1
      frameV1 = textureFrame.v0
    }
  }

  const frameU = frameU1 - frameU0
  const frameV = frameV1 - frameV0

  for (iy = 0; iy < gridY1; iy++) {
    const y = iy * segmentHeight - halfHeight

    for (ix = 0; ix < gridX1; ix++) {
      const x = ix * segmentWidth - halfWidth

      vertices.push(x, -y)

      const tu = frameU0 + frameU * (ix / gridX)
      const tv = frameV0 + frameV * (iy / gridY)

      uvs.push(tu, tv)
    }
  }

  if (!Array.isArray(colors)) {
    colors = [colors]
  }

  if (!Array.isArray(alphas)) {
    alphas = [alphas]
  }

  let alphaIndex = 0
  let colorIndex = 0

  for (iy = 0; iy < gridY; iy++) {
    for (ix = 0; ix < gridX; ix++) {
      const a = (ix + gridX1 * iy) * 2
      const b = (ix + gridX1 * (iy + 1)) * 2
      const c = (ix + 1 + gridX1 * (iy + 1)) * 2
      const d = (ix + 1 + gridX1 * iy) * 2

      const color = colors[colorIndex]
      const alpha = alphas[alphaIndex]

      const vert1 = new Vertex(vertices[a], vertices[a + 1], 0, uvs[a], uvs[a + 1], color, alpha).transformMat4(
        tempMatrix
      )
      const vert2 = new Vertex(vertices[b], vertices[b + 1], 0, uvs[b], uvs[b + 1], color, alpha).transformMat4(
        tempMatrix
      )
      const vert3 = new Vertex(vertices[d], vertices[d + 1], 0, uvs[d], uvs[d + 1], color, alpha).transformMat4(
        tempMatrix
      )
      const vert4 = new Vertex(vertices[b], vertices[b + 1], 0, uvs[b], uvs[b + 1], color, alpha).transformMat4(
        tempMatrix
      )
      const vert5 = new Vertex(vertices[c], vertices[c + 1], 0, uvs[c], uvs[c + 1], color, alpha).transformMat4(
        tempMatrix
      )
      const vert6 = new Vertex(vertices[d], vertices[d + 1], 0, uvs[d], uvs[d + 1], color, alpha).transformMat4(
        tempMatrix
      )

      if (tile) {
        vert1.setUVs(frameU0, frameV1)
        vert2.setUVs(frameU0, frameV0)
        vert3.setUVs(frameU1, frameV1)
        vert4.setUVs(frameU0, frameV0)
        vert5.setUVs(frameU1, frameV0)
        vert6.setUVs(frameU1, frameV1)
      }

      colorIndex++

      if (colorIndex === colors.length) {
        colorIndex = 0
      }

      alphaIndex++

      if (alphaIndex === alphas.length) {
        alphaIndex = 0
      }

      result.verts.push(vert1, vert2, vert3, vert4, vert5, vert6)

      result.faces.push(new Face(vert1, vert2, vert3), new Face(vert4, vert5, vert6))
    }
  }

  if (mesh) {
    mesh.faces = mesh.faces.concat(result.faces)
    mesh.vertices = mesh.vertices.concat(result.verts)
  }

  return result
}

export default GenerateGridVerts
