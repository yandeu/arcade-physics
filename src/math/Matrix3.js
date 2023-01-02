/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
//  and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl

/**
 * @classdesc
 * A three-dimensional matrix.
 *
 * Defaults to the identity matrix when instantiated.
 *
 * @class Matrix3
 * @memberof Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Math.Matrix3} [m] - Optional Matrix3 to copy values from.
 */
class Matrix3 {
  constructor(m) {
    /**
     * The matrix values.
     *
     * @name Phaser.Math.Matrix3#val
     * @type {Float32Array}
     * @since 3.0.0
     */
    this.val = new Float32Array(9)

    if (m) {
      //  Assume Matrix3 with val:
      this.copy(m)
    } else {
      //  Default to identity
      this.identity()
    }
  }

  /**
   * Make a clone of this Matrix3.
   *
   * @method Phaser.Math.Matrix3#clone
   * @since 3.0.0
   *
   * @return {Phaser.Math.Matrix3} A clone of this Matrix3.
   */
  clone() {
    return new Matrix3(this)
  }

  /**
   * This method is an alias for `Matrix3.copy`.
   *
   * @method Phaser.Math.Matrix3#set
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix3} src - The Matrix to set the values of this Matrix's from.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  set(src) {
    return this.copy(src)
  }

  /**
   * Copy the values of a given Matrix into this Matrix.
   *
   * @method Phaser.Math.Matrix3#copy
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix3} src - The Matrix to copy the values from.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  copy(src) {
    const out = this.val
    const a = src.val

    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    out[3] = a[3]
    out[4] = a[4]
    out[5] = a[5]
    out[6] = a[6]
    out[7] = a[7]
    out[8] = a[8]

    return this
  }

  /**
   * Copy the values of a given Matrix4 into this Matrix3.
   *
   * @method Phaser.Math.Matrix3#fromMat4
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix4} m - The Matrix4 to copy the values from.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  fromMat4(m) {
    const a = m.val
    const out = this.val

    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    out[3] = a[4]
    out[4] = a[5]
    out[5] = a[6]
    out[6] = a[8]
    out[7] = a[9]
    out[8] = a[10]

    return this
  }

  /**
   * Set the values of this Matrix from the given array.
   *
   * @method Phaser.Math.Matrix3#fromArray
   * @since 3.0.0
   *
   * @param {array} a - The array to copy the values from.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  fromArray(a) {
    const out = this.val

    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    out[3] = a[3]
    out[4] = a[4]
    out[5] = a[5]
    out[6] = a[6]
    out[7] = a[7]
    out[8] = a[8]

    return this
  }

  /**
   * Reset this Matrix to an identity (default) matrix.
   *
   * @method Phaser.Math.Matrix3#identity
   * @since 3.0.0
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  identity() {
    const out = this.val

    out[0] = 1
    out[1] = 0
    out[2] = 0
    out[3] = 0
    out[4] = 1
    out[5] = 0
    out[6] = 0
    out[7] = 0
    out[8] = 1

    return this
  }

  /**
   * Transpose this Matrix.
   *
   * @method Phaser.Math.Matrix3#transpose
   * @since 3.0.0
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  transpose() {
    const a = this.val
    const a01 = a[1]
    const a02 = a[2]
    const a12 = a[5]

    a[1] = a[3]
    a[2] = a[6]
    a[3] = a01
    a[5] = a[7]
    a[6] = a02
    a[7] = a12

    return this
  }

  /**
   * Invert this Matrix.
   *
   * @method Phaser.Math.Matrix3#invert
   * @since 3.0.0
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  invert() {
    const a = this.val

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a10 = a[3]
    const a11 = a[4]
    const a12 = a[5]
    const a20 = a[6]
    const a21 = a[7]
    const a22 = a[8]

    const b01 = a22 * a11 - a12 * a21
    const b11 = -a22 * a10 + a12 * a20
    const b21 = a21 * a10 - a11 * a20

    // Calculate the determinant
    let det = a00 * b01 + a01 * b11 + a02 * b21

    if (!det) {
      return null
    }

    det = 1 / det

    a[0] = b01 * det
    a[1] = (-a22 * a01 + a02 * a21) * det
    a[2] = (a12 * a01 - a02 * a11) * det
    a[3] = b11 * det
    a[4] = (a22 * a00 - a02 * a20) * det
    a[5] = (-a12 * a00 + a02 * a10) * det
    a[6] = b21 * det
    a[7] = (-a21 * a00 + a01 * a20) * det
    a[8] = (a11 * a00 - a01 * a10) * det

    return this
  }

  /**
   * Calculate the adjoint, or adjugate, of this Matrix.
   *
   * @method Phaser.Math.Matrix3#adjoint
   * @since 3.0.0
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  adjoint() {
    const a = this.val

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a10 = a[3]
    const a11 = a[4]
    const a12 = a[5]
    const a20 = a[6]
    const a21 = a[7]
    const a22 = a[8]

    a[0] = a11 * a22 - a12 * a21
    a[1] = a02 * a21 - a01 * a22
    a[2] = a01 * a12 - a02 * a11
    a[3] = a12 * a20 - a10 * a22
    a[4] = a00 * a22 - a02 * a20
    a[5] = a02 * a10 - a00 * a12
    a[6] = a10 * a21 - a11 * a20
    a[7] = a01 * a20 - a00 * a21
    a[8] = a00 * a11 - a01 * a10

    return this
  }

  /**
   * Calculate the determinant of this Matrix.
   *
   * @method Phaser.Math.Matrix3#determinant
   * @since 3.0.0
   *
   * @return {number} The determinant of this Matrix.
   */
  determinant() {
    const a = this.val

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a10 = a[3]
    const a11 = a[4]
    const a12 = a[5]
    const a20 = a[6]
    const a21 = a[7]
    const a22 = a[8]

    return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20)
  }

  /**
   * Multiply this Matrix by the given Matrix.
   *
   * @method Phaser.Math.Matrix3#multiply
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix3} src - The Matrix to multiply this Matrix by.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  multiply(src) {
    const a = this.val

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a10 = a[3]
    const a11 = a[4]
    const a12 = a[5]
    const a20 = a[6]
    const a21 = a[7]
    const a22 = a[8]

    const b = src.val

    const b00 = b[0]
    const b01 = b[1]
    const b02 = b[2]
    const b10 = b[3]
    const b11 = b[4]
    const b12 = b[5]
    const b20 = b[6]
    const b21 = b[7]
    const b22 = b[8]

    a[0] = b00 * a00 + b01 * a10 + b02 * a20
    a[1] = b00 * a01 + b01 * a11 + b02 * a21
    a[2] = b00 * a02 + b01 * a12 + b02 * a22

    a[3] = b10 * a00 + b11 * a10 + b12 * a20
    a[4] = b10 * a01 + b11 * a11 + b12 * a21
    a[5] = b10 * a02 + b11 * a12 + b12 * a22

    a[6] = b20 * a00 + b21 * a10 + b22 * a20
    a[7] = b20 * a01 + b21 * a11 + b22 * a21
    a[8] = b20 * a02 + b21 * a12 + b22 * a22

    return this
  }

  /**
   * Translate this Matrix using the given Vector.
   *
   * @method Phaser.Math.Matrix3#translate
   * @since 3.0.0
   *
   * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to translate this Matrix with.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  translate(v) {
    const a = this.val
    const x = v.x
    const y = v.y

    a[6] = x * a[0] + y * a[3] + a[6]
    a[7] = x * a[1] + y * a[4] + a[7]
    a[8] = x * a[2] + y * a[5] + a[8]

    return this
  }

  /**
   * Apply a rotation transformation to this Matrix.
   *
   * @method Phaser.Math.Matrix3#rotate
   * @since 3.0.0
   *
   * @param {number} rad - The angle in radians to rotate by.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  rotate(rad) {
    const a = this.val

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a10 = a[3]
    const a11 = a[4]
    const a12 = a[5]

    const s = Math.sin(rad)
    const c = Math.cos(rad)

    a[0] = c * a00 + s * a10
    a[1] = c * a01 + s * a11
    a[2] = c * a02 + s * a12

    a[3] = c * a10 - s * a00
    a[4] = c * a11 - s * a01
    a[5] = c * a12 - s * a02

    return this
  }

  /**
   * Apply a scale transformation to this Matrix.
   *
   * Uses the `x` and `y` components of the given Vector to scale the Matrix.
   *
   * @method Phaser.Math.Matrix3#scale
   * @since 3.0.0
   *
   * @param {(Phaser.Math.Vector2|Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to scale this Matrix with.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  scale(v) {
    const a = this.val
    const x = v.x
    const y = v.y

    a[0] = x * a[0]
    a[1] = x * a[1]
    a[2] = x * a[2]

    a[3] = y * a[3]
    a[4] = y * a[4]
    a[5] = y * a[5]

    return this
  }

  /**
   * Set the values of this Matrix from the given Quaternion.
   *
   * @method Phaser.Math.Matrix3#fromQuat
   * @since 3.0.0
   *
   * @param {Phaser.Math.Quaternion} q - The Quaternion to set the values of this Matrix from.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  fromQuat(q) {
    const x = q.x
    const y = q.y
    const z = q.z
    const w = q.w

    const x2 = x + x
    const y2 = y + y
    const z2 = z + z

    const xx = x * x2
    const xy = x * y2
    const xz = x * z2

    const yy = y * y2
    const yz = y * z2
    const zz = z * z2

    const wx = w * x2
    const wy = w * y2
    const wz = w * z2

    const out = this.val

    out[0] = 1 - (yy + zz)
    out[3] = xy + wz
    out[6] = xz - wy

    out[1] = xy - wz
    out[4] = 1 - (xx + zz)
    out[7] = yz + wx

    out[2] = xz + wy
    out[5] = yz - wx
    out[8] = 1 - (xx + yy)

    return this
  }

  /**
   * Set the values of this Matrix3 to be normalized from the given Matrix4.
   *
   * @method Phaser.Math.Matrix3#normalFromMat4
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix4} m - The Matrix4 to normalize the values from.
   *
   * @return {Phaser.Math.Matrix3} This Matrix3.
   */
  normalFromMat4(m) {
    const a = m.val
    const out = this.val

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a03 = a[3]

    const a10 = a[4]
    const a11 = a[5]
    const a12 = a[6]
    const a13 = a[7]

    const a20 = a[8]
    const a21 = a[9]
    const a22 = a[10]
    const a23 = a[11]

    const a30 = a[12]
    const a31 = a[13]
    const a32 = a[14]
    const a33 = a[15]

    const b00 = a00 * a11 - a01 * a10
    const b01 = a00 * a12 - a02 * a10
    const b02 = a00 * a13 - a03 * a10
    const b03 = a01 * a12 - a02 * a11

    const b04 = a01 * a13 - a03 * a11
    const b05 = a02 * a13 - a03 * a12
    const b06 = a20 * a31 - a21 * a30
    const b07 = a20 * a32 - a22 * a30

    const b08 = a20 * a33 - a23 * a30
    const b09 = a21 * a32 - a22 * a31
    const b10 = a21 * a33 - a23 * a31
    const b11 = a22 * a33 - a23 * a32

    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

    if (!det) {
      return null
    }

    det = 1 / det

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
    out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
    out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det

    out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det
    out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det
    out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det

    out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det
    out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det
    out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det

    return this
  }
}

export default Matrix3
