/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Class from '../utils/Class'

import Vector3 from './Vector3'

/**
 * @ignore
 */
const EPSILON = 0.000001

/**
 * @classdesc
 * A four-dimensional matrix.
 *
 * Adapted from [gl-matrix](https://github.com/toji/gl-matrix) by toji
 * and [vecmath](https://github.com/mattdesl/vecmath) by mattdesl
 *
 * @class Matrix4
 * @memberof Phaser.Math
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Math.Matrix4} [m] - Optional Matrix4 to copy values from.
 */
class Matrix4 {
  constructor(m) {
    /**
     * The matrix values.
     *
     * @name Phaser.Math.Matrix4#val
     * @type {Float32Array}
     * @since 3.0.0
     */
    this.val = new Float32Array(16)

    if (m) {
      //  Assume Matrix4 with val:
      this.copy(m)
    } else {
      //  Default to identity
      this.identity()
    }
  }

  /**
   * Make a clone of this Matrix4.
   *
   * @method Phaser.Math.Matrix4#clone
   * @since 3.0.0
   *
   * @return {Phaser.Math.Matrix4} A clone of this Matrix4.
   */
  clone() {
    return new Matrix4(this)
  }

  /**
   * This method is an alias for `Matrix4.copy`.
   *
   * @method Phaser.Math.Matrix4#set
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix4} src - The Matrix to set the values of this Matrix's from.
   *
   * @return {this} This Matrix4.
   */
  set(src) {
    return this.copy(src)
  }

  /**
   * Sets all values of this Matrix4.
   *
   * @method Phaser.Math.Matrix4#setValues
   * @since 3.50.0
   *
   * @param {number} m00 - The m00 value.
   * @param {number} m01 - The m01 value.
   * @param {number} m02 - The m02 value.
   * @param {number} m03 - The m03 value.
   * @param {number} m10 - The m10 value.
   * @param {number} m11 - The m11 value.
   * @param {number} m12 - The m12 value.
   * @param {number} m13 - The m13 value.
   * @param {number} m20 - The m20 value.
   * @param {number} m21 - The m21 value.
   * @param {number} m22 - The m22 value.
   * @param {number} m23 - The m23 value.
   * @param {number} m30 - The m30 value.
   * @param {number} m31 - The m31 value.
   * @param {number} m32 - The m32 value.
   * @param {number} m33 - The m33 value.
   *
   * @return {this} This Matrix4 instance.
   */
  setValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    const out = this.val

    out[0] = m00
    out[1] = m01
    out[2] = m02
    out[3] = m03
    out[4] = m10
    out[5] = m11
    out[6] = m12
    out[7] = m13
    out[8] = m20
    out[9] = m21
    out[10] = m22
    out[11] = m23
    out[12] = m30
    out[13] = m31
    out[14] = m32
    out[15] = m33

    return this
  }

  /**
   * Copy the values of a given Matrix into this Matrix.
   *
   * @method Phaser.Math.Matrix4#copy
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix4} src - The Matrix to copy the values from.
   *
   * @return {this} This Matrix4.
   */
  copy(src) {
    const a = src.val

    return this.setValues(
      a[0],
      a[1],
      a[2],
      a[3],
      a[4],
      a[5],
      a[6],
      a[7],
      a[8],
      a[9],
      a[10],
      a[11],
      a[12],
      a[13],
      a[14],
      a[15]
    )
  }

  /**
   * Set the values of this Matrix from the given array.
   *
   * @method Phaser.Math.Matrix4#fromArray
   * @since 3.0.0
   *
   * @param {number[]} a - The array to copy the values from. Must have at least 16 elements.
   *
   * @return {this} This Matrix4.
   */
  fromArray(a) {
    return this.setValues(
      a[0],
      a[1],
      a[2],
      a[3],
      a[4],
      a[5],
      a[6],
      a[7],
      a[8],
      a[9],
      a[10],
      a[11],
      a[12],
      a[13],
      a[14],
      a[15]
    )
  }

  /**
   * Reset this Matrix.
   *
   * Sets all values to `0`.
   *
   * @method Phaser.Math.Matrix4#zero
   * @since 3.0.0
   *
   * @return {Phaser.Math.Matrix4} This Matrix4.
   */
  zero() {
    return this.setValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
  }

  /**
   * Generates a transform matrix based on the given position, scale and rotation.
   *
   * @method Phaser.Math.Matrix4#transform
   * @since 3.50.0
   *
   * @param {Phaser.Math.Vector3} position - The position vector.
   * @param {Phaser.Math.Vector3} scale - The scale vector.
   * @param {Phaser.Math.Quaternion} rotation - The rotation quaternion.
   *
   * @return {this} This Matrix4.
   */
  transform(position, scale, rotation) {
    const rotMatrix = _tempMat1.fromQuat(rotation)

    const rm = rotMatrix.val

    const sx = scale.x
    const sy = scale.y
    const sz = scale.z

    return this.setValues(
      rm[0] * sx,
      rm[1] * sx,
      rm[2] * sx,
      0,

      rm[4] * sy,
      rm[5] * sy,
      rm[6] * sy,
      0,

      rm[8] * sz,
      rm[9] * sz,
      rm[10] * sz,
      0,

      position.x,
      position.y,
      position.z,
      1
    )
  }

  /**
   * Set the `x`, `y` and `z` values of this Matrix.
   *
   * @method Phaser.Math.Matrix4#xyz
   * @since 3.0.0
   *
   * @param {number} x - The x value.
   * @param {number} y - The y value.
   * @param {number} z - The z value.
   *
   * @return {this} This Matrix4.
   */
  xyz(x, y, z) {
    this.identity()

    const out = this.val

    out[12] = x
    out[13] = y
    out[14] = z

    return this
  }

  /**
   * Set the scaling values of this Matrix.
   *
   * @method Phaser.Math.Matrix4#scaling
   * @since 3.0.0
   *
   * @param {number} x - The x scaling value.
   * @param {number} y - The y scaling value.
   * @param {number} z - The z scaling value.
   *
   * @return {this} This Matrix4.
   */
  scaling(x, y, z) {
    this.zero()

    const out = this.val

    out[0] = x
    out[5] = y
    out[10] = z
    out[15] = 1

    return this
  }

  /**
   * Reset this Matrix to an identity (default) matrix.
   *
   * @method Phaser.Math.Matrix4#identity
   * @since 3.0.0
   *
   * @return {this} This Matrix4.
   */
  identity() {
    return this.setValues(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  }

  /**
   * Transpose this Matrix.
   *
   * @method Phaser.Math.Matrix4#transpose
   * @since 3.0.0
   *
   * @return {this} This Matrix4.
   */
  transpose() {
    const a = this.val

    const a01 = a[1]
    const a02 = a[2]
    const a03 = a[3]
    const a12 = a[6]
    const a13 = a[7]
    const a23 = a[11]

    a[1] = a[4]
    a[2] = a[8]
    a[3] = a[12]
    a[4] = a01
    a[6] = a[9]
    a[7] = a[13]
    a[8] = a02
    a[9] = a12
    a[11] = a[14]
    a[12] = a03
    a[13] = a13
    a[14] = a23

    return this
  }

  /**
   * Copies the given Matrix4 into this Matrix and then inverses it.
   *
   * @method Phaser.Math.Matrix4#getInverse
   * @since 3.50.0
   *
   * @param {Phaser.Math.Matrix4} m - The Matrix4 to invert into this Matrix4.
   *
   * @return {this} This Matrix4.
   */
  getInverse(m) {
    this.copy(m)

    return this.invert()
  }

  /**
   * Invert this Matrix.
   *
   * @method Phaser.Math.Matrix4#invert
   * @since 3.0.0
   *
   * @return {this} This Matrix4.
   */
  invert() {
    const a = this.val

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

    //  Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

    if (!det) {
      return this
    }

    det = 1 / det

    return this.setValues(
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,
      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,
      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,
      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det
    )
  }

  /**
   * Calculate the adjoint, or adjugate, of this Matrix.
   *
   * @method Phaser.Math.Matrix4#adjoint
   * @since 3.0.0
   *
   * @return {this} This Matrix4.
   */
  adjoint() {
    const a = this.val

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

    return this.setValues(
      a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22),
      -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22)),
      a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12),
      -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12)),
      -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22)),
      a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22),
      -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12)),
      a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12),
      a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21),
      -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21)),
      a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11),
      -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11)),
      -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21)),
      a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21),
      -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11)),
      a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11)
    )
  }

  /**
   * Calculate the determinant of this Matrix.
   *
   * @method Phaser.Math.Matrix4#determinant
   * @since 3.0.0
   *
   * @return {number} The determinant of this Matrix.
   */
  determinant() {
    const a = this.val

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
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
  }

  /**
   * Multiply this Matrix by the given Matrix.
   *
   * @method Phaser.Math.Matrix4#multiply
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix4} src - The Matrix to multiply this Matrix by.
   *
   * @return {this} This Matrix4.
   */
  multiply(src) {
    const a = this.val

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

    const b = src.val

    // Cache only the current line of the second matrix
    let b0 = b[0]
    let b1 = b[1]
    let b2 = b[2]
    let b3 = b[3]

    a[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    a[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    a[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    a[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[4]
    b1 = b[5]
    b2 = b[6]
    b3 = b[7]

    a[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    a[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    a[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    a[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[8]
    b1 = b[9]
    b2 = b[10]
    b3 = b[11]

    a[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    a[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    a[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    a[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = b[12]
    b1 = b[13]
    b2 = b[14]
    b3 = b[15]

    a[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    a[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    a[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    a[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    return this
  }

  /**
   * Multiply the values of this Matrix4 by those given in the `src` argument.
   *
   * @method Phaser.Math.Matrix4#multiplyLocal
   * @since 3.0.0
   *
   * @param {Phaser.Math.Matrix4} src - The source Matrix4 that this Matrix4 is multiplied by.
   *
   * @return {this} This Matrix4.
   */
  multiplyLocal(src) {
    const a = this.val
    const b = src.val

    return this.setValues(
      a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
      a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
      a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
      a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],

      a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
      a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
      a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
      a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],

      a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
      a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
      a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
      a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],

      a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
      a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
      a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
      a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
    )
  }

  /**
   * Multiplies the given Matrix4 object with this Matrix.
   *
   * This is the same as calling `multiplyMatrices(m, this)`.
   *
   * @method Phaser.Math.Matrix4#premultiply
   * @since 3.50.0
   *
   * @param {Phaser.Math.Matrix4} m - The Matrix4 to multiply with this one.
   *
   * @return {this} This Matrix4.
   */
  premultiply(m) {
    return this.multiplyMatrices(m, this)
  }

  /**
   * Multiplies the two given Matrix4 objects and stores the results in this Matrix.
   *
   * @method Phaser.Math.Matrix4#multiplyMatrices
   * @since 3.50.0
   *
   * @param {Phaser.Math.Matrix4} a - The first Matrix4 to multiply.
   * @param {Phaser.Math.Matrix4} b - The second Matrix4 to multiply.
   *
   * @return {this} This Matrix4.
   */
  multiplyMatrices(a, b) {
    const am = a.val
    const bm = b.val

    const a11 = am[0]
    const a12 = am[4]
    const a13 = am[8]
    const a14 = am[12]
    const a21 = am[1]
    const a22 = am[5]
    const a23 = am[9]
    const a24 = am[13]
    const a31 = am[2]
    const a32 = am[6]
    const a33 = am[10]
    const a34 = am[14]
    const a41 = am[3]
    const a42 = am[7]
    const a43 = am[11]
    const a44 = am[15]

    const b11 = bm[0]
    const b12 = bm[4]
    const b13 = bm[8]
    const b14 = bm[12]
    const b21 = bm[1]
    const b22 = bm[5]
    const b23 = bm[9]
    const b24 = bm[13]
    const b31 = bm[2]
    const b32 = bm[6]
    const b33 = bm[10]
    const b34 = bm[14]
    const b41 = bm[3]
    const b42 = bm[7]
    const b43 = bm[11]
    const b44 = bm[15]

    return this.setValues(
      a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41,
      a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41,
      a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41,
      a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41,
      a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42,
      a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42,
      a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42,
      a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42,
      a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43,
      a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43,
      a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43,
      a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43,
      a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44,
      a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44,
      a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44,
      a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44
    )
  }

  /**
   * Translate this Matrix using the given Vector.
   *
   * @method Phaser.Math.Matrix4#translate
   * @since 3.0.0
   *
   * @param {(Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to translate this Matrix with.
   *
   * @return {this} This Matrix4.
   */
  translate(v) {
    return this.translateXYZ(v.x, v.y, v.z)
  }

  /**
   * Translate this Matrix using the given values.
   *
   * @method Phaser.Math.Matrix4#translateXYZ
   * @since 3.16.0
   *
   * @param {number} x - The x component.
   * @param {number} y - The y component.
   * @param {number} z - The z component.
   *
   * @return {this} This Matrix4.
   */
  translateXYZ(x, y, z) {
    const a = this.val

    a[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
    a[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
    a[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
    a[15] = a[3] * x + a[7] * y + a[11] * z + a[15]

    return this
  }

  /**
   * Apply a scale transformation to this Matrix.
   *
   * Uses the `x`, `y` and `z` components of the given Vector to scale the Matrix.
   *
   * @method Phaser.Math.Matrix4#scale
   * @since 3.0.0
   *
   * @param {(Phaser.Math.Vector3|Phaser.Math.Vector4)} v - The Vector to scale this Matrix with.
   *
   * @return {this} This Matrix4.
   */
  scale(v) {
    return this.scaleXYZ(v.x, v.y, v.z)
  }

  /**
   * Apply a scale transformation to this Matrix.
   *
   * @method Phaser.Math.Matrix4#scaleXYZ
   * @since 3.16.0
   *
   * @param {number} x - The x component.
   * @param {number} y - The y component.
   * @param {number} z - The z component.
   *
   * @return {this} This Matrix4.
   */
  scaleXYZ(x, y, z) {
    const a = this.val

    a[0] = a[0] * x
    a[1] = a[1] * x
    a[2] = a[2] * x
    a[3] = a[3] * x

    a[4] = a[4] * y
    a[5] = a[5] * y
    a[6] = a[6] * y
    a[7] = a[7] * y

    a[8] = a[8] * z
    a[9] = a[9] * z
    a[10] = a[10] * z
    a[11] = a[11] * z

    return this
  }

  /**
   * Derive a rotation matrix around the given axis.
   *
   * @method Phaser.Math.Matrix4#makeRotationAxis
   * @since 3.0.0
   *
   * @param {(Phaser.Math.Vector3|Phaser.Math.Vector4)} axis - The rotation axis.
   * @param {number} angle - The rotation angle in radians.
   *
   * @return {this} This Matrix4.
   */
  makeRotationAxis(axis, angle) {
    // Based on http://www.gamedev.net/reference/articles/article1199.asp

    const c = Math.cos(angle)
    const s = Math.sin(angle)
    const t = 1 - c
    const x = axis.x
    const y = axis.y
    const z = axis.z
    const tx = t * x
    const ty = t * y

    return this.setValues(
      tx * x + c,
      tx * y - s * z,
      tx * z + s * y,
      0,
      tx * y + s * z,
      ty * y + c,
      ty * z - s * x,
      0,
      tx * z - s * y,
      ty * z + s * x,
      t * z * z + c,
      0,
      0,
      0,
      0,
      1
    )
  }

  /**
   * Apply a rotation transformation to this Matrix.
   *
   * @method Phaser.Math.Matrix4#rotate
   * @since 3.0.0
   *
   * @param {number} rad - The angle in radians to rotate by.
   * @param {Phaser.Math.Vector3} axis - The axis to rotate upon.
   *
   * @return {this} This Matrix4.
   */
  rotate(rad, axis) {
    const a = this.val
    let x = axis.x
    let y = axis.y
    let z = axis.z
    let len = Math.sqrt(x * x + y * y + z * z)

    if (Math.abs(len) < EPSILON) {
      return this
    }

    len = 1 / len
    x *= len
    y *= len
    z *= len

    const s = Math.sin(rad)
    const c = Math.cos(rad)
    const t = 1 - c

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

    //  Construct the elements of the rotation matrix
    const b00 = x * x * t + c
    const b01 = y * x * t + z * s
    const b02 = z * x * t - y * s

    const b10 = x * y * t - z * s
    const b11 = y * y * t + c
    const b12 = z * y * t + x * s

    const b20 = x * z * t + y * s
    const b21 = y * z * t - x * s
    const b22 = z * z * t + c

    //  Perform rotation-specific matrix multiplication
    return this.setValues(
      a00 * b00 + a10 * b01 + a20 * b02,
      a01 * b00 + a11 * b01 + a21 * b02,
      a02 * b00 + a12 * b01 + a22 * b02,
      a03 * b00 + a13 * b01 + a23 * b02,
      a00 * b10 + a10 * b11 + a20 * b12,
      a01 * b10 + a11 * b11 + a21 * b12,
      a02 * b10 + a12 * b11 + a22 * b12,
      a03 * b10 + a13 * b11 + a23 * b12,
      a00 * b20 + a10 * b21 + a20 * b22,
      a01 * b20 + a11 * b21 + a21 * b22,
      a02 * b20 + a12 * b21 + a22 * b22,
      a03 * b20 + a13 * b21 + a23 * b22,
      a30,
      a31,
      a32,
      a33
    )
  }

  /**
   * Rotate this matrix on its X axis.
   *
   * @method Phaser.Math.Matrix4#rotateX
   * @since 3.0.0
   *
   * @param {number} rad - The angle in radians to rotate by.
   *
   * @return {this} This Matrix4.
   */
  rotateX(rad) {
    const a = this.val
    const s = Math.sin(rad)
    const c = Math.cos(rad)

    const a10 = a[4]
    const a11 = a[5]
    const a12 = a[6]
    const a13 = a[7]

    const a20 = a[8]
    const a21 = a[9]
    const a22 = a[10]
    const a23 = a[11]

    //  Perform axis-specific matrix multiplication
    a[4] = a10 * c + a20 * s
    a[5] = a11 * c + a21 * s
    a[6] = a12 * c + a22 * s
    a[7] = a13 * c + a23 * s
    a[8] = a20 * c - a10 * s
    a[9] = a21 * c - a11 * s
    a[10] = a22 * c - a12 * s
    a[11] = a23 * c - a13 * s

    return this
  }

  /**
   * Rotate this matrix on its Y axis.
   *
   * @method Phaser.Math.Matrix4#rotateY
   * @since 3.0.0
   *
   * @param {number} rad - The angle to rotate by, in radians.
   *
   * @return {this} This Matrix4.
   */
  rotateY(rad) {
    const a = this.val
    const s = Math.sin(rad)
    const c = Math.cos(rad)

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a03 = a[3]

    const a20 = a[8]
    const a21 = a[9]
    const a22 = a[10]
    const a23 = a[11]

    //  Perform axis-specific matrix multiplication
    a[0] = a00 * c - a20 * s
    a[1] = a01 * c - a21 * s
    a[2] = a02 * c - a22 * s
    a[3] = a03 * c - a23 * s
    a[8] = a00 * s + a20 * c
    a[9] = a01 * s + a21 * c
    a[10] = a02 * s + a22 * c
    a[11] = a03 * s + a23 * c

    return this
  }

  /**
   * Rotate this matrix on its Z axis.
   *
   * @method Phaser.Math.Matrix4#rotateZ
   * @since 3.0.0
   *
   * @param {number} rad - The angle to rotate by, in radians.
   *
   * @return {this} This Matrix4.
   */
  rotateZ(rad) {
    const a = this.val
    const s = Math.sin(rad)
    const c = Math.cos(rad)

    const a00 = a[0]
    const a01 = a[1]
    const a02 = a[2]
    const a03 = a[3]

    const a10 = a[4]
    const a11 = a[5]
    const a12 = a[6]
    const a13 = a[7]

    //  Perform axis-specific matrix multiplication
    a[0] = a00 * c + a10 * s
    a[1] = a01 * c + a11 * s
    a[2] = a02 * c + a12 * s
    a[3] = a03 * c + a13 * s
    a[4] = a10 * c - a00 * s
    a[5] = a11 * c - a01 * s
    a[6] = a12 * c - a02 * s
    a[7] = a13 * c - a03 * s

    return this
  }

  /**
   * Set the values of this Matrix from the given rotation Quaternion and translation Vector.
   *
   * @method Phaser.Math.Matrix4#fromRotationTranslation
   * @since 3.0.0
   *
   * @param {Phaser.Math.Quaternion} q - The Quaternion to set rotation from.
   * @param {Phaser.Math.Vector3} v - The Vector to set translation from.
   *
   * @return {this} This Matrix4.
   */
  fromRotationTranslation(q, v) {
    //  Quaternion math
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

    return this.setValues(
      1 - (yy + zz),
      xy + wz,
      xz - wy,
      0,

      xy - wz,
      1 - (xx + zz),
      yz + wx,
      0,

      xz + wy,
      yz - wx,
      1 - (xx + yy),
      0,

      v.x,
      v.y,
      v.z,
      1
    )
  }

  /**
   * Set the values of this Matrix from the given Quaternion.
   *
   * @method Phaser.Math.Matrix4#fromQuat
   * @since 3.0.0
   *
   * @param {Phaser.Math.Quaternion} q - The Quaternion to set the values of this Matrix from.
   *
   * @return {this} This Matrix4.
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

    return this.setValues(
      1 - (yy + zz),
      xy + wz,
      xz - wy,
      0,

      xy - wz,
      1 - (xx + zz),
      yz + wx,
      0,

      xz + wy,
      yz - wx,
      1 - (xx + yy),
      0,

      0,
      0,
      0,
      1
    )
  }

  /**
   * Generate a frustum matrix with the given bounds.
   *
   * @method Phaser.Math.Matrix4#frustum
   * @since 3.0.0
   *
   * @param {number} left - The left bound of the frustum.
   * @param {number} right - The right bound of the frustum.
   * @param {number} bottom - The bottom bound of the frustum.
   * @param {number} top - The top bound of the frustum.
   * @param {number} near - The near bound of the frustum.
   * @param {number} far - The far bound of the frustum.
   *
   * @return {this} This Matrix4.
   */
  frustum(left, right, bottom, top, near, far) {
    const rl = 1 / (right - left)
    const tb = 1 / (top - bottom)
    const nf = 1 / (near - far)

    return this.setValues(
      near * 2 * rl,
      0,
      0,
      0,

      0,
      near * 2 * tb,
      0,
      0,

      (right + left) * rl,
      (top + bottom) * tb,
      (far + near) * nf,
      -1,

      0,
      0,
      far * near * 2 * nf,
      0
    )
  }

  /**
   * Generate a perspective projection matrix with the given bounds.
   *
   * @method Phaser.Math.Matrix4#perspective
   * @since 3.0.0
   *
   * @param {number} fovy - Vertical field of view in radians
   * @param {number} aspect - Aspect ratio. Typically viewport width  /height.
   * @param {number} near - Near bound of the frustum.
   * @param {number} far - Far bound of the frustum.
   *
   * @return {this} This Matrix4.
   */
  perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2)
    const nf = 1 / (near - far)

    return this.setValues(
      f / aspect,
      0,
      0,
      0,

      0,
      f,
      0,
      0,

      0,
      0,
      (far + near) * nf,
      -1,

      0,
      0,
      2 * far * near * nf,
      0
    )
  }

  /**
   * Generate a perspective projection matrix with the given bounds.
   *
   * @method Phaser.Math.Matrix4#perspectiveLH
   * @since 3.0.0
   *
   * @param {number} width - The width of the frustum.
   * @param {number} height - The height of the frustum.
   * @param {number} near - Near bound of the frustum.
   * @param {number} far - Far bound of the frustum.
   *
   * @return {this} This Matrix4.
   */
  perspectiveLH(width, height, near, far) {
    return this.setValues(
      (2 * near) / width,
      0,
      0,
      0,

      0,
      (2 * near) / height,
      0,
      0,

      0,
      0,
      -far / (near - far),
      1,

      0,
      0,
      (near * far) / (near - far),
      0
    )
  }

  /**
   * Generate an orthogonal projection matrix with the given bounds.
   *
   * @method Phaser.Math.Matrix4#ortho
   * @since 3.0.0
   *
   * @param {number} left - The left bound of the frustum.
   * @param {number} right - The right bound of the frustum.
   * @param {number} bottom - The bottom bound of the frustum.
   * @param {number} top - The top bound of the frustum.
   * @param {number} near - The near bound of the frustum.
   * @param {number} far - The far bound of the frustum.
   *
   * @return {this} This Matrix4.
   */
  ortho(left, right, bottom, top, near, far) {
    let lr = left - right
    let bt = bottom - top
    let nf = near - far

    //  Avoid division by zero
    lr = lr === 0 ? lr : 1 / lr
    bt = bt === 0 ? bt : 1 / bt
    nf = nf === 0 ? nf : 1 / nf

    return this.setValues(
      -2 * lr,
      0,
      0,
      0,

      0,
      -2 * bt,
      0,
      0,

      0,
      0,
      2 * nf,
      0,

      (left + right) * lr,
      (top + bottom) * bt,
      (far + near) * nf,
      1
    )
  }

  /**
   * Generate a right-handed look-at matrix with the given eye position, target and up axis.
   *
   * @method Phaser.Math.Matrix4#lookAtRH
   * @since 3.50.0
   *
   * @param {Phaser.Math.Vector3} eye - Position of the viewer.
   * @param {Phaser.Math.Vector3} target - Point the viewer is looking at.
   * @param {Phaser.Math.Vector3} up - vec3 pointing up.
   *
   * @return {this} This Matrix4.
   */
  lookAtRH(eye, target, up) {
    const m = this.val

    _z.subVectors(eye, target)

    if (_z.getLengthSquared() === 0) {
      // eye and target are in the same position
      _z.z = 1
    }

    _z.normalize()
    _x.crossVectors(up, _z)

    if (_x.getLengthSquared() === 0) {
      // up and z are parallel

      if (Math.abs(up.z) === 1) {
        _z.x += 0.0001
      } else {
        _z.z += 0.0001
      }

      _z.normalize()
      _x.crossVectors(up, _z)
    }

    _x.normalize()
    _y.crossVectors(_z, _x)

    m[0] = _x.x
    m[1] = _x.y
    m[2] = _x.z
    m[4] = _y.x
    m[5] = _y.y
    m[6] = _y.z
    m[8] = _z.x
    m[9] = _z.y
    m[10] = _z.z

    return this
  }

  /**
   * Generate a look-at matrix with the given eye position, focal point, and up axis.
   *
   * @method Phaser.Math.Matrix4#lookAt
   * @since 3.0.0
   *
   * @param {Phaser.Math.Vector3} eye - Position of the viewer
   * @param {Phaser.Math.Vector3} center - Point the viewer is looking at
   * @param {Phaser.Math.Vector3} up - vec3 pointing up.
   *
   * @return {this} This Matrix4.
   */
  lookAt(eye, center, up) {
    const eyex = eye.x
    const eyey = eye.y
    const eyez = eye.z

    const upx = up.x
    const upy = up.y
    const upz = up.z

    const centerx = center.x
    const centery = center.y
    const centerz = center.z

    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      return this.identity()
    }

    let z0 = eyex - centerx
    let z1 = eyey - centery
    let z2 = eyez - centerz

    let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2)

    z0 *= len
    z1 *= len
    z2 *= len

    let x0 = upy * z2 - upz * z1
    let x1 = upz * z0 - upx * z2
    let x2 = upx * z1 - upy * z0

    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2)

    if (!len) {
      x0 = 0
      x1 = 0
      x2 = 0
    } else {
      len = 1 / len
      x0 *= len
      x1 *= len
      x2 *= len
    }

    let y0 = z1 * x2 - z2 * x1
    let y1 = z2 * x0 - z0 * x2
    let y2 = z0 * x1 - z1 * x0

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2)

    if (!len) {
      y0 = 0
      y1 = 0
      y2 = 0
    } else {
      len = 1 / len
      y0 *= len
      y1 *= len
      y2 *= len
    }

    return this.setValues(
      x0,
      y0,
      z0,
      0,

      x1,
      y1,
      z1,
      0,

      x2,
      y2,
      z2,
      0,

      -(x0 * eyex + x1 * eyey + x2 * eyez),
      -(y0 * eyex + y1 * eyey + y2 * eyez),
      -(z0 * eyex + z1 * eyey + z2 * eyez),
      1
    )
  }

  /**
   * Set the values of this matrix from the given `yaw`, `pitch` and `roll` values.
   *
   * @method Phaser.Math.Matrix4#yawPitchRoll
   * @since 3.0.0
   *
   * @param {number} yaw - The yaw value.
   * @param {number} pitch - The pitch value.
   * @param {number} roll - The roll value.
   *
   * @return {this} This Matrix4.
   */
  yawPitchRoll(yaw, pitch, roll) {
    this.zero()
    _tempMat1.zero()
    _tempMat2.zero()

    const m0 = this.val
    const m1 = _tempMat1.val
    const m2 = _tempMat2.val

    //  Rotate Z
    let s = Math.sin(roll)
    let c = Math.cos(roll)

    m0[10] = 1
    m0[15] = 1
    m0[0] = c
    m0[1] = s
    m0[4] = -s
    m0[5] = c

    //  Rotate X
    s = Math.sin(pitch)
    c = Math.cos(pitch)

    m1[0] = 1
    m1[15] = 1
    m1[5] = c
    m1[10] = c
    m1[9] = -s
    m1[6] = s

    //  Rotate Y
    s = Math.sin(yaw)
    c = Math.cos(yaw)

    m2[5] = 1
    m2[15] = 1
    m2[0] = c
    m2[2] = -s
    m2[8] = s
    m2[10] = c

    this.multiplyLocal(_tempMat1)
    this.multiplyLocal(_tempMat2)

    return this
  }

  /**
   * Generate a world matrix from the given rotation, position, scale, view matrix and projection matrix.
   *
   * @method Phaser.Math.Matrix4#setWorldMatrix
   * @since 3.0.0
   *
   * @param {Phaser.Math.Vector3} rotation - The rotation of the world matrix.
   * @param {Phaser.Math.Vector3} position - The position of the world matrix.
   * @param {Phaser.Math.Vector3} scale - The scale of the world matrix.
   * @param {Phaser.Math.Matrix4} [viewMatrix] - The view matrix.
   * @param {Phaser.Math.Matrix4} [projectionMatrix] - The projection matrix.
   *
   * @return {this} This Matrix4.
   */
  setWorldMatrix(rotation, position, scale, viewMatrix, projectionMatrix) {
    this.yawPitchRoll(rotation.y, rotation.x, rotation.z)

    _tempMat1.scaling(scale.x, scale.y, scale.z)
    _tempMat2.xyz(position.x, position.y, position.z)

    this.multiplyLocal(_tempMat1)
    this.multiplyLocal(_tempMat2)

    if (viewMatrix) {
      this.multiplyLocal(viewMatrix)
    }

    if (projectionMatrix) {
      this.multiplyLocal(projectionMatrix)
    }

    return this
  }

  /**
   * Multiplies this Matrix4 by the given `src` Matrix4 and stores the results in the `out` Matrix4.
   *
   * @method Phaser.Math.Matrix4#multiplyToMat4
   * @since 3.50.0
   *
   * @param {Phaser.Math.Matrix4} src - The Matrix4 to multiply with this one.
   * @param {Phaser.Math.Matrix4} out - The receiving Matrix.
   *
   * @return {Phaser.Math.Matrix4} This `out` Matrix4.
   */
  multiplyToMat4(src, out) {
    const a = this.val
    const b = src.val

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

    const b00 = b[0]
    const b01 = b[1]
    const b02 = b[2]
    const b03 = b[3]
    const b10 = b[4]
    const b11 = b[5]
    const b12 = b[6]
    const b13 = b[7]
    const b20 = b[8]
    const b21 = b[9]
    const b22 = b[10]
    const b23 = b[11]
    const b30 = b[12]
    const b31 = b[13]
    const b32 = b[14]
    const b33 = b[15]

    return out.setValues(
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b01 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b02 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b03 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33
    )
  }

  /**
   * Takes the rotation and position vectors and builds this Matrix4 from them.
   *
   * @method Phaser.Math.Matrix4#fromRotationXYTranslation
   * @since 3.50.0
   *
   * @param {Phaser.Math.Vector3} rotation - The rotation vector.
   * @param {Phaser.Math.Vector3} position - The position vector.
   * @param {boolean} translateFirst - Should the operation translate then rotate (`true`), or rotate then translate? (`false`)
   *
   * @return {this} This Matrix4.
   */
  fromRotationXYTranslation(rotation, position, translateFirst) {
    const x = position.x
    const y = position.y
    const z = position.z

    const sx = Math.sin(rotation.x)
    const cx = Math.cos(rotation.x)

    const sy = Math.sin(rotation.y)
    const cy = Math.cos(rotation.y)

    let a30 = x
    let a31 = y
    let a32 = z

    //  Rotate X

    const b21 = -sx

    //  Rotate Y

    const c01 = 0 - b21 * sy

    const c02 = 0 - cx * sy

    const c21 = b21 * cy

    const c22 = cx * cy

    //  Translate
    if (!translateFirst) {
      // a30 = cy * x + 0 * y + sy * z;
      a30 = cy * x + sy * z
      a31 = c01 * x + cx * y + c21 * z
      a32 = c02 * x + sx * y + c22 * z
    }

    return this.setValues(cy, c01, c02, 0, 0, cx, sx, 0, sy, c21, c22, 0, a30, a31, a32, 1)
  }

  /**
   * Returns the maximum axis scale from this Matrix4.
   *
   * @method Phaser.Math.Matrix4#getMaxScaleOnAxis
   * @since 3.50.0
   *
   * @return {number} The maximum axis scale.
   */
  getMaxScaleOnAxis() {
    const m = this.val

    const scaleXSq = m[0] * m[0] + m[1] * m[1] + m[2] * m[2]
    const scaleYSq = m[4] * m[4] + m[5] * m[5] + m[6] * m[6]
    const scaleZSq = m[8] * m[8] + m[9] * m[9] + m[10] * m[10]

    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq))
  }
}

/**
 * @ignore
 */
var _tempMat1 = new Matrix4()

/**
 * @ignore
 */
var _tempMat2 = new Matrix4()

/**
 * @ignore
 */
var _x = new Vector3()

/**
 * @ignore
 */
var _y = new Vector3()

/**
 * @ignore
 */
var _z = new Vector3()

export default Matrix4
