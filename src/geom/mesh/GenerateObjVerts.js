/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Face from './Face'

import Matrix4 from '../../math/Matrix4'
import Vector3 from '../../math/Vector3'
import Vertex from './Vertex'

const tempPosition = new Vector3()
const tempRotation = new Vector3()
const tempMatrix = new Matrix4()

/**
 * This method will return an object containing Face and Vertex instances, generated
 * from the parsed triangulated OBJ Model data given to this function.
 *
 * The obj data should have been parsed in advance via the ParseObj function:
 *
 * ```javascript
 * var data = Phaser.Geom.Mesh.ParseObj(rawData, flipUV);
 *
 * var results = GenerateObjVerts(data);
 * ```
 *
 * Alternatively, you can parse obj files loaded via the OBJFile loader:
 *
 * ```javascript
 * preload ()
 * {
 *   this.load.obj('alien', 'assets/3d/alien.obj);
 * }
 *
 * var results = GenerateObjVerts(this.cache.obj.get('alien));
 * ```
 *
 * Make sure your 3D package has triangulated the model data prior to exporting it.
 *
 * You can use the data returned by this function to populate the vertices of a Mesh Game Object.
 *
 * You may add multiple models to a single Mesh, although they will act as one when
 * moved or rotated. You can scale the model data, should it be too small (or large) to visualize.
 * You can also offset the model via the `x`, `y` and `z` parameters.
 *
 * @function Phaser.Geom.Mesh.GenerateObjVerts
 * @since 3.50.0
 *
 * @param {Phaser.Types.Geom.Mesh.OBJData} data - The parsed OBJ model data.
 * @param {Phaser.GameObjects.Mesh} [mesh] - An optional Mesh Game Object. If given, the generated Faces will be automatically added to this Mesh. Set to `null` to skip.
 * @param {number} [scale=1] - An amount to scale the model data by. Use this if the model has exported too small, or large, to see.
 * @param {number} [x=0] - Translate the model x position by this amount.
 * @param {number} [y=0] - Translate the model y position by this amount.
 * @param {number} [z=0] - Translate the model z position by this amount.
 * @param {number} [rotateX=0] - Rotate the model on the x axis by this amount, in radians.
 * @param {number} [rotateY=0] - Rotate the model on the y axis by this amount, in radians.
 * @param {number} [rotateZ=0] - Rotate the model on the z axis by this amount, in radians.
 * @param {boolean} [zIsUp=true] - Is the z axis up (true), or is y axis up (false)?
 *
 * @return {Phaser.Types.Geom.Mesh.GenerateVertsResult} The parsed Face and Vertex objects.
 */
const GenerateObjVerts = (data, mesh, scale, x, y, z, rotateX, rotateY, rotateZ, zIsUp) => {
  if (scale === undefined) {
    scale = 1
  }
  if (x === undefined) {
    x = 0
  }
  if (y === undefined) {
    y = 0
  }
  if (z === undefined) {
    z = 0
  }
  if (rotateX === undefined) {
    rotateX = 0
  }
  if (rotateY === undefined) {
    rotateY = 0
  }
  if (rotateZ === undefined) {
    rotateZ = 0
  }
  if (zIsUp === undefined) {
    zIsUp = true
  }

  const result = {
    faces: [],
    verts: []
  }

  const materials = data.materials

  tempPosition.set(x, y, z)
  tempRotation.set(rotateX, rotateY, rotateZ)
  tempMatrix.fromRotationXYTranslation(tempRotation, tempPosition, zIsUp)

  for (let m = 0; m < data.models.length; m++) {
    const model = data.models[m]

    const vertices = model.vertices
    const textureCoords = model.textureCoords
    const faces = model.faces

    for (let i = 0; i < faces.length; i++) {
      const face = faces[i]

      const v1 = face.vertices[0]
      const v2 = face.vertices[1]
      const v3 = face.vertices[2]

      const m1 = vertices[v1.vertexIndex]
      const m2 = vertices[v2.vertexIndex]
      const m3 = vertices[v3.vertexIndex]

      const t1 = v1.textureCoordsIndex
      const t2 = v2.textureCoordsIndex
      const t3 = v3.textureCoordsIndex

      const uv1 = t1 === -1 ? { u: 0, v: 1 } : textureCoords[t1]
      const uv2 = t2 === -1 ? { u: 0, v: 0 } : textureCoords[t2]
      const uv3 = t3 === -1 ? { u: 1, v: 1 } : textureCoords[t3]

      let color = 0xffffff

      if (face.material !== '' && materials[face.material]) {
        color = materials[face.material]
      }

      const vert1 = new Vertex(m1.x * scale, m1.y * scale, m1.z * scale, uv1.u, uv1.v, color).transformMat4(tempMatrix)
      const vert2 = new Vertex(m2.x * scale, m2.y * scale, m2.z * scale, uv2.u, uv2.v, color).transformMat4(tempMatrix)
      const vert3 = new Vertex(m3.x * scale, m3.y * scale, m3.z * scale, uv3.u, uv3.v, color).transformMat4(tempMatrix)

      result.verts.push(vert1, vert2, vert3)
      result.faces.push(new Face(vert1, vert2, vert3))
    }
  }

  if (mesh) {
    mesh.faces = mesh.faces.concat(result.faces)
    mesh.vertices = mesh.vertices.concat(result.verts)
  }

  return result
}

export default GenerateObjVerts
