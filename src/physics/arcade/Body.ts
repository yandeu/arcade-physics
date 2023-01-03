/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import CONST, { FACING, PHYSICS_TYPE } from './const'
import Events from './events'
import { Rectangle } from '../../geom/rectangle/Rectangle'
import RectangleContains from '../../geom/rectangle/Contains'
import { Vector2 } from '../../math/Vector2'
import { World } from './World'

/** A Dynamic Arcade Body. */
export class Body {
  /** The Arcade Physics simulation this Body belongs to. */
  public world: World
  /** Whether the Body is drawn to the debug display. */
  public debugShowBody: boolean
  /** Whether the Body's velocity is drawn to the debug display. */
  public debugShowVelocity: boolean
  /** The color of this Body on the debug display. */
  public debugBodyColor: number
  /** Whether this Body is updated by the physics simulation. */
  public enable = true
  /** Whether this Body is circular (true) or rectangular (false). */
  public isCircle = false
  /**
   * If this Body is circular, this is the unscaled radius of the Body, as set by setCircle(), in source pixels.
   * The true radius is equal to `halfWidth`.
   */
  public radius = 0
  /** The position of this Body within the simulation. */
  public position: Vector2
  /** The position of this Body during the previous step. */
  public prev: Vector2
  /** The position of this Body during the previous frame. */
  public prevFrame: Vector2
  /** Whether this Body's `rotation` is affected by its angular acceleration and angular velocity. */
  public allowRotation = true
  /**
   * This body's rotation, in degrees, based on its angular acceleration and angular velocity.
   * The Body's rotation controls the `angle` of its Game Object.
   * It doesn't rotate the Body's own geometry, which is always an axis-aligned rectangle or a circle.
   */
  public rotation: number
  /** The Body rotation, in degrees, during the previous step. */
  public preRotation: number
  /**
   * The width of the Body, in pixels.
   * If the Body is circular, this is also the diameter.
   * If you wish to change the width use the `Body.setSize` method.
   */
  public width: number
  /**
   * The height of the Body, in pixels.
   * If the Body is circular, this is also the diameter.
   * If you wish to change the height use the `Body.setSize` method.
   */
  public height: number
  /**
   * The unscaled width of the Body, in source pixels, as set by setSize().
   * The default is the width of the Body's Game Object's texture frame.
   */
  public sourceWidth: number
  /**
   * The unscaled height of the Body, in source pixels, as set by setSize().
   * The default is the height of the Body's Game Object's texture frame.
   */
  public sourceHeight: number
  /** Half the Body's width, in pixels. */
  public halfWidth: number
  /** Half the Body's height, in pixels. */
  public halfHeight: number
  /**
   * The center of the Body.
   * The midpoint of its `position` (top-left corner) and its bottom-right corner.
   */
  public center: Vector2
  /** The Body's velocity, in pixels per second. */
  public velocity = new Vector2()
  /**
   * The Body's change in position (due to velocity) at the last step, in pixels.
   *
   * The size of this value depends on the simulation's step rate.
   */
  public newVelocity = new Vector2()
  /** The Body's absolute maximum change in position, in pixels per step. */
  public deltaMax = new Vector2()
  /** The Body's change in velocity, in pixels per second squared. */
  public acceleration = new Vector2()
  /** Whether this Body's velocity is affected by its `drag`. */
  public allowDrag = true
  /**
   * When `useDamping` is false (the default), this is absolute loss of velocity due to movement, in pixels per second squared.
   *
   * When `useDamping` is true, this is a damping multiplier between 0 and 1.
   * A value of 0 means the Body stops instantly.
   * A value of 0.01 mean the Body keeps 1% of its velocity per second, losing 99%.
   * A value of 0.1 means the Body keeps 10% of its velocity per second, losing 90%.
   * A value of 1 means the Body loses no velocity.
   * You can use very small values (e.g., 0.001) to stop the Body quickly.
   *
   * The x and y components are applied separately.
   *
   * Drag is applied only when `acceleration` is zero.
   */
  public drag = new Vector2()
  /** Whether this Body's position is affected by gravity (local or world). */
  public allowGravity = true
  /**
   * Acceleration due to gravity (specific to this Body), in pixels per second squared.
   * Total gravity is the sum of this vector and the simulation's `gravity`.
   */
  public gravity = new Vector2()
  /** Rebound following a collision, relative to 1. */
  public bounce = new Vector2()
  /**
   * Rebound following a collision with the world boundary, relative to 1.
   * If null, `bounce` is used instead.
   */
  public worldBounce: Vector2 | null = null
  /**
   * The rectangle used for world boundary collisions.
   *
   * By default it is set to the world boundary rectangle. Or, if this Body was
   * created by a Physics Group, then whatever rectangle that Group defined.
   *
   * You can also change it by using the `Body.setBoundsRectangle` method.
   */
  public customBoundsRectangle: Rectangle
  /** Whether the simulation emits a `worldbounds` event when this Body collides with the world boundary (and `collideWorldBounds` is also true). */
  public onWorldBounds = false
  /** Whether the simulation emits a `collide` event when this Body collides with another. */
  public onCollide = false
  /** Whether the simulation emits an `overlap` event when this Body overlaps with another. */
  public onOverlap = false
  /**
   * The Body's absolute maximum velocity, in pixels per second.
   * The horizontal and vertical components are applied separately.
   */
  public maxVelocity = new Vector2(10000, 10000)
  /**
   * The maximum speed this Body is allowed to reach, in pixels per second.
   *
   * If not negative it limits the scalar value of speed.
   *
   * Any negative value means no maximum is being applied (the default).
   */
  public maxSpeed = -1
  /**
   * If this Body is `immovable` and in motion, `friction` is the proportion of this Body's motion received by the riding Body on each axis, relative to 1.
   * The horizontal component (x) is applied only when two colliding Bodies are separated vertically.
   * The vertical component (y) is applied only when two colliding Bodies are separated horizontally.
   * The default value (1, 0) moves the riding Body horizontally in equal proportion to this Body and vertically not at all.
   */
  public friction = new Vector2(1, 0)
  /**
   * If this Body is using `drag` for deceleration this property controls how the drag is applied.
   * If set to `true` drag will use a damping effect rather than a linear approach. If you are
   * creating a game where the Body moves freely at any angle (i.e. like the way the ship moves in
   * the game Asteroids) then you will get a far smoother and more visually correct deceleration
   * by using damping, avoiding the axis-drift that is prone with linear deceleration.
   *
   * If you enable this property then you should use far smaller `drag` values than with linear, as
   * they are used as a multiplier on the velocity. Values such as 0.05 will give a nice slow
   * deceleration.
   */
  public useDamping = false
  /** The rate of change of this Body's `rotation`, in degrees per second.  */
  public angularVelocity = 0
  /** The Body's angular acceleration (change in angular velocity), in degrees per second squared. */
  public angularAcceleration = 0
  /**
   * Loss of angular velocity due to angular movement, in degrees per second.
   *
   * Angular drag is applied only when angular acceleration is zero.
   */
  public angularDrag = 0
  /** The Body's maximum angular velocity, in degrees per second. */
  public maxAngular = 1000
  /**
   * The Body's inertia, relative to a default unit (1).
   * With `bounce`, this affects the exchange of momentum (velocities) during collisions.
   */
  public mass = 1
  /** The calculated angle of this Body's velocity vector, in radians, during the last step. */
  public angle = 0
  /** The calculated magnitude of the Body's velocity, in pixels per second, during the last step. */
  public speed = 0
  /**
   * The direction of the Body's velocity, as calculated during the last step.
   * This is a numeric constant value (FACING_UP, FACING_DOWN, FACING_LEFT, FACING_RIGHT).
   * If the Body is moving on both axes, this describes motion on the vertical axis only.
   */
  public facing: FACING = CONST.FACING.FACING_NONE
  /** Whether this Body can be moved by collisions with another Body. */
  public immovable = false
  /**
   * Sets if this Body can be pushed by another Body.
   *
   * A body that cannot be pushed will reflect back all of the velocity it is given to the
   * colliding body. If that body is also not pushable, then the separation will be split
   * between them evenly.
   *
   * If you want your body to never move or seperate at all, see the `setImmovable` method.
   *
   * By default, Dynamic Bodies are always pushable.
   */
  public pushable = true
  /** Whether the Body's position and rotation are affected by its velocity, acceleration, drag, and gravity. */
  public moves = true
  /**
   * A flag disabling the default horizontal separation of colliding bodies.
   * Pass your own `collideCallback` to the collider.
   */
  public customSeparateX = false
  /**
   * A flag disabling the default vertical separation of colliding bodies.
   * Pass your own `collideCallback` to the collider.
   */
  public customSeparateY = false
  /** The amount of horizontal overlap (before separation), if this Body is colliding with another. */
  public overlapX = 0
  /** The amount of vertical overlap (before separation), if this Body is colliding with another. */
  public overlapY = 0
  /** The amount of overlap (before separation), if this Body is circular and colliding with another circular body. */
  public overlapR = 0
  /** Whether this Body is overlapped with another and both are not moving, on at least one axis. */
  public embedded = false
  /** Whether this Body interacts with the world boundary. */
  public collideWorldBounds = false
  /**
   * Whether this Body is checked for collisions and for which directions.
   * You can set `checkCollision.none = true` to disable collision checks.
   */
  public checkCollision = {
    none: false,
    up: true,
    down: true,
    left: true,
    right: true
  }
  /**
   * Whether this Body is colliding with a Body or Static Body and in which direction.
   * In a collision where both bodies have zero velocity, `embedded` will be set instead.
   */
  public touching = {
    none: true,
    up: false,
    down: false,
    left: false,
    right: false
  }
  /** This Body's `touching` value during the previous step.  */
  public wasTouching = {
    none: true,
    up: false,
    down: false,
    left: false,
    right: false
  }
  /**
   * Whether this Body is colliding with a Static Body, a tile, or the world boundary.
   * In a collision with a Static Body, if this Body has zero velocity then `embedded` will be set instead.
   */
  public blocked = {
    none: true,
    up: false,
    down: false,
    left: false,
    right: false
  }
  /** The Body's physics type (dynamic or static). */
  public physicsType: PHYSICS_TYPE = CONST.PHYSICS_TYPE.DYNAMIC_BODY
  /** Cached horizontal scale of the Body's Game Object. */
  private _sx: number
  /** Cached vertical scale of the Body's Game Object. */
  private _sy: number
  /** The calculated change in the Body's horizontal position during the last step. */
  private _dx = 0
  /** The calculated change in the Body's vertical position during the last step. */
  private _dy = 0
  /** The final calculated change in the Body's horizontal position as of `postUpdate`. */
  private _tx = 0
  /** The final calculated change in the Body's vertical position as of `postUpdate`. */
  private _ty = 0
  /** Stores the Game Object's bounds. */
  private _bounds = new Rectangle()

  public isBody = true

  constructor(world: World, x: number, y: number, width = 64, height = 64) {
    this.world = world

    this.debugShowBody = world.defaults.debugShowBody
    this.debugShowVelocity = world.defaults.debugShowVelocity
    this.debugBodyColor = world.defaults.bodyDebugColor

    this.position = new Vector2(x, y)

    this.prev = this.position.clone()
    this.prevFrame = this.position.clone()

    this.rotation = 0
    this.preRotation = 0

    this.width = width
    this.height = height

    this.sourceWidth = width
    this.sourceHeight = height

    this.halfWidth = Math.abs(width / 2)
    this.halfHeight = Math.abs(height / 2)

    this.center = new Vector2(this.position.x + this.halfWidth, this.position.y + this.halfHeight)
    this.customBoundsRectangle = world.bounds

    this._sx = 1
    this._sy = 1
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

  /** Updates the Body's `center` from its `position`, `width`, and `height`. */
  updateCenter() {
    this.center.set(this.position.x + this.halfWidth, this.position.y + this.halfHeight)
  }

  /**
   * Prepares the Body for a physics step by resetting the `wasTouching`, `touching` and `blocked` states.
   *
   * This method is only called if the physics world is going to run a step this frame.
   */
  resetFlags(clear = false) {
    //  Store and reset collision flags
    const wasTouching = this.wasTouching
    const touching = this.touching
    const blocked = this.blocked

    if (clear) {
      wasTouching.none = true
      wasTouching.up = false
      wasTouching.down = false
      wasTouching.left = false
      wasTouching.right = false
    } else {
      wasTouching.none = touching.none
      wasTouching.up = touching.up
      wasTouching.down = touching.down
      wasTouching.left = touching.left
      wasTouching.right = touching.right
    }

    touching.none = true
    touching.up = false
    touching.down = false
    touching.left = false
    touching.right = false

    blocked.none = true
    blocked.up = false
    blocked.down = false
    blocked.left = false
    blocked.right = false

    this.overlapR = 0
    this.overlapX = 0
    this.overlapY = 0

    this.embedded = false
  }
  /**
   * Syncs the position body position with the parent Game Object.
   *
   * This method is called every game frame, regardless if the world steps or not.
   *
   * @param willStep - Will this Body run an update as well?
   * @param delta - The delta time, in seconds, elapsed since the last frame.
   */
  preUpdate(willStep: boolean, delta: number) {
    if (willStep) this.resetFlags()

    // MOD(yandeu): not sure we can to call this here
    // this.updateFromGameObject()

    // this.rotation = this.transform.rotation
    this.preRotation = this.rotation

    if (this.moves) {
      this.prev.x = this.position.x
      this.prev.y = this.position.y
      this.prevFrame.x = this.position.x
      this.prevFrame.y = this.position.y
    }

    if (willStep) this.update(delta)
  }

  /**
   * Performs a single physics step and updates the body velocity, angle, speed and other properties.
   *
   * This method can be called multiple times per game frame, depending on the physics step rate.
   *
   * The results are synced back to the Game Object in `postUpdate`.
   *
   * @param delta - The delta time, in seconds, elapsed since the last frame.
   */
  update(delta: number) {
    this.prev.x = this.position.x
    this.prev.y = this.position.y

    if (this.moves) {
      this.world.updateMotion(this, delta)

      const vx = this.velocity.x
      const vy = this.velocity.y

      this.newVelocity.set(vx * delta, vy * delta)

      this.position.add(this.newVelocity)

      this.updateCenter()

      this.angle = Math.atan2(vy, vx)
      this.speed = Math.sqrt(vx * vx + vy * vy)

      //  Now the update will throw collision checks at the Body
      //  And finally we'll integrate the new position back to the Sprite in postUpdate

      if (this.collideWorldBounds && this.checkWorldBounds() && this.onWorldBounds) {
        this.world.emit(
          Events.WORLD_BOUNDS,
          this,
          this.blocked.up,
          this.blocked.down,
          this.blocked.left,
          this.blocked.right
        )
      }
    }

    this._dx = this.position.x - this.prev.x
    this._dy = this.position.y - this.prev.y
  }

  /**
   * Feeds the Body results back into the parent Game Object.
   *
   * This method is called every game frame, regardless if the world steps or not.
   */
  postUpdate() {
    let dx = this.position.x - this.prevFrame.x
    let dy = this.position.y - this.prevFrame.y

    if (this.moves) {
      const mx = this.deltaMax.x
      const my = this.deltaMax.y

      if (mx !== 0 && dx !== 0) {
        if (dx < 0 && dx < -mx) {
          dx = -mx
        } else if (dx > 0 && dx > mx) {
          dx = mx
        }
      }

      if (my !== 0 && dy !== 0) {
        if (dy < 0 && dy < -my) {
          dy = -my
        } else if (dy > 0 && dy > my) {
          dy = my
        }
      }

      // this.gameObject.x += dx
      // this.gameObject.y += dy
    }

    if (dx < 0) {
      this.facing = CONST.FACING.FACING_LEFT
    } else if (dx > 0) {
      this.facing = CONST.FACING.FACING_RIGHT
    }

    if (dy < 0) {
      this.facing = CONST.FACING.FACING_UP
    } else if (dy > 0) {
      this.facing = CONST.FACING.FACING_DOWN
    }

    if (this.allowRotation) {
      // this.gameObject.angle += this.deltaZ()
    }

    this._tx = dx
    this._ty = dy
  }

  /**
   * Sets a custom collision boundary rectangle. Use if you want to have a custom
   * boundary instead of the world boundaries.
   *
   * @param bounds - The new boundary rectangle. Pass `null` to use the World bounds.
   */
  setBoundsRectangle(bounds?: Rectangle): this {
    this.customBoundsRectangle = !bounds ? this.world.bounds : bounds

    return this
  }

  /**
   * Checks for collisions between this Body and the world boundary and separates them.
   *
   * Returns true if this Body is colliding with the world boundary.
   */
  checkWorldBounds(): boolean {
    const pos = this.position
    const bounds = this.customBoundsRectangle
    const check = this.world.checkCollision

    const bx = this.worldBounce ? -this.worldBounce.x : -this.bounce.x
    const by = this.worldBounce ? -this.worldBounce.y : -this.bounce.y

    let wasSet = false

    if (pos.x < bounds.x && check.left) {
      pos.x = bounds.x
      this.velocity.x *= bx
      this.blocked.left = true
      wasSet = true
    } else if (this.right > bounds.right && check.right) {
      pos.x = bounds.right - this.width
      this.velocity.x *= bx
      this.blocked.right = true
      wasSet = true
    }

    if (pos.y < bounds.y && check.up) {
      pos.y = bounds.y
      this.velocity.y *= by
      this.blocked.up = true
      wasSet = true
    } else if (this.bottom > bounds.bottom && check.down) {
      pos.y = bounds.bottom - this.height
      this.velocity.y *= by
      this.blocked.down = true
      wasSet = true
    }

    if (wasSet) {
      this.blocked.none = false
      this.updateCenter()
    }

    return wasSet
  }

  /**
   * Sizes and positions this Body, as a rectangle.
   *
   * @param width - The width of the Body in pixels. Cannot be zero.
   * @param height - The height of the Body in pixels. Cannot be zero.
   */
  setSize(width: number, height: number): this {
    this.sourceWidth = width
    this.sourceHeight = height

    this.width = this.sourceWidth * this._sx
    this.height = this.sourceHeight * this._sy

    this.halfWidth = Math.floor(this.width / 2)
    this.halfHeight = Math.floor(this.height / 2)

    this.updateCenter()

    this.isCircle = false
    this.radius = 0

    return this
  }

  /**
   * Sizes and positions this Body, as a circle.
   *
   * @param radius - The radius of the Body, in source pixels.
   */
  setCircle(radius: number): this {
    if (radius > 0) {
      this.isCircle = true
      this.radius = radius

      this.sourceWidth = radius * 2
      this.sourceHeight = radius * 2

      this.width = this.sourceWidth * this._sx
      this.height = this.sourceHeight * this._sy

      this.halfWidth = Math.floor(this.width / 2)
      this.halfHeight = Math.floor(this.height / 2)

      this.updateCenter()
    } else {
      this.isCircle = false
    }

    return this
  }

  /**
   * Resets this Body at the new coordinates.
   * If the Body had any velocity or acceleration it is lost as a result of calling this.
   *
   * @param x - The horizontal position to place the Body.
   * @param y - The vertical position to place the Body.
   */
  reset(x: number, y: number) {
    this.stop()

    this.position.set(x, y)

    this.prev.copy(this.position)
    this.prevFrame.copy(this.position)

    // this.rotation = gameObject.angle
    // this.preRotation = gameObject.angle

    this.updateCenter()
    this.resetFlags(true)
  }

  /** Sets acceleration, velocity, and speed to zero. */
  stop(): this {
    this.velocity.set(0)
    this.acceleration.set(0)
    this.speed = 0
    this.angularVelocity = 0
    this.angularAcceleration = 0

    return this
  }

  /**
   * Copies the coordinates of this Body's edges into an object.
   *
   * @param {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} obj - An object to copy the values into.
   *
   * @return {Phaser.Types.Physics.Arcade.ArcadeBodyBounds} - An object with {x, y, right, bottom}.
   */
  getBounds(obj) {
    obj.x = this.x
    obj.y = this.y
    obj.right = this.right
    obj.bottom = this.bottom

    return obj
  }

  /**
   * Tests if the coordinates are within this Body.
   *
   * Returns true if (x, y) is within this Body.
   *
   * @param x - The horizontal coordinate.
   * @param y - The vertical coordinate.
   */
  hitTest(x: number, y: number): boolean {
    if (!this.isCircle) {
      return RectangleContains(this, x, y)
    }

    //  Check if x/y are within the bounds first
    if (this.radius > 0 && x >= this.left && x <= this.right && y >= this.top && y <= this.bottom) {
      const dx = (this.center.x - x) * (this.center.x - x)
      const dy = (this.center.y - y) * (this.center.y - y)

      return dx + dy <= this.radius * this.radius
    }

    return false
  }

  /**
   * Whether this Body is touching a tile or the world boundary while moving down.
   *
   * Returns true if touching.
   */
  onFloor(): boolean {
    return this.blocked.down
  }

  /**
   * Whether this Body is touching a tile or the world boundary while moving up.
   *
   * Returns true if touching.
   */
  onCeiling(): boolean {
    return this.blocked.up
  }

  /**
   * Whether this Body is touching a tile or the world boundary while moving left or right.
   *
   * Returns true if touching.
   */
  onWall(): boolean {
    return this.blocked.left || this.blocked.right
  }

  /**
   * The absolute (non-negative) change in this Body's horizontal position from the previous step.
   *
   * Returns the delta value.
   */
  deltaAbsX(): number {
    return this._dx > 0 ? this._dx : -this._dx
  }

  /**
   * The absolute (non-negative) change in this Body's vertical position from the previous step.
   *
   * Returns the delta value.
   */
  deltaAbsY(): number {
    return this._dy > 0 ? this._dy : -this._dy
  }

  /**
   * The change in this Body's horizontal position from the previous step.
   * This value is set during the Body's update phase.
   *
   * As a Body can update multiple times per step this may not hold the final
   * delta value for the Body. In this case, please see the `deltaXFinal` method.
   *
   * Returns the delta value.
   */
  deltaX(): number {
    return this._dx
  }

  /**
   * The change in this Body's vertical position from the previous step.
   * This value is set during the Body's update phase.
   *
   * As a Body can update multiple times per step this may not hold the final
   * delta value for the Body. In this case, please see the `deltaYFinal` method.
   *
   * Returns the delta value.
   */
  deltaY(): number {
    return this._dy
  }

  /**
   * The change in this Body's horizontal position from the previous game update.
   *
   * This value is set during the `postUpdate` phase and takes into account the
   * `deltaMax` and final position of the Body.
   *
   * Because this value is not calculated until `postUpdate`, you must listen for it
   * during a Scene `POST_UPDATE` or `RENDER` event, and not in `update`, as it will
   * not be calculated by that point. If you _do_ use these values in `update` they
   * will represent the delta from the _previous_ game frame.
   *
   * Returns the final delta x value.
   */
  deltaXFinal(): number {
    return this._tx
  }

  /**
   * The change in this Body's vertical position from the previous game update.
   *
   * This value is set during the `postUpdate` phase and takes into account the
   * `deltaMax` and final position of the Body.
   *
   * Because this value is not calculated until `postUpdate`, you must listen for it
   * during a Scene `POST_UPDATE` or `RENDER` event, and not in `update`, as it will
   * not be calculated by that point. If you _do_ use these values in `update` they
   * will represent the delta from the _previous_ game frame.
   *
   * Returns the final delta y value.
   */
  deltaYFinal(): number {
    return this._ty
  }

  /**
   * The change in this Body's rotation from the previous step, in degrees.
   *
   * Returns the delta value.
   */
  deltaZ(): number {
    return this.rotation - this.preRotation
  }

  /**
   * Disables this Body and marks it for deletion by the simulation.
   *
   * @method Phaser.Physics.Arcade.Body#destroy
   * @since 3.0.0
   */
  destroy() {
    this.enable = false

    if (this.world) {
      this.world.pendingDestroy.add(this)
    }
  }

  /**
   * Draws this Body and its velocity, if enabled.
   *
   * @method Phaser.Physics.Arcade.Body#drawDebug
   * @since 3.0.0
   *
   * @param {CanvasRenderingContext2D} Context2D - The Context2D to draw on.
   */
  drawDebug(ctx: CanvasRenderingContext2D) {
    const pos = this.position

    const x = pos.x + this.halfWidth
    const y = pos.y + this.halfHeight

    const defaultStrokeWidth = 1

    const lineBetween = (x1, y1, x2, y2) => {
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
    }

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

    const lineStyle = (width, color, unknown?) => {
      ctx.lineWidth = width
      ctx.strokeStyle = colorToHex(color)
    }

    const strokeCircle = (x, y, radius) => {
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
    }

    if (this.debugShowBody) {
      ctx.beginPath()

      lineStyle(defaultStrokeWidth, this.debugBodyColor)

      if (this.isCircle) {
        strokeCircle(x, y, this.width / 2)
      } else {
        //  Only draw the sides where checkCollision is true, similar to debugger in layer
        if (this.checkCollision.up) {
          lineBetween(pos.x, pos.y, pos.x + this.width, pos.y)
        }

        if (this.checkCollision.right) {
          lineBetween(pos.x + this.width, pos.y, pos.x + this.width, pos.y + this.height)
        }

        if (this.checkCollision.down) {
          lineBetween(pos.x, pos.y + this.height, pos.x + this.width, pos.y + this.height)
        }

        if (this.checkCollision.left) {
          lineBetween(pos.x, pos.y, pos.x, pos.y + this.height)
        }
      }

      ctx.stroke()
    }

    if (this.debugShowVelocity) {
      ctx.beginPath()
      lineStyle(defaultStrokeWidth, this.world?.defaults?.velocityDebugColor || 0x00ff00, 1)
      lineBetween(x, y, x + this.velocity.x / 2, y + this.velocity.y / 2)
      ctx.stroke()
    }
  }

  /**
   * Whether this Body will be drawn to the debug display.
   *
   * @method Phaser.Physics.Arcade.Body#willDrawDebug
   * @since 3.0.0
   *
   * @return {boolean} True if either `debugShowBody` or `debugShowVelocity` are enabled.
   */
  willDrawDebug() {
    return this.debugShowBody || this.debugShowVelocity
  }

  /**
   * Sets whether this Body collides with the world boundary.
   *
   * Optionally also sets the World Bounce and `onWorldBounds` values.
   *
   * @method Phaser.Physics.Arcade.Body#setCollideWorldBounds
   * @since 3.0.0
   *
   * @param {boolean} [value=true] - `true` if the Body should collide with the world bounds, otherwise `false`.
   * @param {number} [bounceX] - If given this replaces the Body's `worldBounce.x` value.
   * @param {number} [bounceY] - If given this replaces the Body's `worldBounce.y` value.
   * @param {boolean} [onWorldBounds] - If given this replaces the Body's `onWorldBounds` value.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setCollideWorldBounds(value, bounceX, bounceY, onWorldBounds) {
    if (value === undefined) {
      value = true
    }

    this.collideWorldBounds = value

    const setBounceX = bounceX !== undefined
    const setBounceY = bounceY !== undefined

    if (setBounceX || setBounceY) {
      if (!this.worldBounce) {
        this.worldBounce = new Vector2()
      }

      if (setBounceX) {
        this.worldBounce.x = bounceX
      }

      if (setBounceY) {
        this.worldBounce.y = bounceY
      }
    }

    if (onWorldBounds !== undefined) {
      this.onWorldBounds = onWorldBounds
    }

    return this
  }

  /**
   * Sets the Body's velocity.
   *
   * @method Phaser.Physics.Arcade.Body#setVelocity
   * @since 3.0.0
   *
   * @param {number} x - The horizontal velocity, in pixels per second.
   * @param {number} [y=x] - The vertical velocity, in pixels per second.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setVelocity(x, y) {
    this.velocity.set(x, y)

    x = this.velocity.x
    y = this.velocity.y

    this.speed = Math.sqrt(x * x + y * y)

    return this
  }

  /**
   * Sets the Body's horizontal velocity.
   *
   * @method Phaser.Physics.Arcade.Body#setVelocityX
   * @since 3.0.0
   *
   * @param {number} value - The velocity, in pixels per second.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setVelocityX(value) {
    this.velocity.x = value

    const x = value
    const y = this.velocity.y

    this.speed = Math.sqrt(x * x + y * y)

    return this
  }

  /**
   * Sets the Body's vertical velocity.
   *
   * @method Phaser.Physics.Arcade.Body#setVelocityY
   * @since 3.0.0
   *
   * @param {number} value - The velocity, in pixels per second.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setVelocityY(value) {
    this.velocity.y = value

    const x = this.velocity.x
    const y = value

    this.speed = Math.sqrt(x * x + y * y)

    return this
  }

  /**
   * Sets the Body's maximum velocity.
   *
   * @method Phaser.Physics.Arcade.Body#setMaxVelocity
   * @since 3.10.0
   *
   * @param {number} x - The horizontal velocity, in pixels per second.
   * @param {number} [y=x] - The vertical velocity, in pixels per second.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setMaxVelocity(x, y) {
    this.maxVelocity.set(x, y)

    return this
  }

  /**
   * Sets the Body's maximum horizontal velocity.
   *
   * @method Phaser.Physics.Arcade.Body#setMaxVelocityX
   * @since 3.50.0
   *
   * @param {number} value - The maximum horizontal velocity, in pixels per second.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setMaxVelocityX(value) {
    this.maxVelocity.x = value

    return this
  }

  /**
   * Sets the Body's maximum vertical velocity.
   *
   * @method Phaser.Physics.Arcade.Body#setMaxVelocityY
   * @since 3.50.0
   *
   * @param {number} value - The maximum vertical velocity, in pixels per second.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setMaxVelocityY(value) {
    this.maxVelocity.y = value

    return this
  }

  /**
   * Sets the maximum speed the Body can move.
   *
   * @method Phaser.Physics.Arcade.Body#setMaxSpeed
   * @since 3.16.0
   *
   * @param {number} value - The maximum speed value, in pixels per second. Set to a negative value to disable.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setMaxSpeed(value) {
    this.maxSpeed = value

    return this
  }

  /**
   * Sets the Body's bounce.
   *
   * @method Phaser.Physics.Arcade.Body#setBounce
   * @since 3.0.0
   *
   * @param {number} x - The horizontal bounce, relative to 1.
   * @param {number} y - The vertical bounce, relative to 1.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setBounce(x, y) {
    this.bounce.set(x, y)

    return this
  }

  /**
   * Sets the Body's horizontal bounce.
   *
   * @method Phaser.Physics.Arcade.Body#setBounceX
   * @since 3.0.0
   *
   * @param {number} value - The bounce, relative to 1.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setBounceX(value) {
    this.bounce.x = value

    return this
  }

  /**
   * Sets the Body's vertical bounce.
   *
   * @method Phaser.Physics.Arcade.Body#setBounceY
   * @since 3.0.0
   *
   * @param {number} value - The bounce, relative to 1.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setBounceY(value) {
    this.bounce.y = value

    return this
  }

  /**
   * Sets the Body's acceleration.
   *
   * @method Phaser.Physics.Arcade.Body#setAcceleration
   * @since 3.0.0
   *
   * @param {number} x - The horizontal component, in pixels per second squared.
   * @param {number} y - The vertical component, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAcceleration(x, y) {
    this.acceleration.set(x, y)

    return this
  }

  /**
   * Sets the Body's horizontal acceleration.
   *
   * @method Phaser.Physics.Arcade.Body#setAccelerationX
   * @since 3.0.0
   *
   * @param {number} value - The acceleration, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAccelerationX(value) {
    this.acceleration.x = value

    return this
  }

  /**
   * Sets the Body's vertical acceleration.
   *
   * @method Phaser.Physics.Arcade.Body#setAccelerationY
   * @since 3.0.0
   *
   * @param {number} value - The acceleration, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAccelerationY(value) {
    this.acceleration.y = value

    return this
  }

  /**
   * Enables or disables drag.
   *
   * @method Phaser.Physics.Arcade.Body#setAllowDrag
   * @since 3.9.0
   * @see Phaser.Physics.Arcade.Body#allowDrag
   *
   * @param {boolean} [value=true] - `true` to allow drag on this body, or `false` to disable it.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAllowDrag(value) {
    if (value === undefined) {
      value = true
    }

    this.allowDrag = value

    return this
  }

  /**
   * Enables or disables gravity's effect on this Body.
   *
   * @method Phaser.Physics.Arcade.Body#setAllowGravity
   * @since 3.9.0
   * @see Phaser.Physics.Arcade.Body#allowGravity
   *
   * @param {boolean} [value=true] - `true` to allow gravity on this body, or `false` to disable it.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAllowGravity(value) {
    if (value === undefined) {
      value = true
    }

    this.allowGravity = value

    return this
  }

  /**
   * Enables or disables rotation.
   *
   * @method Phaser.Physics.Arcade.Body#setAllowRotation
   * @since 3.9.0
   * @see Phaser.Physics.Arcade.Body#allowRotation
   *
   * @param {boolean} [value=true] - `true` to allow rotation on this body, or `false` to disable it.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAllowRotation(value) {
    if (value === undefined) {
      value = true
    }

    this.allowRotation = value

    return this
  }

  /**
   * Sets the Body's drag.
   *
   * @method Phaser.Physics.Arcade.Body#setDrag
   * @since 3.0.0
   *
   * @param {number} x - The horizontal component, in pixels per second squared.
   * @param {number} y - The vertical component, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setDrag(x, y) {
    this.drag.set(x, y)

    return this
  }

  /**
   * If this Body is using `drag` for deceleration this property controls how the drag is applied.
   * If set to `true` drag will use a damping effect rather than a linear approach. If you are
   * creating a game where the Body moves freely at any angle (i.e. like the way the ship moves in
   * the game Asteroids) then you will get a far smoother and more visually correct deceleration
   * by using damping, avoiding the axis-drift that is prone with linear deceleration.
   *
   * If you enable this property then you should use far smaller `drag` values than with linear, as
   * they are used as a multiplier on the velocity. Values such as 0.95 will give a nice slow
   * deceleration, where-as smaller values, such as 0.5 will stop an object almost immediately.
   *
   * @method Phaser.Physics.Arcade.Body#setDamping
   * @since 3.50.0
   *
   * @param {boolean} value - `true` to use damping, or `false` to use drag.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setDamping(value) {
    this.useDamping = value

    return this
  }

  /**
   * Sets the Body's horizontal drag.
   *
   * @method Phaser.Physics.Arcade.Body#setDragX
   * @since 3.0.0
   *
   * @param {number} value - The drag, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setDragX(value) {
    this.drag.x = value

    return this
  }

  /**
   * Sets the Body's vertical drag.
   *
   * @method Phaser.Physics.Arcade.Body#setDragY
   * @since 3.0.0
   *
   * @param {number} value - The drag, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setDragY(value) {
    this.drag.y = value

    return this
  }

  /**
   * Sets the Body's gravity.
   *
   * @method Phaser.Physics.Arcade.Body#setGravity
   * @since 3.0.0
   *
   * @param {number} x - The horizontal component, in pixels per second squared.
   * @param {number} y - The vertical component, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setGravity(x, y) {
    this.gravity.set(x, y)

    return this
  }

  /**
   * Sets the Body's horizontal gravity.
   *
   * @method Phaser.Physics.Arcade.Body#setGravityX
   * @since 3.0.0
   *
   * @param {number} value - The gravity, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setGravityX(value) {
    this.gravity.x = value

    return this
  }

  /**
   * Sets the Body's vertical gravity.
   *
   * @method Phaser.Physics.Arcade.Body#setGravityY
   * @since 3.0.0
   *
   * @param {number} value - The gravity, in pixels per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setGravityY(value) {
    this.gravity.y = value

    return this
  }

  /**
   * Sets the Body's friction.
   *
   * @method Phaser.Physics.Arcade.Body#setFriction
   * @since 3.0.0
   *
   * @param {number} x - The horizontal component, relative to 1.
   * @param {number} y - The vertical component, relative to 1.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setFriction(x, y) {
    this.friction.set(x, y)

    return this
  }

  /**
   * Sets the Body's horizontal friction.
   *
   * @method Phaser.Physics.Arcade.Body#setFrictionX
   * @since 3.0.0
   *
   * @param {number} value - The friction value, relative to 1.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setFrictionX(value) {
    this.friction.x = value

    return this
  }

  /**
   * Sets the Body's vertical friction.
   *
   * @method Phaser.Physics.Arcade.Body#setFrictionY
   * @since 3.0.0
   *
   * @param {number} value - The friction value, relative to 1.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setFrictionY(value) {
    this.friction.y = value

    return this
  }

  /**
   * Sets the Body's angular velocity.
   *
   * @method Phaser.Physics.Arcade.Body#setAngularVelocity
   * @since 3.0.0
   *
   * @param {number} value - The velocity, in degrees per second.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAngularVelocity(value) {
    this.angularVelocity = value

    return this
  }

  /**
   * Sets the Body's angular acceleration.
   *
   * @method Phaser.Physics.Arcade.Body#setAngularAcceleration
   * @since 3.0.0
   *
   * @param {number} value - The acceleration, in degrees per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAngularAcceleration(value) {
    this.angularAcceleration = value

    return this
  }

  /**
   * Sets the Body's angular drag.
   *
   * @method Phaser.Physics.Arcade.Body#setAngularDrag
   * @since 3.0.0
   *
   * @param {number} value - The drag, in degrees per second squared.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setAngularDrag(value) {
    this.angularDrag = value

    return this
  }

  /**
   * Sets the Body's mass.
   *
   * @method Phaser.Physics.Arcade.Body#setMass
   * @since 3.0.0
   *
   * @param {number} value - The mass value, relative to 1.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setMass(value) {
    this.mass = value

    return this
  }

  /**
   * Sets the Body's `immovable` property.
   *
   * @method Phaser.Physics.Arcade.Body#setImmovable
   * @since 3.0.0
   *
   * @param {boolean} [value=true] - The value to assign to `immovable`.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setImmovable(value) {
    if (value === undefined) {
      value = true
    }

    this.immovable = value

    return this
  }

  /**
   * Sets the Body's `enable` property.
   *
   * @method Phaser.Physics.Arcade.Body#setEnable
   * @since 3.15.0
   *
   * @param {boolean} [value=true] - The value to assign to `enable`.
   *
   * @return {Phaser.Physics.Arcade.Body} This Body object.
   */
  setEnable(value) {
    if (value === undefined) {
      value = true
    }

    this.enable = value

    return this
  }

  /**
   * This is an internal handler, called by the `ProcessX` function as part
   * of the collision step. You should almost never call this directly.
   *
   * @method Phaser.Physics.Arcade.Body#processX
   * @since 3.50.0
   *
   * @param {number} x - The amount to add to the Body position.
   * @param {number} [vx] - The amount to add to the Body velocity.
   * @param {boolean} [left] - Set the blocked.left value?
   * @param {boolean} [right] - Set the blocked.right value?
   */
  processX(x, vx, left, right) {
    this.x += x

    this.updateCenter()

    if (vx !== null) {
      this.velocity.x = vx
    }

    const blocked = this.blocked

    if (left) {
      blocked.left = true
    }

    if (right) {
      blocked.right = true
    }
  }

  /**
   * This is an internal handler, called by the `ProcessY` function as part
   * of the collision step. You should almost never call this directly.
   *
   * @method Phaser.Physics.Arcade.Body#processY
   * @since 3.50.0
   *
   * @param {number} y - The amount to add to the Body position.
   * @param {number} [vy] - The amount to add to the Body velocity.
   * @param {boolean} [up] - Set the blocked.up value?
   * @param {boolean} [down] - Set the blocked.down value?
   */
  processY(y, vy, up, down) {
    this.y += y

    this.updateCenter()

    if (vy !== null) {
      this.velocity.y = vy
    }

    const blocked = this.blocked

    if (up) {
      blocked.up = true
    }

    if (down) {
      blocked.down = true
    }
  }

  /**
   * The Bodys horizontal position (left edge).
   *
   * @name Phaser.Physics.Arcade.Body#x
   * @type {number}
   * @since 3.0.0
   */
  get x() {
    return this.position.x
  }

  set x(value) {
    this.position.x = value
  }

  /**
   * The Bodys vertical position (top edge).
   *
   * @name Phaser.Physics.Arcade.Body#y
   * @type {number}
   * @since 3.0.0
   */
  get y() {
    return this.position.y
  }

  set y(value) {
    this.position.y = value
  }

  /**
   * The left edge of the Body. Identical to x.
   *
   * @name Phaser.Physics.Arcade.Body#left
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get left() {
    return this.position.x
  }

  /**
   * The right edge of the Body.
   *
   * @name Phaser.Physics.Arcade.Body#right
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get right() {
    return this.position.x + this.width
  }

  /**
   * The top edge of the Body. Identical to y.
   *
   * @name Phaser.Physics.Arcade.Body#top
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get top() {
    return this.position.y
  }

  /**
   * The bottom edge of this Body.
   *
   * @name Phaser.Physics.Arcade.Body#bottom
   * @type {number}
   * @readonly
   * @since 3.0.0
   */
  get bottom() {
    return this.position.y + this.height
  }
}
