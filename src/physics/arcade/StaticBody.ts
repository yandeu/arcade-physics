/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import CircleContains from '../../geom/circle/Contains'
import RectangleContains from '../../geom/rectangle/Contains'
import CONST from './const'
import { Vector2 } from '../../math/Vector2'
import { World } from './World'
import type { Body } from './Body'
import { ArcadeBodyBounds, CollisionCallback } from './typedefs/types'

export class StaticBody {
  debugShowBody: boolean
  debugBodyColor: number
  /** Whether this Static Body is updated by the physics simulation. */
  enable = true
  /** Whether this Static Body's boundary is circular (`true`) or rectangular (`false`). */
  isCircle = false
  /**
   * If this Static Body is circular, this is the radius of the boundary, as set by {@link setCircle} in pixels.
   * Equal to `halfWidth`.
   */
  radius = 0
  /**
   * The offset set by {@link setCircle} or {@link setSize}.
   *
   * This doesn't affect the Static Body's position, because a Static Body does not follow its Game Object.
   */
  readonly offset = new Vector2()

  position: Vector2
  width: number
  height: number
  halfWidth: number
  halfHeight: number
  center: Vector2
  velocity: Vector2
  allowGravity: boolean
  gravity: Vector2
  bounce: Vector2
  onWorldBounds: boolean
  onCollide: boolean
  onOverlap: boolean
  mass: number
  immovable: boolean
  pushable: boolean
  customSeparateX: boolean
  customSeparateY: boolean
  overlapX: number
  overlapY: number
  overlapR: number
  embedded: boolean
  collideWorldBounds: boolean
  checkCollision: CollisionCallback
  touching: {
    none: boolean
    up: boolean
    down: boolean
    left: boolean
    right: boolean
  }
  wasTouching: {
    none: boolean
    up: boolean
    down: boolean
    left: boolean
    right: boolean
  }
  blocked: {
    none: boolean
    up: boolean
    down: boolean
    left: boolean
    right: boolean
  }
  physicsType: number
  private _dx: number = 0
  private _dy: number = 0

  isBody = true

  /**
   * A Static Arcade Physics Body.
   *
   * A Static Body never moves, and isn't automatically synchronized with its parent Game Object.
   * That means if you make any change to the parent's origin, position, or scale after creating or adding the body, you'll need to update the Static Body manually.
   *
   * A Static Body can collide with other Bodies, but is never moved by collisions.
   *
   * Its dynamic counterpart is {@link Body}.
   *
   * @param world The Arcade Physics simulation this Static Body belongs to.
   * @param x
   * @param y
   * @param width
   * @param height
   */
  constructor(public world: World, x: number, y: number, width = 64, height = 64) {
    /** Whether the Static Body's boundary is drawn to the debug display. */
    this.debugShowBody = world.defaults.debugShowStaticBody

    /** The color of this Static Body on the debug display. */
    this.debugBodyColor = world.defaults.staticBodyDebugColor

    /**
     * The position of this Static Body within the simulation.
     * @type {Phaser.Math.Vector2}
     */
    this.position = new Vector2(x, y)

    /**
     * The width of the Static Body's boundary, in pixels.
     * If the Static Body is circular, this is also the Static Body's diameter.
     *
     * @type {number}
     */
    this.width = width

    /**
     * The height of the Static Body's boundary, in pixels.
     * If the Static Body is circular, this is also the Static Body's diameter.
     *
     * @type {number}
     */
    this.height = height

    /**
     * Half the Static Body's width, in pixels.
     * If the Static Body is circular, this is also the Static Body's radius.
     *
     * @type {number}
     */
    this.halfWidth = Math.abs(this.width / 2)

    /**
     * Half the Static Body's height, in pixels.
     * If the Static Body is circular, this is also the Static Body's radius.
     *
     * @type {number}
     */
    this.halfHeight = Math.abs(this.height / 2)

    /**
     * The center of the Static Body's boundary.
     * This is the midpoint of its `position` (top-left corner) and its bottom-right corner.
     *
     * @type {Phaser.Math.Vector2}
     */
    this.center = new Vector2(this.position.x + this.halfWidth, this.position.y + this.halfHeight)

    /**
     * A constant zero velocity used by the Arcade Physics simulation for calculations.
     *
     * @name Phaser.Physics.Arcade.StaticBody#velocity
     * @type {Phaser.Math.Vector2}
     * @readonly
     * @since 3.0.0
     */
    this.velocity = Vector2.ZERO

    /**
     * A constant `false` value expected by the Arcade Physics simulation.
     *
     * @name Phaser.Physics.Arcade.StaticBody#allowGravity
     * @type {boolean}
     * @readonly
     * @default false
     * @since 3.0.0
     */
    this.allowGravity = false

    /**
     * Gravitational force applied specifically to this Body. Values are in pixels per second squared. Always zero for a Static Body.
     *
     * @name Phaser.Physics.Arcade.StaticBody#gravity
     * @type {Phaser.Math.Vector2}
     * @readonly
     * @since 3.0.0
     */
    this.gravity = Vector2.ZERO

    /**
     * Rebound, or restitution, following a collision, relative to 1. Always zero for a Static Body.
     *
     * @name Phaser.Physics.Arcade.StaticBody#bounce
     * @type {Phaser.Math.Vector2}
     * @readonly
     * @since 3.0.0
     */
    this.bounce = Vector2.ZERO

    //  If true this Body will dispatch events

    /**
     * Whether the simulation emits a `worldbounds` event when this StaticBody collides with the world boundary.
     * Always false for a Static Body. (Static Bodies never collide with the world boundary and never trigger a `worldbounds` event.)
     *
     * @name Phaser.Physics.Arcade.StaticBody#onWorldBounds
     * @type {boolean}
     * @readonly
     * @default false
     * @since 3.0.0
     */
    this.onWorldBounds = false

    /**
     * Whether the simulation emits a `collide` event when this StaticBody collides with another.
     *
     * @name Phaser.Physics.Arcade.StaticBody#onCollide
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    this.onCollide = false

    /**
     * Whether the simulation emits an `overlap` event when this StaticBody overlaps with another.
     *
     * @name Phaser.Physics.Arcade.StaticBody#onOverlap
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    this.onOverlap = false

    /**
     * The StaticBody's inertia, relative to a default unit (1). With `bounce`, this affects the exchange of momentum (velocities) during collisions.
     *
     * @name Phaser.Physics.Arcade.StaticBody#mass
     * @type {number}
     * @default 1
     * @since 3.0.0
     */
    this.mass = 1

    /**
     * Whether this object can be moved by collisions with another body.
     *
     * @name Phaser.Physics.Arcade.StaticBody#immovable
     * @type {boolean}
     * @default true
     * @since 3.0.0
     */
    this.immovable = true

    /**
     * Sets if this Body can be pushed by another Body.
     *
     * A body that cannot be pushed will reflect back all of the velocity it is given to the
     * colliding body. If that body is also not pushable, then the separation will be split
     * between them evenly.
     *
     * If you want your body to never move or seperate at all, see the `setImmovable` method.
     *
     * By default, Static Bodies are not pushable.
     *
     * @name Phaser.Physics.Arcade.StaticBody#pushable
     * @type {boolean}
     * @default false
     * @since 3.50.0
     * @see Phaser.GameObjects.Components.Pushable#setPushable
     */
    this.pushable = false

    /**
     * A flag disabling the default horizontal separation of colliding bodies. Pass your own `collideHandler` to the collider.
     *
     * @name Phaser.Physics.Arcade.StaticBody#customSeparateX
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    this.customSeparateX = false

    /**
     * A flag disabling the default vertical separation of colliding bodies. Pass your own `collideHandler` to the collider.
     *
     * @name Phaser.Physics.Arcade.StaticBody#customSeparateY
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    this.customSeparateY = false

    /**
     * The amount of horizontal overlap (before separation), if this Body is colliding with another.
     *
     * @name Phaser.Physics.Arcade.StaticBody#overlapX
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    this.overlapX = 0

    /**
     * The amount of vertical overlap (before separation), if this Body is colliding with another.
     *
     * @name Phaser.Physics.Arcade.StaticBody#overlapY
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    this.overlapY = 0

    /**
     * The amount of overlap (before separation), if this StaticBody is circular and colliding with another circular body.
     *
     * @name Phaser.Physics.Arcade.StaticBody#overlapR
     * @type {number}
     * @default 0
     * @since 3.0.0
     */
    this.overlapR = 0

    /**
     * Whether this StaticBody has ever overlapped with another while both were not moving.
     *
     * @name Phaser.Physics.Arcade.StaticBody#embedded
     * @type {boolean}
     * @default false
     * @since 3.0.0
     */
    this.embedded = false

    /**
     * Whether this StaticBody interacts with the world boundary.
     * Always false for a Static Body. (Static Bodies never collide with the world boundary.)
     *
     * @name Phaser.Physics.Arcade.StaticBody#collideWorldBounds
     * @type {boolean}
     * @readonly
     * @default false
     * @since 3.0.0
     */
    this.collideWorldBounds = false

    /** Whether this StaticBody is checked for collisions and for which directions. You can set `checkCollision.none = false` to disable collision checks. */
    this.checkCollision = {
      none: false,
      up: true,
      down: true,
      left: true,
      right: true
    }

    /**
     * This property is kept for compatibility with Dynamic Bodies.
     * Avoid using it.
     *
     * @name Phaser.Physics.Arcade.StaticBody#touching
     * @type {Phaser.Types.Physics.Arcade.CollisionCallback}
     * @since 3.0.0
     */
    this.touching = {
      none: true,
      up: false,
      down: false,
      left: false,
      right: false
    }

    /**
     * This property is kept for compatibility with Dynamic Bodies.
     * Avoid using it.
     * The values are always false for a Static Body.
     *
     * @name Phaser.Physics.Arcade.StaticBody#wasTouching
     * @type {Phaser.Types.Physics.Arcade.CollisionCallback}
     * @since 3.0.0
     */
    this.wasTouching = {
      none: true,
      up: false,
      down: false,
      left: false,
      right: false
    }

    /**
     * This property is kept for compatibility with Dynamic Bodies.
     * Avoid using it.
     *
     * @name Phaser.Physics.Arcade.StaticBody#blocked
     * @type {Phaser.Types.Physics.Arcade.CollisionCallback}
     * @since 3.0.0
     */
    this.blocked = {
      none: true,
      up: false,
      down: false,
      left: false,
      right: false
    }

    /**
     * The StaticBody's physics type (static by default).
     *
     * @name Phaser.Physics.Arcade.StaticBody#physicsType
     * @type {number}
     * @default Phaser.Physics.Arcade.STATIC_BODY
     * @since 3.0.0
     */
    this.physicsType = CONST.PHYSICS_TYPE.STATIC_BODY

    /**
     * The calculated change in the Static Body's horizontal position during the current step.
     * For a static body this is always zero.
     *
     * @name Phaser.Physics.Arcade.StaticBody#_dx
     * @type {number}
     * @private
     * @default 0
     * @since 3.10.0
     */
    this._dx = 0

    /**
     * The calculated change in the Static Body's vertical position during the current step.
     * For a static body this is always zero.
     *
     * @name Phaser.Physics.Arcade.StaticBody#_dy
     * @type {number}
     * @private
     * @default 0
     * @since 3.10.0
     */
    this._dy = 0
  }

  // used for the btree
  get minX() {
    return this.x
  }
  get minY() {
    return this.y
  }
  get maxX() {
    return this.x + this.width
  }
  get maxY() {
    return this.y + this.height
  }

  // /**
  //  * Changes the Game Object this Body is bound to.
  //  * First it removes its reference from the old Game Object, then sets the new one.
  //  * You can optionally update the position and dimensions of this Body to reflect that of the new Game Object.
  //  *
  //  * @method Phaser.Physics.Arcade.StaticBody#setGameObject
  //  * @since 3.1.0
  //  *
  //  * @param {Phaser.GameObjects.GameObject} gameObject - The new Game Object that will own this Body.
  //  * @param {boolean} [update=true] - Reposition and resize this Body to match the new Game Object?
  //  *
  //  * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
  //  *
  //  * @see Phaser.Physics.Arcade.StaticBody#updateFromGameObject
  //  */
  // setGameObject(gameObject, update) {
  //   if (gameObject && gameObject !== this.gameObject) {
  //     //  Remove this body from the old game object
  //     // @ts-ignore
  //     this.gameObject.body = null

  //     gameObject.body = this

  //     //  Update our reference
  //     this.gameObject = gameObject
  //   }

  //   if (update) {
  //     this.updateFromGameObject()
  //   }

  //   return this
  // }

  preUpdate() {
    // nothing to pre-update on a static body.
  }
  update() {
    // nothing to update on a static body.
  }

  /**
   * Sets the size of the Static Body.
   * Resets the width and height to match current frame, if no width and height provided and a frame is found.
   *
   * @method Phaser.Physics.Arcade.StaticBody#setSize
   * @since 3.0.0
   *
   * @param {number} [width] - The width of the Static Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame width.
   * @param {number} [height] - The height of the Static Body in pixels. Cannot be zero. If not given, and the parent Game Object has a frame, it will use the frame height.
   *
   * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
   */
  setSize(width, height) {
    this.world.staticTree.remove(this)

    this.width = width
    this.height = height

    this.halfWidth = Math.floor(width / 2)
    this.halfHeight = Math.floor(height / 2)

    this.updateCenter()

    this.isCircle = false
    this.radius = 0

    this.world.staticTree.insert(this)

    return this
  }

  /**
   * Sets this Static Body to have a circular body and sets its size and position.
   *
   * @method Phaser.Physics.Arcade.StaticBody#setCircle
   * @since 3.0.0
   *
   * @param {number} radius - The radius of the StaticBody, in pixels.
   * @param {number} [offsetX] - The horizontal offset of the StaticBody from its Game Object, in pixels.
   * @param {number} [offsetY] - The vertical offset of the StaticBody from its Game Object, in pixels.
   *
   * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
   */
  setCircle(radius, offsetX, offsetY) {
    if (offsetX === undefined) {
      offsetX = this.offset.x
    }
    if (offsetY === undefined) {
      offsetY = this.offset.y
    }

    if (radius > 0) {
      this.world.staticTree.remove(this)

      this.isCircle = true

      this.radius = radius

      this.width = radius * 2
      this.height = radius * 2

      this.halfWidth = Math.floor(this.width / 2)
      this.halfHeight = Math.floor(this.height / 2)

      this.offset.set(offsetX, offsetY)

      this.updateCenter()

      this.world.staticTree.insert(this)
    } else {
      this.isCircle = false
    }

    return this
  }

  /**
   * Updates the StaticBody's `center` from its `position` and dimensions.
   *
   * @method Phaser.Physics.Arcade.StaticBody#updateCenter
   * @since 3.0.0
   */
  updateCenter() {
    this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight)
  }

  /**
   * Resets this Body to the given coordinates. Also positions its parent Game Object to the same coordinates.
   *
   * @method Phaser.Physics.Arcade.StaticBody#reset
   * @since 3.0.0
   *
   * @param {number} [x] - The x coordinate to reset the body to.
   * @param {number} [y] - The y coordinate to reset the body to.
   */
  reset(x: number, y: number) {
    this.world.staticTree.remove(this)

    this.position.set(x, y)

    this.updateCenter()

    this.world.staticTree.insert(this)
  }

  /**
   * NOOP function. A Static Body cannot be stopped.
   *
   * @method Phaser.Physics.Arcade.StaticBody#stop
   * @since 3.0.0
   *
   * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
   */
  stop() {
    return this
  }

  /**
   * Returns the x and y coordinates of the top left and bottom right points of the StaticBody.
   *
   * @param {ArcadeBodyBounds} obj - The object which will hold the coordinates of the bounds.
   * @return {ArcadeBodyBounds} The same object that was passed with `x`, `y`, `right` and `bottom` values matching the respective values of the StaticBody.
   */
  getBounds(obj: ArcadeBodyBounds): ArcadeBodyBounds {
    obj.x = this.x
    obj.y = this.y
    obj.right = this.right
    obj.bottom = this.bottom

    return obj
  }

  /**
   * Checks to see if a given x,y coordinate is colliding with this Static Body.
   *
   * @method Phaser.Physics.Arcade.StaticBody#hitTest
   * @since 3.0.0
   *
   * @param {number} x - The x coordinate to check against this body.
   * @param {number} y - The y coordinate to check against this body.
   *
   * @return {boolean} `true` if the given coordinate lies within this body, otherwise `false`.
   */
  hitTest(x, y) {
    return this.isCircle ? CircleContains(this, x, y) : RectangleContains(this, x, y)
  }

  /**
   * NOOP
   *
   * @method Phaser.Physics.Arcade.StaticBody#postUpdate
   * @since 3.12.0
   */
  postUpdate() {}

  /**
   * The absolute (non-negative) change in this StaticBody's horizontal position from the previous step. Always zero.
   *
   * @method Phaser.Physics.Arcade.StaticBody#deltaAbsX
   * @since 3.0.0
   *
   * @return {number} Always zero for a Static Body.
   */
  deltaAbsX() {
    return 0
  }

  /**
   * The absolute (non-negative) change in this StaticBody's vertical position from the previous step. Always zero.
   *
   * @method Phaser.Physics.Arcade.StaticBody#deltaAbsY
   * @since 3.0.0
   *
   * @return {number} Always zero for a Static Body.
   */
  deltaAbsY() {
    return 0
  }

  /**
   * The change in this StaticBody's horizontal position from the previous step. Always zero.
   *
   * @method Phaser.Physics.Arcade.StaticBody#deltaX
   * @since 3.0.0
   *
   * @return {number} The change in this StaticBody's velocity from the previous step. Always zero.
   */
  deltaX() {
    return 0
  }

  /**
   * The change in this StaticBody's vertical position from the previous step. Always zero.
   *
   * @method Phaser.Physics.Arcade.StaticBody#deltaY
   * @since 3.0.0
   *
   * @return {number} The change in this StaticBody's velocity from the previous step. Always zero.
   */
  deltaY() {
    return 0
  }

  /**
   * The change in this StaticBody's rotation from the previous step. Always zero.
   *
   * @method Phaser.Physics.Arcade.StaticBody#deltaZ
   * @since 3.0.0
   *
   * @return {number} The change in this StaticBody's rotation from the previous step. Always zero.
   */
  deltaZ() {
    return 0
  }

  /**
   * Disables this Body and marks it for destruction during the next step.
   *
   * @method Phaser.Physics.Arcade.StaticBody#destroy
   * @since 3.0.0
   */
  destroy() {
    this.enable = false
    this.world.pendingDestroy.add(this)
  }

  /**
   * Draws a graphical representation of the StaticBody for visual debugging purposes.
   *
   * @method Phaser.Physics.Arcade.StaticBody#drawDebug
   * @since 3.0.0
   *
   * @param {CanvasRenderingContext2D} Context2D - The Context2D to use for the debug drawing of the StaticBody.
   */
  drawDebug(ctx: CanvasRenderingContext2D) {
    const pos = this.position

    const x = pos.x + this.halfWidth
    const y = pos.y + this.halfHeight

    const defaultStrokeWidth = 1

    const colorToHex = num => {
      num >>>= 0
      let b = (num & 0xff).toString(16)
      let g = ((num & 0xff00) >>> 8).toString(16)
      let r = ((num & 0xff0000) >>> 16).toString(16)

      if (b === '0') b = '00'
      if (g === '0') g = '00'
      if (r === '0') r = '00'

      return `#${b}${g}${r}`
    }

    const strokeRect = (x, y, w, h) => {
      ctx.rect(x, y, w, h)
    }

    const lineStyle = (width, color, unknown?) => {
      ctx.lineWidth = width
      ctx.strokeStyle = colorToHex(color)
    }

    const strokeCircle = (x, y, radius) => {
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
    }

    if (this.debugShowBody) {
      ctx.beginPath()
      lineStyle(defaultStrokeWidth, this.debugBodyColor || 0x0000ff, 1)

      if (this.isCircle) {
        strokeCircle(x, y, this.width / 2)
      } else {
        strokeRect(pos.x, pos.y, this.width, this.height)
      }
      ctx.stroke()
    }
  }

  /**
   * Indicates whether the StaticBody is going to be showing a debug visualization during postUpdate.
   *
   * @method Phaser.Physics.Arcade.StaticBody#willDrawDebug
   * @since 3.0.0
   *
   * @return {boolean} Whether or not the StaticBody is going to show the debug visualization during postUpdate.
   */
  willDrawDebug() {
    return this.debugShowBody
  }

  /**
   * Sets the Mass of the StaticBody. Will set the Mass to 0.1 if the value passed is less than or equal to zero.
   *
   * @method Phaser.Physics.Arcade.StaticBody#setMass
   * @since 3.0.0
   *
   * @param {number} value - The value to set the Mass to. Values of zero or less are changed to 0.1.
   *
   * @return {Phaser.Physics.Arcade.StaticBody} This Static Body object.
   */
  setMass(value) {
    if (value <= 0) {
      //  Causes havoc otherwise
      value = 0.1
    }

    this.mass = value

    return this
  }

  /**
   * The x coordinate of the StaticBody.
   *
   * @name Phaser.Physics.Arcade.StaticBody#x
   * @type {number}
   * @since 3.0.0
   */
  get x() {
    return this.position.x
  }

  set x(value) {
    this.world.staticTree.remove(this)

    this.position.x = value

    this.world.staticTree.insert(this)
  }

  /**
   * The y coordinate of the StaticBody.
   *
   * @name Phaser.Physics.Arcade.StaticBody#y
   * @type {number}
   * @since 3.0.0
   */
  get y() {
    return this.position.y
  }

  set y(value) {
    this.world.staticTree.remove(this)

    this.position.y = value

    this.world.staticTree.insert(this)
  }

  /**
   * Returns the left-most x coordinate of the area of the StaticBody.
   *
   * @name Phaser.Physics.Arcade.StaticBody#left
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get left() {
    return this.position.x
  }

  /**
   * The right-most x coordinate of the area of the StaticBody.
   *
   * @name Phaser.Physics.Arcade.StaticBody#right
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get right() {
    return this.position.x + this.width
  }

  /**
   * The highest y coordinate of the area of the StaticBody.
   *
   * @name Phaser.Physics.Arcade.StaticBody#top
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get top() {
    return this.position.y
  }

  /**
   * The lowest y coordinate of the area of the StaticBody. (y + height)
   *
   * @name Phaser.Physics.Arcade.StaticBody#bottom
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get bottom() {
    return this.position.y + this.height
  }
}
