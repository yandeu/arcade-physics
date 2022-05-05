/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Face from './Face'

import Vertex from './Vertex'

/**
 * Generates a set of Face and Vertex objects by parsing the given data.
 *
 * This method will take vertex data in one of two formats, based on the `containsZ` parameter.
 *
 * If your vertex data are `x`, `y` pairs, then `containsZ` should be `false` (this is the default)
 *
 * If your vertex data is groups of `x`, `y` and `z` values, then the `containsZ` parameter must be true.
 *
 * The `uvs` parameter is a numeric array consisting of `u` and `v` pairs.
 *
 * The `normals` parameter is a numeric array consisting of `x`, `y` vertex normal values and, if `containsZ` is true, `z` values as well.
 *
 * The `indicies` parameter is an optional array that, if given, is an indexed list of vertices to be added.
 *
 * The `colors` parameter is an optional array, or single value, that if given sets the color of each vertex created.
 *
 * The `alphas` parameter is an optional array, or single value, that if given sets the alpha of each vertex created.
 *
 * When providing indexed data it is assumed that _all_ of the arrays are indexed, not just the vertices.
 *
 * The following example will create a 256 x 256 sized quad using an index array:
 *
 * ```javascript
 * const vertices = [
 *   -128, 128,
 *   128, 128,
 *   -128, -128,
 *   128, -128
 * ];
 *
 * const uvs = [
 *   0, 1,
 *   1, 1,
 *   0, 0,
 *   1, 0
 * ];
 *
 * const indices = [ 0, 2, 1, 2, 3, 1 ];
 *
 * GenerateVerts(vertices, uvs, indicies);
 * ```
 *
 * If the data is not indexed, it's assumed that the arrays all contain sequential data.
 *
 * @function Phaser.Geom.Mesh.GenerateVerts
 * @since 3.50.0
 *
 * @param {number[]} vertices - The vertices array. Either `xy` pairs, or `xyz` if the `containsZ` parameter is `true`.
 * @param {number[]} uvs - The UVs pairs array.
 * @param {number[]} [indicies] - Optional vertex indicies array. If you don't have one, pass `null` or an empty array.
 * @param {boolean} [containsZ=false] - Does the vertices data include a `z` component?
 * @param {number[]} [normals] - Optional vertex normals array. If you don't have one, pass `null` or an empty array.
 * @param {number|number[]} [colors=0xffffff] - An array of colors, one per vertex, or a single color value applied to all vertices.
 * @param {number|number[]} [alphas=1] - An array of alpha values, one per vertex, or a single alpha value applied to all vertices.
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateVertsResult} The parsed Face and Vertex objects.
 */
const GenerateVerts = (vertices, uvs, indicies, containsZ, normals, colors, alphas) => {
  if (containsZ === undefined) {
    containsZ = false
  }
  if (colors === undefined) {
    colors = 0xffffff
  }
  if (alphas === undefined) {
    alphas = 1
  }

  if (vertices.length !== uvs.length) {
    console.warn('GenerateVerts: vertices and uvs count not equal')
    return
  }

  const result = {
    faces: [],
    vertices: []
  }

  let i

  let x
  let y
  let z

  let u
  let v

  let color
  let alpha

  let normalX
  let normalY
  let normalZ

  const iInc = containsZ ? 3 : 2

  const isColorArray = Array.isArray(colors)
  const isAlphaArray = Array.isArray(alphas)

  if (Array.isArray(indicies) && indicies.length > 0) {
    for (i = 0; i < indicies.length; i++) {
      const index1 = indicies[i]
      const index2 = indicies[i] * 2
      const index3 = indicies[i] * iInc

      x = vertices[index3]
      y = vertices[index3 + 1]
      z = containsZ ? vertices[index3 + 2] : 0

      u = uvs[index2]
      v = uvs[index2 + 1]

      color = isColorArray ? colors[index1] : colors
      alpha = isAlphaArray ? alphas[index1] : alphas

      normalX = 0
      normalY = 0
      normalZ = 0

      if (normals) {
        normalX = normals[index3]
        normalY = normals[index3 + 1]
        normalZ = containsZ ? normals[index3 + 2] : 0
      }

      result.vertices.push(new Vertex(x, y, z, u, v, color, alpha, normalX, normalY, normalZ))
    }
  } else {
    let uvIndex = 0
    let colorIndex = 0

    for (i = 0; i < vertices.length; i += iInc) {
      x = vertices[i]
      y = vertices[i + 1]
      z = containsZ ? vertices[i + 2] : 0

      u = uvs[uvIndex]
      v = uvs[uvIndex + 1]

      color = isColorArray ? colors[colorIndex] : colors
      alpha = isAlphaArray ? alphas[colorIndex] : alphas

      normalX = 0
      normalY = 0
      normalZ = 0

      if (normals) {
        normalX = normals[i]
        normalY = normals[i + 1]
        normalZ = containsZ ? normals[i + 2] : 0
      }

      result.vertices.push(new Vertex(x, y, z, u, v, color, alpha, normalX, normalY, normalZ))

      uvIndex += 2
      colorIndex++
    }
  }

  for (i = 0; i < result.vertices.length; i += 3) {
    const vert1 = result.vertices[i]
    const vert2 = result.vertices[i + 1]
    const vert3 = result.vertices[i + 2]

    result.faces.push(new Face(vert1, vert2, vert3))
  }

  return result
}

export default GenerateVerts
