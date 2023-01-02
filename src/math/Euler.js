/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Clamp from './Clamp'
import Matrix4 from './Matrix4'
import NOOP from '../utils/NOOP'

const tempMatrix = new Matrix4()

/**
 * @classdesc
 *
 * @class Euler
 * @memberof Phaser.Math
 * @constructor
 * @since 3.50.0
 *
 * @param {number} [x] - The x component.
 * @param {number} [y] - The y component.
 * @param {number} [z] - The z component.
 */
class Euler {
  constructor(x, y, z, order) {
    if (x === undefined) {
      x = 0
    }
    if (y === undefined) {
      y = 0
    }
    if (z === undefined) {
      z = 0
    }
    if (order === undefined) {
      order = Euler.DefaultOrder
    }

    this._x = x
    this._y = y
    this._z = z
    this._order = order

    this.onChangeCallback = NOOP
  }

  get x() {
    return this._x
  }

  set x(value) {
    this._x = value
    this.onChangeCallback(this)
  }

  get y() {
    return this._y
  }

  set y(value) {
    this._y = value
    this.onChangeCallback(this)
  }

  get z() {
    return this._z
  }

  set z(value) {
    this._z = value
    this.onChangeCallback(this)
  }

  get order() {
    return this._order
  }

  set order(value) {
    this._order = value
    this.onChangeCallback(this)
  }

  set(x, y, z, order) {
    if (order === undefined) {
      order = this._order
    }

    this._x = x
    this._y = y
    this._z = z
    this._order = order

    this.onChangeCallback(this)

    return this
  }

  copy(euler) {
    return this.set(euler.x, euler.y, euler.z, euler.order)
  }

  setFromQuaternion(quaternion, order, update) {
    if (order === undefined) {
      order = this._order
    }
    if (update === undefined) {
      update = false
    }

    tempMatrix.fromQuat(quaternion)

    return this.setFromRotationMatrix(tempMatrix, order, update)
  }

  setFromRotationMatrix(matrix, order, update) {
    if (order === undefined) {
      order = this._order
    }
    if (update === undefined) {
      update = false
    }

    const elements = matrix.val

    //  Upper 3x3 of matrix is un-scaled rotation matrix
    const m11 = elements[0]
    const m12 = elements[4]
    const m13 = elements[8]
    const m21 = elements[1]
    const m22 = elements[5]
    const m23 = elements[9]
    const m31 = elements[2]
    const m32 = elements[6]
    const m33 = elements[10]

    let x = 0
    let y = 0
    let z = 0
    const epsilon = 0.99999

    switch (order) {
      case 'XYZ': {
        y = Math.asin(Clamp(m13, -1, 1))

        if (Math.abs(m13) < epsilon) {
          x = Math.atan2(-m23, m33)
          z = Math.atan2(-m12, m11)
        } else {
          x = Math.atan2(m32, m22)
        }

        break
      }

      case 'YXZ': {
        x = Math.asin(-Clamp(m23, -1, 1))

        if (Math.abs(m23) < epsilon) {
          y = Math.atan2(m13, m33)
          z = Math.atan2(m21, m22)
        } else {
          y = Math.atan2(-m31, m11)
        }

        break
      }

      case 'ZXY': {
        x = Math.asin(Clamp(m32, -1, 1))

        if (Math.abs(m32) < epsilon) {
          y = Math.atan2(-m31, m33)
          z = Math.atan2(-m12, m22)
        } else {
          z = Math.atan2(m21, m11)
        }

        break
      }

      case 'ZYX': {
        y = Math.asin(-Clamp(m31, -1, 1))

        if (Math.abs(m31) < epsilon) {
          x = Math.atan2(m32, m33)
          z = Math.atan2(m21, m11)
        } else {
          z = Math.atan2(-m12, m22)
        }

        break
      }

      case 'YZX': {
        z = Math.asin(Clamp(m21, -1, 1))

        if (Math.abs(m21) < epsilon) {
          x = Math.atan2(-m23, m22)
          y = Math.atan2(-m31, m11)
        } else {
          y = Math.atan2(m13, m33)
        }

        break
      }

      case 'XZY': {
        z = Math.asin(-Clamp(m12, -1, 1))

        if (Math.abs(m12) < epsilon) {
          x = Math.atan2(m32, m22)
          y = Math.atan2(m13, m11)
        } else {
          x = Math.atan2(-m23, m33)
        }

        break
      }
    }

    this._x = x
    this._y = y
    this._z = z
    this._order = order

    if (update) {
      this.onChangeCallback(this)
    }

    return this
  }
}

Euler.RotationOrders = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY']
Euler.DefaultOrder = 'XYZ'

export default Euler
